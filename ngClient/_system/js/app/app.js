/***
 * App module: main
 *
 * Bootstrap the app.
 *
 ***/
(function () {
    'use strict';

    angular.module('main', [
        'ngRoute',
        'ngSanitize',
        'breeze.angular',
        'angular-google-analytics',
        'angularUtils.directives.dirDisqus',
        'ui.bootstrap',
        'highcharts-ng'
    ]);

    angular.module('main')
        .run(['logger', mainRun]);

    function mainRun(logger) {
        logger = logger.forSource('mainRun');
    }

})();

/*
 * Authorization interceptors for angular & OData
 */

(function () {
    'use strict';

    angular.module('main')
        .config(['$httpProvider', authorizationConfig]);

    angular.module('main')
        .run(['$window', 'logger', authorizationRun]);

    var interceptorId = 'angularInterceptor';
    angular.module('main')
        .factory(interceptorId, ['$q', '$window', 'logger', angularInterceptor]);

    function authorizationConfig($httpProvider) {
        $httpProvider.interceptors.push(interceptorId);
    }

    function authorizationRun($window, logger) {

        // Logger
        logger = logger.forSource('authorizationRun');

        // OData interceptor
        var oldClient = $window.OData.defaultHttpClient;
        var newClient = {
            request: function (request, success, error) {
                request.headers = request.headers || {};
                var token = angular.fromJson($window.localStorage.getItem('token'));
                request.headers.Authorization = token !== null ? 'Bearer ' + token.access_token : '';
                return oldClient.request(request, success, error);
            }
        };
        $window.OData.defaultHttpClient = newClient;
    }

    // angular
    function angularInterceptor($q, $window, logger) {

        // Logger
        logger = logger.forSource(interceptorId);

        return {
            request: function (config) {
                config.headers = config.headers || {};
                var token = angular.fromJson($window.localStorage.getItem('token'));
                config.headers.Authorization = token !== null ? 'Bearer ' + token.access_token : '';
                return config;
            },
            response: function (response) {
                if (response.status === 401) {
                    // handle the case where the user is not authenticated
                }
                return response || $q.when(response);
            }
        };
    }
})();

(function () {
    'use strict';

    angular.module('main')
        .config(['breezeProvider', breezeConfig]);

    function breezeConfig(breezeProvider) {

        breeze.config.initializeAdapterInstance('uriBuilder', 'odata');

        // Use Web API OData to query and save
        var adapter = breeze.config.initializeAdapterInstance('dataService', 'webApiOData', true);
        adapter.getRoutePrefix = getRoutePrefix_Microsoft_AspNet_WebApi_OData_5_3_x;

        // convert between server-side PascalCase and client-side camelCase
        // breeze.NamingConvention.camelCase.setAsDefault();

        function getRoutePrefix_Microsoft_AspNet_WebApi_OData_5_3_x(dataService) {

            // Copied from breeze.debug and modified for Web API OData v.5.3.1.
            var parser = null;
            if (typeof document === 'object') { // browser
                parser = document.createElement('a');
                parser.href = dataService.serviceName;
            } else { // node
                parser = url.parse(dataService.serviceName);
            }

            // THE CHANGE FOR 5.3.1: Add '/' prefix to pathname
            var prefix = parser.pathname;
            if (prefix[0] !== '/') {
                prefix = '/' + prefix;
            } // add leading '/'  (only in IE)
            if (prefix.substr(-1) !== '/') {
                prefix += '/';
            } // ensure trailing '/'

            return prefix;
        }
    }
})();

(function () {
    'use strict';

    var factoryId = 'exceptionHandlerExtension';
    angular.module('main')
        .config(['$provide', extendHandler]);

    function extendHandler($provide) {
        $provide.decorator('$exceptionHandler', ['$delegate', '$injector', '$window', 'serviceAppUrl', 'logger', exceptionHandlerExtension]);
    }

    function exceptionHandlerExtension($delegate, $injector, $window, serviceAppUrl, logger) {
        logger = logger.forSource(factoryId);

        var exceptionUrl = serviceAppUrl + '/api/Exception/Record';

        return function (exception, cause) {

            // No need to call the base, will be logged here
            // $delegate(exception, cause);

            // Show a generic error to the user
            logger.logError('Something went wrong, please try again later!', null, true);

            getSourceMappedStackTrace(exception)
                .then(function (sourceMappedStack) {

                    // Send the exception to the server
                    var $location = $injector.get('$location');
                    var $http = $injector.get('$http');

                    var exceptionModel = {
                        Message: exception.message,
                        Cause: cause,
                        Url: $location.url(),
                        Stack: sourceMappedStack
                    };

                    $http.post(exceptionUrl, exceptionModel);

                    // Rethrow the exception
                    setTimeout(function () {
                        throw exception;
                    });
                });
        };

        function getSourceMappedStackTrace(exception) {
            var $q = $injector.get('$q'),
                $http = $injector.get('$http'),
                SMConsumer = $window.sourceMap.SourceMapConsumer,
                cache = {};

            if (exception.stack) { // not all browsers support stack traces
                return $q.all($.map(exception.stack.split(/\n/), function (stackLine) {
                    var match = stackLine.match(/^(.+)(http.+):(\d+):(\d+)/);
                    if (match) {
                        var prefix = match[1], url = match[2], line = match[3], col = match[4];

                        return getMapForScript(url).then(function (map) {

                            var pos = map.originalPositionFor({
                                line: parseInt(line, 10),
                                column: parseInt(col, 10)
                            });

                            var mangledName = prefix.match(/\s*(at)?\s*(.*?)\s*(\(|@)/);
                            mangledName = (mangledName && mangledName[2]) || '';

                            return '    at ' + (pos.name ? pos.name : mangledName) + ' ' +
                              $window.location.origin + pos.source + ':' + pos.line + ':' +
                              pos.column;
                        }, function () {
                            return stackLine;
                        });
                    } else {
                        return $q.when(stackLine);
                    }
                })).then(function (lines) {
                    return lines.join('\n');
                });
            } else {
                return $q.when('');
            }

            // Retrieve a SourceMap object for a minified script URL
            function getMapForScript(url) {
                if (cache[url]) {
                    return cache[url];
                } else {
                    var promise = $http.get(url).then(function (response) {
                        var m = response.data.match(/\/\/# sourceMappingURL=(.+\.map)/);
                        if (m) {
                            var path = url.match(/^(.+)\/[^/]+$/);
                            path = path && path[1];
                            return $http.get(path + '/' + m[1]).then(function (response) {
                                return new SMConsumer(response.data);
                            });
                        } else {
                            return $q.reject();
                        }
                    });
                    cache[url] = promise;
                    return promise;
                }
            }
        }
    }
})();

(function () {
    'use strict';

    angular.module('main')
        .config(['AnalyticsProvider', 'analyticsTrackingCode', 'analyticsDomainName', analyticsConfig]);

    angular.module('main').run(['Analytics', function (Analytics) { }]);

    function analyticsConfig(AnalyticsProvider, analyticsTrackingCode, analyticsDomainName) {
        AnalyticsProvider.setAccount(analyticsTrackingCode)
            .setDomainName(analyticsDomainName)
            .ignoreFirstPageLoad(true);
    }
})();

(function () {
    'use strict';

    angular.module('main')
        .config(['$routeProvider', '$locationProvider', routeConfig]);

    angular.module('main')
        .run(['$rootScope', '$location', 'locationHistory', 'logger', routeRun]);

    function routeConfig($routeProvider, $locationProvider) {

        // Routes
        $routeProvider

            /* Content */
            .when('/', { title: getContentRouteTitle, templateUrl: getContentTemplateUrl, enableDisqus: true, resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/default.aspx', { title: getContentRouteTitle, templateUrl: getContentTemplateUrl, enableDisqus: true, resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            // Different than normal content, enableDisqus: false
            .when('/_system/content/404/', { title: function () { return '404'; }, templateUrl: '/_system/views/content/404.html?v=0.49.0', enableDisqus: false, resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/_system/content/:key/', { title: getContentRouteTitle, templateUrl: getContentTemplateUrl, enableDisqus: true, resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })

            /* CMRP List + View + Edit pages */
            .when('/_system/resourcePool', { title: function () { return 'CMRP List'; }, templateUrl: '/_system/views/resourcePool/resourcePoolList.html?v=0.49.1', resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/_system/resourcePool/new', { title: function () { return 'New CMRP'; }, templateUrl: '/_system/views/resourcePool/resourcePoolManage.html?v=0.49.0', resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/_system/resourcePool/:resourcePoolId/edit', { title: function () { return 'Edit CMRP'; }, templateUrl: '/_system/views/resourcePool/resourcePoolManage.html?v=0.49.0', resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/_system/resourcePool/:resourcePoolId', { title: function () { return 'View CMRP'; }, templateUrl: '/_system/views/resourcePool/resourcePoolView.html?v=0.49.0', enableDisqus: true, resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })

            /* Account */
            .when('/_system/account/accountEdit', { title: function () { return 'Account Edit'; }, templateUrl: '/_system/views/account/accountEdit.html?v=0.49.0', accessType: 'authenticatedRequired', resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/_system/account/addPassword', { title: function () { return 'Add Password'; }, templateUrl: '/_system/views/account/addPassword.html?v=0.49.0', accessType: 'authenticatedRequired', resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/_system/account/changeEmail', { title: function () { return 'Change Email'; }, templateUrl: '/_system/views/account/changeEmail.html?v=0.49.0', accessType: 'authenticatedRequired', resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/_system/account/changePassword', { title: function () { return 'Change Password'; }, templateUrl: '/_system/views/account/changePassword.html?v=0.49.0', accessType: 'authenticatedRequired', resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/_system/account/confirmEmail', { title: function () { return 'Confirm Email'; }, templateUrl: '/_system/views/account/confirmEmail.html?v=0.49.0', accessType: 'authenticatedRequired', resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/_system/account/login', { title: function () { return 'Login'; }, templateUrl: '/_system/views/account/login.html?v=0.49.0', accessType: 'unauthenticatedRequired', resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/_system/account/register', { title: function () { return 'Register'; }, templateUrl: '/_system/views/account/register.html?v=0.49.0', accessType: 'unauthenticatedRequired', resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })
            .when('/_system/account/resetPassword', { title: function () { return 'Reset Password'; }, templateUrl: '/_system/views/account/resetPassword.html?v=0.49.0', accessType: 'unauthenticatedRequired', resolve: { validateAccess: ['userFactory', '$route', '$q', 'locationHistory', '$location', 'logger', validateAccess] } })

            /* Otherwise */
            .otherwise({ redirectTo: '/_system/content/404' }); // TODO Is it possible to return Response.StatusCode = 404; ?

        // Html5Mode is on, if supported (# will not be used)
        if (window.history && window.history.pushState) {
            $locationProvider.html5Mode({ enabled: true });
        }

        function getManageRouteTitle(params) {

            var entity = params.entity[0].toUpperCase() + params.entity.substring(1);

            var action = typeof params.action !== 'undefined' ?
                params.action[0].toUpperCase() + params.action.substring(1) :
                'List';

            return entity + ' ' + action;
        }

        function getContentRouteTitle(params) {

            var title = typeof params.key !== 'undefined' ?
                params.key[0] + params.key.substring(1) :
                'Home'; // Default view

            return title;
        }

        function getContentTemplateUrl(params) {

            var key = typeof params.key !== 'undefined' ?
                params.key :
                'home'; // Default view

            return '/_system/views/content/' + key + '.html?v=0.49.0';
        }

        function validateAccess(userFactory, $route, $q, locationHistory, $location, logger) {

            logger = logger.forSource('validateAccess');

            var deferred = $q.defer();

            locationHistory.createItem($location, $route.current)
                .then(function () {
                    userFactory.getCurrentUser()
                        .then(function (currentUser) {
                            if ($route.current.accessType !== 'undefined') {

                                // Invalid access cases
                                if (($route.current.accessType === 'unauthenticatedRequired' && currentUser.isAuthenticated()) ||
                                    ($route.current.accessType === 'authenticatedRequired' && !currentUser.isAuthenticated())) {
                                    deferred.reject({ accessType: $route.current.accessType });
                                }
                            }

                            deferred.resolve();
                        })
                        .catch(function () {
                            deferred.reject(); // TODO Handle?
                        });
                });

            return deferred.promise;
        }
    }

    function routeRun($rootScope, $location, locationHistory, logger) {

        // Logger
        logger = logger.forSource('routeRun');

        $rootScope.$on('$routeChangeSuccess', routeChangeSuccess);
        $rootScope.$on('$routeChangeError', routeChangeError);

        // Navigate to correct page in 'Invalid access' cases
        function routeChangeError(event, current, previous, eventObj) {
            if (eventObj.accessType === 'unauthenticatedRequired') {
                $location.url(locationHistory.previousItem('unauthenticatedRequired').url());
            } else if (eventObj.accessType === 'authenticatedRequired') {
                $location.url('/_system/account/login?error=To be able to continue, please login first');
            }
        }

        function routeChangeSuccess(event, current, previous) {

            // View title
            var viewTitle = '';
            if (typeof current.title !== 'undefined') {
                // TODO Is this correct?
                viewTitle = current.title(current.params);
            }
            $rootScope.viewTitle = viewTitle;
        }
    }
})();

(function () {
    'use strict';

    var factoryId = 'Element';
    angular.module('main')
        .factory(factoryId, ['$rootScope', 'logger', elementFactory]);

    function elementFactory($rootScope, logger) {

        // Logger
        logger = logger.forSource(factoryId);

        // Server-side
        Object.defineProperty(Element.prototype, 'IsMainElement', {
            enumerable: true,
            configurable: true,
            get: function () { return this.backingFields._IsMainElement; },
            set: function (value) {

                var self = this;

                if (self.backingFields._IsMainElement !== value) {
                    self.backingFields._IsMainElement = value;

                    // TODO When this prop set in constructor, ResourcePool is null, in such case, ignore
                    // However, it would be better to always have a ResourcePool? / SH - 29 Nov. '15
                    if (typeof self.ResoucePool === 'undefined') {
                        return;
                    }

                    // Main element check: If there is another element that its IsMainElement flag is true, make it false
                    if (value) {
                        self.ResourcePool.ElementSet.forEach(function (element) {
                            if (element !== self && element.IsMainElement) {
                                element.IsMainElement = false;
                            }
                        });

                        // Update selectedElement of resourcePool
                        self.ResourcePool.selectedElement(self);
                    }
                }
            }
        });

        // Return
        return Element;

        function Element() {

            var self = this;

            // Server-side
            self.Id = 0;
            self.Name = '';
            // TODO breezejs - Cannot assign a navigation property in an entity ctor
            //self.ResourcePool = null;
            //self.ElementFieldSet = [];
            //self.ElementItemSet = [];
            //self.ParentFieldSet = [];

            // Local variables
            self.backingFields = {
                // Server-side
                _IsMainElement: false,

                // Client-side
                _parent: null,
                _familyTree: null,
                _elementFieldIndexSet: null,
                _indexRating: null,
                _directIncomeField: null,
                _multiplierField: null,
                _totalResourcePoolAmount: null
            };
            self.isEditing = false;

            // Functions
            self.directIncome = directIncome;
            self.directIncomeField = directIncomeField;
            self.directIncomeIncludingResourcePoolAmount = directIncomeIncludingResourcePoolAmount;
            self.elementFieldIndexSet = elementFieldIndexSet;
            self.familyTree = familyTree;
            self.fullSize = fullSize;
            self.indexRating = indexRating;
            self.multiplier = multiplier;
            self.multiplierField = multiplierField;
            self.parent = parent;
            self.resourcePoolAmount = resourcePoolAmount;
            self.setDirectIncomeField = setDirectIncomeField;
            self.setElementFieldIndexSet = setElementFieldIndexSet;
            self.setFamilyTree = setFamilyTree;
            self.setIndexRating = setIndexRating;
            self.setMultiplierField = setMultiplierField;
            self.setParent = setParent;
            self.totalDirectIncome = totalDirectIncome;
            self.totalDirectIncomeIncludingResourcePoolAmount = totalDirectIncomeIncludingResourcePoolAmount;
            self.totalIncome = totalIncome;
            self.totalIncomeAverage = totalIncomeAverage;
            self.totalResourcePoolAmount = totalResourcePoolAmount;

            /*** Implementations ***/

            function directIncome() {

                // TODO Check totalIncome notes

                var value = 0;
                self.ElementItemSet.forEach(function (item) {
                    value += item.directIncome();
                });

                return value;
            }

            function directIncomeField() {

                // TODO In case of add / remove fields?
                if (self.backingFields._directIncomeField === null) {
                    self.setDirectIncomeField();
                }

                return self.backingFields._directIncomeField;
            }

            function directIncomeIncludingResourcePoolAmount() {

                // TODO Check totalIncome notes

                var value = 0;
                self.ElementItemSet.forEach(function (item) {
                    value += item.directIncomeIncludingResourcePoolAmount();
                });

                return value;
            }

            function elementFieldIndexSet() {
                if (self.backingFields._elementFieldIndexSet === null) {
                    self.setElementFieldIndexSet();
                }
                return self.backingFields._elementFieldIndexSet;
            }

            function familyTree() {

                // TODO In case of add / remove elements?
                if (self.backingFields._familyTree === null) {
                    self.setFamilyTree();
                }

                return self.backingFields._familyTree;
            }

            // UI related: Determines whether the chart & element details will use full row (col-md-4 vs col-md-12 etc.)
            // TODO Obsolete for the moment!
            function fullSize() {
                return (self.ElementFieldSet.length > 4) || self.elementFieldIndexSet().length > 2;
            }

            function getElementFieldIndexSet(element) {

                var sortedElementFieldSet = element.ElementFieldSet.sort(function (a, b) { return a.SortOrder - b.SortOrder; });
                var indexSet = [];

                // Validate
                sortedElementFieldSet.forEach(function (field) {
                    if (field.IndexEnabled) {
                        indexSet.push(field);
                    }

                    if (field.DataType === 6 && field.SelectedElement !== null) {
                        var childIndexSet = getElementFieldIndexSet(field.SelectedElement);

                        childIndexSet.forEach(function (childIndex) {
                            indexSet.push(childIndex);
                        });
                    }
                });

                return indexSet;
            }

            function indexRating() {

                if (self.backingFields._indexRating === null) {
                    self.setIndexRating(false);
                }

                return self.backingFields._indexRating;
            }

            function multiplier() {

                // TODO Check totalIncome notes

                var value = 0;
                self.ElementItemSet.forEach(function (item) {
                    value += item.multiplier();
                });

                return value;
            }

            function multiplierField() {

                // TODO In case of add / remove field?
                if (self.backingFields._multiplierField !== null) {
                    self.setMultiplierField();
                }

                return self.backingFields._multiplierField;
            }

            function parent() {

                // TODO In case of add / remove elements?
                if (self.backingFields._parent === null) {
                    self.setParent();
                }

                return self.backingFields._parent;
            }

            function resourcePoolAmount() {

                // TODO Check totalIncome notes

                var value = 0;
                self.ElementItemSet.forEach(function (item) {
                    value += item.resourcePoolAmount();
                });

                return value;
            }

            function setDirectIncomeField() {
                var result = self.ElementFieldSet.filter(function (field) {
                    return field.DataType === 11;
                });

                if (result.length > 0) {
                    self.backingFields._directIncomeField = result[0];
                }
            }

            function setElementFieldIndexSet() {
                self.backingFields._elementFieldIndexSet = getElementFieldIndexSet(self);
            }

            function setFamilyTree() {

                self.backingFields._familyTree = [];

                var element = self;
                while (element !== null) {
                    self.backingFields._familyTree.unshift(element);
                    element = element.parent();
                }

                // TODO At the moment it's only upwards, later include children?
            }

            function setIndexRating(updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var indexSet = self.elementFieldIndexSet();

                var value = 0;
                indexSet.forEach(function (index) {
                    value += index.indexRating();
                });

                if (self.backingFields._indexRating !== value) {
                    self.backingFields._indexRating = value;

                    // Update related
                    if (updateRelated) {
                        self.elementFieldIndexSet().forEach(function (index) {
                            index.setIndexRatingPercentage();
                        });
                    }
                }
            }

            function setMultiplierField() {
                var result = self.ElementFieldSet.filter(function (field) {
                    return field.DataType === 12;
                });

                if (result.length > 0) {
                    self.backingFields._multiplierField = result[0];
                }
            }

            function setParent() {
                if (self.ParentFieldSet.length > 0) {
                    self.backingFields._parent = self.ParentFieldSet[0].Element;
                }
            }

            function totalDirectIncome() {

                // TODO Check totalIncome notes

                var value = 0;
                self.ElementItemSet.forEach(function (item) {
                    value += item.totalDirectIncome();
                });

                return value;
            }

            function totalDirectIncomeIncludingResourcePoolAmount() {

                // TODO Check totalIncome notes

                var value = 0;
                self.ElementItemSet.forEach(function (item) {
                    value += item.totalDirectIncomeIncludingResourcePoolAmount();
                });

                return value;
            }

            function totalIncome() {

                // TODO If elementItems could set their parent element's totalIncome when their totalIncome changes, it wouldn't be necessary to sum this result everytime?

                var value = 0;
                self.ElementItemSet.forEach(function (item) {
                    value += item.totalIncome();
                });

                return value;
            }

            function totalIncomeAverage() {

                // Validate
                if (self.ElementItemSet.length === 0) {
                    return 0;
                }

                return self.totalIncome() / self.ElementItemSet.length;
            }

            // TODO This is out of pattern!
            function totalResourcePoolAmount() {

                // TODO Check totalIncome notes

                var value;

                if (self === self.ResourcePool.mainElement()) {

                    value = self.ResourcePool.InitialValue;

                    self.ElementItemSet.forEach(function (item) {
                        value += item.totalResourcePoolAmount();
                    });

                } else {
                    if (self.ResourcePool.mainElement() !== null) {
                        value = self.ResourcePool.mainElement().totalResourcePoolAmount();
                    }
                }

                //logger.log('TRPA-A ' + value.toFixed(2));

                if (self.backingFields._totalResourcePoolAmount !== value) {
                    self.backingFields._totalResourcePoolAmount = value;

                    //logger.log('TRPA-B ' + value.toFixed(2));

                    self.elementFieldIndexSet().forEach(function (field) {
                        // TODO How about this check?
                        // if (field.DataType === 11) { - 
                        field.setIndexIncome();
                        // }
                    });
                }

                return value;
            }
        }
    }
})();
(function () {
    'use strict';

    var factoryId = 'ElementCell';
    angular.module('main')
        .factory(factoryId, ['logger', elementCellFactory]);

    function elementCellFactory(logger) {

        // Logger
        logger = logger.forSource(factoryId);

        // Return
        return ElementCell;

        function ElementCell() {

            var self = this;

            // Server-side
            self.Id = 0;
            self.ElementFieldId = 0;
            self.ElementItemId = 0;
            self.StringValue = ''; // Computed value - Used in: resourcePoolEditor.html
            self.NumericValueTotal = 0; // Computed value - Used in: setOtherUsersNumericValueTotal, setCurrentUserNumericValue
            self.NumericValueCount = 0; // Computed value - Used in: setOtherUsersNumericValueCount
            self.SelectedElementItemId = null;
            // TODO breezejs - Cannot assign a navigation property in an entity ctor
            //self.ElementField = null;
            //self.ElementItem = null;
            //self.SelectedElementItem = null;
            //self.UserElementCellSet = [];

            // Local variables
            self.backingFields = {
                _currentUserNumericValue: null,
                _otherUsersNumericValueTotal: null,
                _otherUsersNumericValueCount: null,
                _numericValue: null,
                _numericValueMultiplied: null,
                _numericValueMultipliedPercentage: null,
                _passiveRating: null,
                _aggressiveRating: null,
                _rating: null,
                _ratingPercentage: null,
                _indexIncome: null
            };
            self.isEditing = false;

            // Functions
            self.aggressiveRating = aggressiveRating;
            self.currentUserCell = currentUserCell;
            self.currentUserNumericValue = currentUserNumericValue;
            self.indexIncome = indexIncome;
            self.numericValue = numericValue;
            self.numericValueAverage = numericValueAverage;
            self.numericValueCount = numericValueCount;
            self.numericValueMultiplied = numericValueMultiplied;
            self.numericValueMultipliedPercentage = numericValueMultipliedPercentage;
            self.numericValueTotal = numericValueTotal;
            self.otherUsersNumericValueCount = otherUsersNumericValueCount;
            self.otherUsersNumericValueTotal = otherUsersNumericValueTotal;
            self.passiveRating = passiveRating;
            self.rating = rating;
            self.ratingPercentage = ratingPercentage;
            self.setAggressiveRating = setAggressiveRating;
            self.setCurrentUserNumericValue = setCurrentUserNumericValue;
            self.setIndexIncome = setIndexIncome;
            self.setNumericValue = setNumericValue;
            self.setNumericValueMultiplied = setNumericValueMultiplied;
            self.setNumericValueMultipliedPercentage = setNumericValueMultipliedPercentage;
            self.setOtherUsersNumericValueCount = setOtherUsersNumericValueCount;
            self.setOtherUsersNumericValueTotal = setOtherUsersNumericValueTotal;
            self.setPassiveRating = setPassiveRating;
            self.setRating = setRating;
            self.setRatingPercentage = setRatingPercentage;
            self.value = value;

            /*** Implementations ***/

            function aggressiveRating() {

                if (self.backingFields._aggressiveRating === null) {
                    self.setAggressiveRating(false);
                }

                return self.backingFields._aggressiveRating;
            }

            function currentUserCell() {
                return self.UserElementCellSet.length > 0 ?
                    self.UserElementCellSet[0] :
                    null;
            }

            function currentUserNumericValue() {

                if (self.backingFields._currentUserNumericValue === null) {
                    self.setCurrentUserNumericValue(false);
                }

                return self.backingFields._currentUserNumericValue;
            }

            // TODO This is out of pattern!
            function indexIncome() {

                //if (self.backingFields._indexIncome === null) {
                self.setIndexIncome();
                //}

                return self.backingFields._indexIncome;
            }

            function numericValue() {

                if (self.backingFields._numericValue === null) {
                    self.setNumericValue(false);
                }

                return self.backingFields._numericValue;
            }

            function numericValueAverage() {

                if (self.numericValueCount() === null) {
                    return null;
                }

                return self.numericValueCount() === 0 ?
                    0 :
                    self.numericValueTotal() / self.numericValueCount();
            }

            function numericValueCount() {
                return self.ElementField.UseFixedValue ?
                    self.currentUserCell() !== null && self.currentUserCell().UserId === self.ElementField.Element.ResourcePool.UserId ? // If it belongs to current user
                    1 :
                    self.otherUsersNumericValueCount() :
                    self.otherUsersNumericValueCount() + 1; // There is always default value, increase count by 1
            }

            function numericValueMultiplied() {

                if (self.backingFields._numericValueMultiplied === null) {
                    self.setNumericValueMultiplied(false);
                }

                return self.backingFields._numericValueMultiplied;
            }

            function numericValueMultipliedPercentage() {
                if (self.backingFields._numericValueMultipliedPercentage === null) {
                    self.setNumericValueMultipliedPercentage(false);
                }

                return self.backingFields._numericValueMultipliedPercentage;
            }

            function numericValueTotal() {
                return self.ElementField.UseFixedValue ?
                    self.currentUserCell() !== null && self.currentUserCell().UserId === self.ElementField.Element.ResourcePool.UserId ? // If it belongs to current user
                    self.currentUserNumericValue() :
                    self.otherUsersNumericValueTotal() :
                    self.otherUsersNumericValueTotal() + self.currentUserNumericValue();
            }

            // TODO Since this is a fixed value based on NumericValueCount & current user's rate,
            // it could be calculated on server, check it later again / SH - 03 Aug. '15
            function otherUsersNumericValueCount() {

                // Set other users' value on the initial call
                if (self.backingFields._otherUsersNumericValueCount === null) {
                    self.setOtherUsersNumericValueCount();
                }

                return self.backingFields._otherUsersNumericValueCount;
            }

            // TODO Since this is a fixed value based on NumericValueTotal & current user's rate,
            // it could be calculated on server, check it later again / SH - 03 Aug. '15
            function otherUsersNumericValueTotal() {

                // Set other users' value on the initial call
                if (self.backingFields._otherUsersNumericValueTotal === null) {
                    self.setOtherUsersNumericValueTotal();
                }

                return self.backingFields._otherUsersNumericValueTotal;
            }

            function passiveRating() {
                if (self.backingFields._passiveRating === null) {
                    self.setPassiveRating(false);
                }

                return self.backingFields._passiveRating;
            }

            function rating() {

                if (self.backingFields._rating === null) {
                    self.setRating(false);
                }

                return self.backingFields._rating;
            }

            function ratingPercentage() {

                if (self.backingFields._ratingPercentage === null) {
                    self.setRatingPercentage(false);
                }

                return self.backingFields._ratingPercentage;
            }

            // TODO Currently updateRelated is always 'false'?
            function setAggressiveRating(updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = 0; // Default value?

                if (self.ElementField.IndexEnabled && self.ElementField.referenceRatingMultiplied() > 0) {
                    switch (self.ElementField.IndexSortType) {
                        case 1: { // HighestToLowest (High rating is better)
                            value = (1 - self.numericValueMultipliedPercentage()) / self.ElementField.referenceRatingMultiplied();
                            break;
                        }
                        case 2: { // LowestToHighest (Low rating is better)
                            value = self.numericValueMultiplied() / self.ElementField.referenceRatingMultiplied();
                            break;
                        }
                    }

                    if (!self.ElementField.referenceRatingAllEqualFlag()) {
                        value = 1 - value;
                    }
                }

                if (self.backingFields._aggressiveRating !== value) {
                    self.backingFields._aggressiveRating = value;

                    // Update related values
                    if (updateRelated) {
                        // TODO ?
                    }
                }
            }

            function setCurrentUserNumericValue(updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value;
                var userCell = self.currentUserCell();

                switch (self.ElementField.DataType) {
                    case 2: { value = userCell !== null ? userCell.BooleanValue : 0; break; }
                    case 3: { value = userCell !== null ? userCell.IntegerValue : 0; break; }
                    case 4: { value = userCell !== null ? userCell.DecimalValue : 50; /* Default value? */ break; }
                        // TODO 5 (DateTime?)
                    case 11: {
                        // DirectIncome: No need to try user's cell, always return all users', which will be CMRP owner's value
                        value = self.NumericValueTotal !== null ? self.NumericValueTotal : 0;
                        break;
                    }
                    case 12: { value = userCell !== null ? userCell.DecimalValue : 0; /* Default value? */ break; }
                        // default: { throw 'currentUserNumericValue() - Not supported element field type: ' + self.ElementField.DataType; }
                }

                if (self.backingFields._currentUserNumericValue !== value) {
                    self.backingFields._currentUserNumericValue = value;

                    // Update related
                    if (updateRelated) {
                        self.setNumericValue();
                    }
                }
            }

            function setIndexIncome(updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = 0; // Default value?

                if (self.ElementField.DataType === 6 && self.SelectedElementItem !== null) {
                    // item's index income / how many times this item has been selected (used) by higher items
                    // TODO Check whether ParentCellSet gets updated when selecting / deselecting an item
                    value = self.SelectedElementItem.totalResourcePoolIncome() / self.SelectedElementItem.ParentCellSet.length;
                } else {
                    if (self.ElementField.IndexEnabled) {
                        value = self.ElementField.indexIncome() * self.ratingPercentage();
                    }
                }

                if (self.backingFields._indexIncome !== value) {
                    self.backingFields._indexIncome = value;

                    // TODO Update related?
                    // item.totalResourcePoolIncome
                }
            }

            function setNumericValue(updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value;

                if (typeof self.ElementField !== 'undefined') {
                    switch (self.ElementField.Element.ResourcePool.RatingMode) {
                        case 1: { value = self.currentUserNumericValue(); break; } // Current user's
                        case 2: { value = self.numericValueAverage(); break; } // All
                    }

                }

                // If it's different...
                if (self.backingFields._numericValue !== value) {
                    self.backingFields._numericValue = value;

                    // Update related
                    if (updateRelated) {

                        if (self.ElementField.DataType === 11) {
                            self.ElementItem.setDirectIncome();
                        }

                        self.setNumericValueMultiplied();
                    }
                }
            }

            function setNumericValueMultiplied(updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value;

                // if (typeof self.ElementField === 'undefined' || !self.ElementField.IndexEnabled) {
                if (typeof self.ElementField === 'undefined') {
                    value = 0; // ?
                } else {
                    value = self.numericValue() * self.ElementItem.multiplier();
                    //logger.log(self.ElementField.Name[0] + '-' + self.ElementItem.Name[0] + ' NVMA ' + self.numericValue());
                    //logger.log(self.ElementField.Name[0] + '-' + self.ElementItem.Name[0] + ' NVMB ' + self.ElementItem.multiplier());
                }

                if (self.backingFields._numericValueMultiplied !== value) {
                    self.backingFields._numericValueMultiplied = value;

                    // Update related
                    if (updateRelated) {
                        self.ElementField.setNumericValueMultiplied();
                    }

                    // IMPORTANT REMARK: If the field is using IndexSortType 1,
                    // then it would be better to directly call field.setReferenceRatingMultiplied() method.
                    // It would be quicker to calculate.
                    // However, since field.setNumericValueMultiplied() will make 'numericValueMultipliedPercentage' calculations
                    // which meanwhile will call referenceRatingMultiplied() method anyway. So it becomes redundant.
                    // This code block could possibly be improved with a IndexSortType switch case,
                    // but it seems it would be bit overkill.
                    // Still something to think about it later? / SH - 22 Oct. '15
                    //self.ElementField.setReferenceRatingMultiplied();
                }
            }

            function setNumericValueMultipliedPercentage(updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = 0;

                if (self.ElementField.IndexEnabled && self.ElementField.numericValueMultiplied() > 0) {
                    value = self.numericValueMultiplied() / self.ElementField.numericValueMultiplied();
                }

                if (self.backingFields._numericValueMultipliedPercentage !== value) {
                    self.backingFields._numericValueMultipliedPercentage = value;

                    // Update related
                    if (updateRelated) {
                        // TODO ?
                    }
                }
            }

            function setOtherUsersNumericValueCount() {
                self.backingFields._otherUsersNumericValueCount = self.NumericValueCount;

                // Exclude current user's
                if (self.UserElementCellSet.length > 0) {
                    self.backingFields._otherUsersNumericValueCount--;
                }
            }

            function setOtherUsersNumericValueTotal() {

                self.backingFields._otherUsersNumericValueTotal = self.NumericValueTotal !== null ?
                    self.NumericValueTotal :
                    0;

                // Exclude current user's
                if (self.UserElementCellSet.length > 0) {

                    var userValue = 0;
                    switch (self.ElementField.DataType) {
                        // TODO Check bool to decimal conversion?
                        case 2: { userValue = self.UserElementCellSet[0].BooleanValue; break; }
                        case 3: { userValue = self.UserElementCellSet[0].IntegerValue; break; }
                        case 4: { userValue = self.UserElementCellSet[0].DecimalValue; break; }
                            // TODO 5 - DateTime?
                        case 11: { userValue = self.UserElementCellSet[0].DecimalValue; break; }
                            // TODO 12 - Multiplier?
                            //default: {
                            //    throw 'setOtherUsersNumericValueTotal - Not supported element field type: ' + self.ElementField.DataType;
                            //}
                    }

                    self.backingFields._otherUsersNumericValueTotal -= userValue;
                }
            }

            function setPassiveRating(updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = 0;

                if (self.ElementField.IndexEnabled) {

                    switch (self.ElementField.IndexSortType) {
                        case 1: { // HightestToLowest (High rating is better)
                            value = self.numericValueMultipliedPercentage();
                            break;
                        }
                        case 2: { // LowestToHighest (Low rating is better)
                            if (self.ElementField.passiveRating() > 0) {
                                value = (1 - self.numericValueMultipliedPercentage()) / self.ElementField.passiveRating();
                            }
                            break;
                        }
                    }
                }

                if (self.backingFields._passiveRating !== value) {
                    self.backingFields._passiveRating = value;

                    // Update related
                    if (updateRelated) {
                        // TODO ?
                    }
                }
            }

            function setRating(updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = 0;

                // If there is only one item, then always %100
                if (self.ElementField.ElementCellSet.length === 1) {
                    value = 1;
                } else {
                    switch (self.ElementField.IndexCalculationType) {
                        case 1: // Aggressive rating
                            {
                                value = self.aggressiveRating();
                                break;
                            }
                        case 2: // Passive rating
                            {
                                value = self.passiveRating();
                                break;
                            }
                    }
                }

                if (self.backingFields._rating !== value) {
                    self.backingFields._rating = value;

                    // Update related
                    if (updateRelated) {
                        // TODO ?
                    }
                }
            }

            function setRatingPercentage(updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = 0;

                if (self.ElementField.IndexEnabled && self.ElementField.rating() > 0) {
                    value = self.rating() / self.ElementField.rating();
                }

                if (self.backingFields._ratingPercentage !== value) {
                    self.backingFields._ratingPercentage = value;

                    // Update related
                    if (updateRelated) {
                        // TODO ?
                    }
                }
            }

            function value() {

                var value = null;
                //var currentUserCell = self.UserElementCellSet.length > 0
                //    ? self.UserElementCellSet[0]
                //    : null;

                switch (self.ElementField.DataType) {
                    case 1: {
                        if (self.UserElementCellSet.length > 0) {
                            value = self.UserElementCellSet[0].StringValue;
                        }
                        break;
                    }
                    case 2: {
                        if (self.UserElementCellSet.length > 0) {
                            value = self.UserElementCellSet[0].BooleanValue ? 'True' : 'False';
                        }
                        break;
                    }
                    case 3: {
                        if (self.UserElementCellSet.length > 0) {
                            value = self.UserElementCellSet[0].IntegerValue;
                        }
                        break;
                    }
                    // TODO 5 (DateTime?)
                    case 4:
                    case 11:
                    case 12: {
                        if (self.UserElementCellSet.length > 0) {
                            value = self.UserElementCellSet[0].DecimalValue;
                        }
                        break;
                    }
                    case 6: {
                        if (self.SelectedElementItem !== null) {
                            value = self.SelectedElementItem.Name;
                        }
                    }
                }

                return value;
            }
        }
    }
})();
(function () {
    'use strict';

    var factoryId = 'ElementField';
    angular.module('main')
        .factory(factoryId, ['$rootScope', 'logger', elementFieldFactory]);

    function elementFieldFactory($rootScope, logger) {

        // Logger
        logger = logger.forSource(factoryId);

        // Server-side
        Object.defineProperty(ElementField.prototype, 'DataType', {
            enumerable: true,
            configurable: true,
            get: function () { return this.backingFields._dataType; },
            set: function (value) {

                var self = this;
                if (self.backingFields._dataType !== value) {

                    // Related element cells: Clear old values and set default values if necessary
                    self.ElementCellSet.forEach(function (elementCell) {

                        elementCell.SelectedElementItemId = null;

                        // Remove related user cell
                        // TODO Similar to resourcePoolFactory.js - function removeElementCell(elementCell)
                        var userElementCellSet = elementCell.UserElementCellSet.slice();
                        userElementCellSet.forEach(function (userElementCell) {
                            // TODO Should this also be done through broadcast & on dataContext.js? / SH - 14 Dec. '15
                            userElementCell.entityAspect.setDetached();
                        });

                        // Add user element cell, if the new type is not 'Element'
                        if (value !== 6) {

                            var userElementCell = elementCell.currentUserCell();

                            var isNew = userElementCell === null;

                            if (isNew) {
                                // TODO Similar to resourcePoolFactory.js - function createElementCell(elementCell)
                                userElementCell = {
                                    User: self.Element.ResourcePool.User,
                                    ElementCell: elementCell
                                };
                            }

                            switch (value) {
                                case 1: { userElementCell.StringValue = ''; break; }
                                case 2: { userElementCell.BooleanValue = false; break; }
                                case 3: { userElementCell.IntegerValue = 0; break; }
                                case 4: { userElementCell.DecimalValue = 50; break; }
                                    // TODO 5 (DateTime?)
                                case 11: { userElementCell.DecimalValue = 100; break; }
                                case 12: { userElementCell.DecimalValue = 0; break; }
                            }

                            if (isNew) {
                                $rootScope.$broadcast('ElementField_createUserElementCell', userElementCell);
                            }
                        }
                    });

                    // Finally, set it
                    self.backingFields._dataType = value;
                }
            }
        });

        Object.defineProperty(ElementField.prototype, 'IndexEnabled', {
            enumerable: true,
            configurable: true,
            get: function () { return this.backingFields._indexEnabled; },
            set: function (value) {

                if (this.backingFields._indexEnabled !== value) {
                    this.backingFields._indexEnabled = value;

                    this.IndexCalculationType = value ? 1 : 0;
                    this.IndexSortType = value ? 1 : 0;

                    // TODO Complete this block!

                    //// Update related
                    //// a. Element
                    //this.Element.setElementFieldIndexSet();

                    //// b. Item(s)
                    //this.ElementCellSet.forEach(function(cell) {
                    //    var item = cell.ElementItem;
                    //    item.setElementCellIndexSet();
                    //});

                    //// c. Cells
                    //this.ElementCellSet.forEach(function(cell) {
                    //    cell.setNumericValueMultipliedPercentage(false);
                    //});
                    //this.setReferenceRatingMultiplied();

                    /* IndexEnabled related functions */
                    //cell.setAggressiveRating();
                    //cell.setratingPercentage();
                    //cell.setIndexIncome();
                }
            }
        });

        // Return
        return ElementField;

        function ElementField() {

            var self = this;

            // Server-side
            self.Id = 0;
            self.ElementId = 0;
            self.Name = '';
            //self.DataType = 1;
            self.SelectedElementId = null;
            self.UseFixedValue = null;
            self.IndexCalculationType = 0;
            self.IndexSortType = 0;
            self.SortOrder = 0;
            self.IndexRatingTotal = 0; // Computed value - Used in: setOtherUsersIndexRatingTotal
            self.IndexRatingCount = 0; // Computed value - Used in: setOtherUsersIndexRatingCount
            // TODO breezejs - Cannot assign a navigation property in an entity ctor
            //self.Element = null;
            //self.SelectedElement = null;
            //self.ElementCellSet = [];
            //self.UserElementFieldSet = [];

            // Local variables
            self.backingFields = {
                _dataType: 1,
                _indexEnabled: false,
                _currentUserIndexRating: null,
                _otherUsersIndexRatingTotal: null,
                _otherUsersIndexRatingCount: null,
                _indexRating: null,
                _indexRatingPercentage: null,
                _numericValueMultiplied: null,
                _passiveRating: null,
                _referenceRatingMultiplied: null,
                // Aggressive rating formula prevents the organizations with the worst rating to get any income.
                // However, in case all ratings are equal, then no one can get any income from the pool.
                // This flag is used to determine this special case and let all organizations get a same share from the pool.
                // See the usage in aggressiveRating() in elementCell.js
                // TODO Usage of this field is correct?
                _referenceRatingAllEqualFlag: true,
                _aggressiveRating: null,
                _rating: null,
                _indexIncome: null
            };
            self.isEditing = false;

            // Functions
            self.currentUserElementField = currentUserElementField;
            self.currentUserIndexRating = currentUserIndexRating;
            self.indexIncome = indexIncome;
            self.indexRating = indexRating;
            self.indexRatingAverage = indexRatingAverage;
            self.indexRatingCount = indexRatingCount;
            self.indexRatingPercentage = indexRatingPercentage;
            self.indexRatingTotal = indexRatingTotal;
            self.numericValueMultiplied = numericValueMultiplied;
            self.otherUsersIndexRatingCount = otherUsersIndexRatingCount;
            self.otherUsersIndexRatingTotal = otherUsersIndexRatingTotal;
            self.passiveRating = passiveRating;
            self.rating = rating;
            self.referenceRatingAllEqualFlag = referenceRatingAllEqualFlag;
            self.referenceRatingMultiplied = referenceRatingMultiplied;
            self.setCurrentUserIndexRating = setCurrentUserIndexRating;
            self.setIndexIncome = setIndexIncome;
            self.setIndexRating = setIndexRating;
            self.setIndexRatingPercentage = setIndexRatingPercentage;
            self.setNumericValueMultiplied = setNumericValueMultiplied;
            self.setOtherUsersIndexRatingCount = setOtherUsersIndexRatingCount;
            self.setOtherUsersIndexRatingTotal = setOtherUsersIndexRatingTotal;
            self.setPassiveRating = setPassiveRating;
            self.setRating = setRating;
            self.setReferenceRatingAllEqualFlag = setReferenceRatingAllEqualFlag;
            self.setReferenceRatingMultiplied = setReferenceRatingMultiplied;

            /*** Implementations ***/

            function currentUserElementField() {
                return self.UserElementFieldSet.length > 0 ?
                    self.UserElementFieldSet[0] :
                    null;
            }

            function currentUserIndexRating() {

                if (self.backingFields._currentUserIndexRating === null) {
                    self.setCurrentUserIndexRating(false);
                }

                return self.backingFields._currentUserIndexRating;
            }

            function indexIncome() {

                if (self.backingFields._indexIncome === null) {
                    self.setIndexIncome(false);
                }

                return self.backingFields._indexIncome;
            }

            function indexRating() {

                if (self.backingFields._indexRating === null) {
                    self.setIndexRating(false);
                }

                return self.backingFields._indexRating;
            }

            function indexRatingAverage() {

                if (self.indexRatingCount() === null) {
                    return null;
                }

                return self.indexRatingCount() === 0 ?
                    0 :
                    self.indexRatingTotal() / self.indexRatingCount();
            }

            function indexRatingCount() {
                return self.otherUsersIndexRatingCount() + 1;
            }

            function indexRatingPercentage() {

                if (self.backingFields._indexRatingPercentage === null) {
                    self.setIndexRatingPercentage(false);
                }

                return self.backingFields._indexRatingPercentage;
            }

            function indexRatingTotal() {
                return self.otherUsersIndexRatingTotal() + self.currentUserIndexRating();
            }

            function numericValueMultiplied() {

                if (self.backingFields._numericValueMultiplied === null) {
                    self.setNumericValueMultiplied(false);
                }

                return self.backingFields._numericValueMultiplied;
            }

            // TODO Since this is a fixed value based on IndexRatingCount & current user's rate,
            // it could be calculated on server, check it later again / SH - 03 Aug. '15
            function otherUsersIndexRatingCount() {

                // Set other users' value on the initial call
                if (self.backingFields._otherUsersIndexRatingCount === null) {
                    self.setOtherUsersIndexRatingCount();
                }

                return self.backingFields._otherUsersIndexRatingCount;
            }

            // TODO Since this is a fixed value based on IndexRatingTotal & current user's rate,
            // it could be calculated on server, check it later again / SH - 03 Aug. '15
            function otherUsersIndexRatingTotal() {

                // Set other users' value on the initial call
                if (self.backingFields._otherUsersIndexRatingTotal === null) {
                    self.setOtherUsersIndexRatingTotal();
                }

                return self.backingFields._otherUsersIndexRatingTotal;
            }

            // Helper function for Index Rating Type 1 case (low rating is better)
            function passiveRating() {
                if (self.backingFields._passiveRating === null) {
                    self.setPassiveRating(false);
                }

                return self.backingFields._passiveRating;
            }

            function rating() {

                if (self.backingFields._rating === null) {
                    self.setRating(false);
                }

                return self.backingFields._rating;
            }

            function referenceRatingAllEqualFlag(value) {
                return self.backingFields._referenceRatingAllEqualFlag;
            }

            function referenceRatingMultiplied() {

                if (self.backingFields._referenceRatingMultiplied === null) {
                    self.setReferenceRatingMultiplied(false);
                }

                return self.backingFields._referenceRatingMultiplied;
            }

            function setCurrentUserIndexRating(updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = self.currentUserElementField() !== null ?
                    self.currentUserElementField().Rating :
                    50; // If there is no rating, this is the default value?

                if (self.backingFields._currentUserIndexRating !== value) {
                    self.backingFields._currentUserIndexRating = value;

                    // Update related
                    if (updateRelated) {
                        self.setIndexRating();
                    }
                }
            }

            function setIndexIncome(updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = self.Element.totalResourcePoolAmount() * self.indexRatingPercentage();

                //if (self.IndexEnabled) {
                //logger.log(self.Name[0] + ' II ' + value.toFixed(2));
                //}

                if (self.backingFields._indexIncome !== value) {
                    self.backingFields._indexIncome = value;

                    // Update related
                    if (updateRelated) {
                        self.ElementCellSet.forEach(function (cell) {
                            cell.setIndexIncome();
                        });
                    }
                }
            }

            function setIndexRating(updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = 0; // Default value?

                switch (self.Element.ResourcePool.RatingMode) {
                    case 1: { value = self.currentUserIndexRating(); break; } // Current user's
                    case 2: { value = self.indexRatingAverage(); break; } // All
                }

                //logger.log(self.Name[0] + ' IR ' + value.toFixed(2));

                if (self.backingFields._indexRating !== value) {
                    self.backingFields._indexRating = value;

                    // TODO Update related
                    if (updateRelated) {
                        self.Element.ResourcePool.mainElement().setIndexRating();
                    }
                }
            }

            function setIndexRatingPercentage(updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = 0; // Default value?

                var elementIndexRating = self.Element.ResourcePool.mainElement().indexRating();

                if (elementIndexRating === 0) {
                    value = 0;
                } else {
                    value = self.indexRating() / elementIndexRating;
                }

                //logger.log(self.Name[0] + ' IRP ' + value.toFixed(2));

                if (self.backingFields._indexRatingPercentage !== value) {
                    self.backingFields._indexRatingPercentage = value;

                    // Update related
                    if (updateRelated) {
                        self.setIndexIncome();
                    }
                }
            }

            function setNumericValueMultiplied(updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = 0; // Default value?

                // Validate
                if (self.ElementCellSet.length === 0) {
                    value = 0; // ?
                } else {
                    self.ElementCellSet.forEach(function (cell) {
                        value += cell.numericValueMultiplied();
                        //logger.log(self.Name[0] + '-' + cell.ElementItem.Name[0] + ' NVMA ' + cell.numericValueMultiplied());
                    });
                }

                if (self.backingFields._numericValueMultiplied !== value) {
                    self.backingFields._numericValueMultiplied = value;

                    //logger.log(self.Name[0] + ' NVMB ' + value.toFixed(2));

                    // Update related?
                    if (updateRelated && self.IndexEnabled) {

                        self.ElementCellSet.forEach(function (cell) {
                            cell.setNumericValueMultipliedPercentage(false);
                        });

                        self.setPassiveRating(false);

                        self.ElementCellSet.forEach(function (cell) {
                            cell.setPassiveRating(false);
                        });

                        self.setReferenceRatingMultiplied(false);

                        self.ElementCellSet.forEach(function (cell) {
                            cell.setAggressiveRating(false);
                        });

                        self.ElementCellSet.forEach(function (cell) {
                            cell.setRating(false);
                        });

                        self.setRating(false);

                        self.ElementCellSet.forEach(function (cell) {
                            cell.setRatingPercentage(false);
                        });

                        //self.setIndexIncome(false);

                        self.ElementCellSet.forEach(function (cell) {
                            cell.setIndexIncome(false);
                        });
                    }
                }
            }

            function setOtherUsersIndexRatingCount() {
                self.backingFields._otherUsersIndexRatingCount = self.IndexRatingCount;

                // Exclude current user's
                if (self.currentUserElementField() !== null) {
                    self.backingFields._otherUsersIndexRatingCount--;
                }
            }

            function setOtherUsersIndexRatingTotal() {
                self.backingFields._otherUsersIndexRatingTotal = self.IndexRatingTotal !== null ?
                    self.IndexRatingTotal :
                    0;

                // Exclude current user's
                if (self.currentUserElementField() !== null) {
                    self.backingFields._otherUsersIndexRatingTotal -= self.currentUserElementField().Rating;
                }
            }

            function setPassiveRating(updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = 0;

                self.ElementCellSet.forEach(function (cell) {
                    value += 1 - cell.numericValueMultipliedPercentage();
                });

                if (self.backingFields._passiveRating !== value) {
                    self.backingFields._passiveRating = value;

                    if (updateRelated) {
                        // TODO ?
                    }
                }
            }

            function setRating(updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = 0; // Default value?

                // Validate
                self.ElementCellSet.forEach(function (cell) {
                    value += cell.rating();
                });

                //logger.log(self.Name[0] + ' AR ' + value.toFixed(2));

                if (self.backingFields._rating !== value) {
                    self.backingFields._rating = value;

                    //logger.log(self.Name[0] + ' AR OK');

                    if (updateRelated) {

                        // Update related
                        self.ElementCellSet.forEach(function (cell) {
                            cell.setRatingPercentage(false);
                        });

                        self.setIndexIncome();
                    }
                }
            }

            function setReferenceRatingAllEqualFlag(value) {

                if (self.backingFields._referenceRatingAllEqualFlag !== value) {
                    self.backingFields._referenceRatingAllEqualFlag = value;
                    return true;
                }
                return false;
            }

            // TODO Currently updateRelated is always 'false'?
            function setReferenceRatingMultiplied(updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = null;
                var allEqualFlag = true;

                // Validate
                if (self.ElementCellSet.length === 0) {
                    value = 0; // ?
                } else {

                    self.ElementCellSet.forEach(function (cell) {

                        if (value === null) {

                            switch (self.IndexSortType) {
                                case 1: { // HighestToLowest (High number is better)
                                    value = (1 - cell.numericValueMultipliedPercentage());
                                    break;
                                }
                                case 2: { // LowestToHighest (Low number is better)
                                    value = cell.numericValueMultiplied();
                                    break;
                                }
                            }

                        } else {

                            switch (self.IndexSortType) {
                                case 1: { // HighestToLowest (High number is better)

                                    if (1 - cell.numericValueMultipliedPercentage() !== value) {
                                        allEqualFlag = false;
                                    }

                                    if (1 - cell.numericValueMultipliedPercentage() > value) {
                                        value = 1 - cell.numericValueMultipliedPercentage();
                                    }
                                    break;
                                }
                                case 2: { // LowestToHighest (Low number is better)

                                    if (cell.numericValueMultiplied() !== value) {
                                        allEqualFlag = false;
                                    }

                                    if (cell.numericValueMultiplied() > value) {
                                        value = cell.numericValueMultiplied();
                                    }

                                    break;
                                }
                            }
                        }
                    });
                }

                //logger.log(self.Name[0] + '-' + cell.ElementItem.Name[0] + ' RRMA ' + value.toFixed(2));

                // Set all equal flag
                var flagUpdated = self.setReferenceRatingAllEqualFlag(allEqualFlag);
                var ratingUpdated = false;

                // Only if it's different..
                if (self.backingFields._referenceRatingMultiplied !== value) {
                    self.backingFields._referenceRatingMultiplied = value;

                    ratingUpdated = true;

                    //logger.log(self.Name[0] + ' RRMB ' + value.toFixed(2));
                }

                // Update related
                if ((flagUpdated || ratingUpdated) && updateRelated) {

                    // TODO ?!

                    self.ElementCellSet.forEach(function (cell) {
                        cell.setAggressiveRating(false);
                    });

                    // self.setAggressiveRating();
                }
            }

        }
    }
})();
(function () {
    'use strict';

    var factoryId = 'ElementItem';
    angular.module('main')
        .factory(factoryId, ['logger', elementItemFactory]);

    function elementItemFactory(logger) {

        // Logger
        logger = logger.forSource(factoryId);

        // Return
        return ElementItem;

        function ElementItem() {

            var self = this;

            // Server-side
            self.Id = 0;
            self.ElementId = 0;
            self.Name = '';
            // TODO breezejs - Cannot assign a navigation property in an entity ctor
            //self.Element = null;
            //self.ElementCellSet = [];
            //self.ParentCellSet = [];

            // Local variables
            self.backingFields = {
                _elementCellIndexSet: null,
                _directIncome: null,
                _multiplier: null,
                _totalDirectIncome: null,
                _resourcePoolAmount: null,
                _totalResourcePoolAmount: null,
                _totalResourcePoolIncome: null
            };
            self.isEditing = false;

            // Functions
            self.directIncome = directIncome;
            self.directIncomeIncludingResourcePoolAmount = directIncomeIncludingResourcePoolAmount;
            self.elementCellIndexSet = elementCellIndexSet;
            self.incomeStatus = incomeStatus;
            self.multiplier = multiplier;
            self.resourcePoolAmount = resourcePoolAmount;
            self.setDirectIncome = setDirectIncome;
            self.setElementCellIndexSet = setElementCellIndexSet;
            self.setMultiplier = setMultiplier;
            self.setResourcePoolAmount = setResourcePoolAmount;
            self.setTotalDirectIncome = setTotalDirectIncome;
            self.setTotalResourcePoolAmount = setTotalResourcePoolAmount;
            self.totalDirectIncome = totalDirectIncome;
            self.totalDirectIncomeIncludingResourcePoolAmount = totalDirectIncomeIncludingResourcePoolAmount;
            self.totalIncome = totalIncome;
            self.totalResourcePoolAmount = totalResourcePoolAmount;
            self.totalResourcePoolIncome = totalResourcePoolIncome;

            /*** Implementations ***/

            function directIncome() {

                if (self.backingFields._directIncome === null) {
                    self.setDirectIncome(false);
                }

                return self.backingFields._directIncome;
            }

            function directIncomeIncludingResourcePoolAmount() { // A.k.a Sales Price incl. VAT
                return self.directIncome() + self.resourcePoolAmount();
            }

            function elementCellIndexSet() {

                if (self.backingFields._elementCellIndexSet === null) {
                    self.setElementCellIndexSet();
                }

                return self.backingFields._elementCellIndexSet;
            }

            function getElementCellIndexSet(elementItem) {

                var indexSet = [];
                var sortedElementCellSet = elementItem.ElementCellSet.sort(function (a, b) {
                    return a.ElementField.SortOrder - b.ElementField.SortOrder;
                });

                sortedElementCellSet.forEach(function (cell) {

                    if (cell.ElementField.IndexEnabled) {
                        indexSet.push(cell);
                    }

                    if (cell.ElementField.DataType === 6 && cell.SelectedElementItem !== null) {
                        var childIndexSet = getElementCellIndexSet(cell.SelectedElementItem);

                        if (childIndexSet.length > 0) {
                            indexSet.push(cell);
                        }
                    }
                });

                return indexSet;
            }

            function incomeStatus() {

                var totalIncome = self.totalIncome();
                // TODO Make rounding better, instead of toFixed + number
                var averageIncome = Number(self.Element.totalIncomeAverage().toFixed(2));

                if (totalIncome === averageIncome) {
                    return 'average';
                } else if (totalIncome < averageIncome) {
                    return 'low';
                } else if (totalIncome > averageIncome) {
                    return 'high';
                }
            }

            function multiplier() {

                if (self.backingFields._multiplier === null) {
                    self.setMultiplier(false);
                }

                return self.backingFields._multiplier;
            }

            function resourcePoolAmount() {

                if (self.backingFields._resourcePoolAmount === null) {
                    self.setResourcePoolAmount(false);
                }

                return self.backingFields._resourcePoolAmount;
            }

            function setDirectIncome(updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                // First, find direct income cell
                var directIncomeCell = null;

                var result = self.ElementCellSet.filter(function (elementCell) {
                    return elementCell.ElementField.DataType === 11;
                });

                if (result.length > 0) {
                    directIncomeCell = result[0];
                }

                var value;
                if (directIncomeCell === null) {
                    value = 0;
                } else {
                    value = directIncomeCell.numericValue();
                }

                if (self.backingFields._directIncome !== value) {
                    self.backingFields._directIncome = value;

                    // Update related
                    if (updateRelated) {
                        self.setTotalDirectIncome();
                        self.setResourcePoolAmount();
                    }
                }
            }

            function setElementCellIndexSet() {
                self.backingFields._elementCellIndexSet = getElementCellIndexSet(self);
            }

            function setMultiplier(updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                // First, find the multiplier cell
                var multiplierCell = null;

                var result = self.ElementCellSet.filter(function(elementCell) {
                    return elementCell.ElementField.DataType === 12;
                });

                if (result.length > 0) {
                    multiplierCell = result[0];
                }

                var value = 0;

                // If there is no multiplier field defined on this element, return 1, so it can return calculate the income correctly
                // TODO Cover 'add new multiplier field' case as well!
                if (multiplierCell === null) {
                    value = 1;
                } else {

                    // If there is a multiplier field on the element but user is not set any value, return 0 as the default value
                    if (multiplierCell.currentUserCell() === null ||
                        multiplierCell.currentUserCell().DecimalValue === null) {
                        value = 0;
                    } else { // Else, user's
                        value = multiplierCell.currentUserCell().DecimalValue;
                    }
                }

                if (self.backingFields._multiplier !== value) {
                    self.backingFields._multiplier = value;

                    // Update related
                    self.setTotalDirectIncome();
                    self.setTotalResourcePoolAmount();
                }
            }

            function setResourcePoolAmount(updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = self.directIncome() * self.Element.ResourcePool.resourcePoolRatePercentage();

                if (self.backingFields._resourcePoolAmount !== value) {
                    self.backingFields._resourcePoolAmount = value;

                    // TODO Update related
                    if (updateRelated) {
                        self.setTotalResourcePoolAmount();
                    }
                }
            }

            function setTotalDirectIncome(updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = self.directIncome() * self.multiplier();

                if (self.backingFields._totalDirectIncome !== value) {
                    self.backingFields._totalDirectIncome = value;

                    // TODO Update related
                    if (updateRelated) {

                    }
                }
            }

            function setTotalResourcePoolAmount(updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = self.resourcePoolAmount() * self.multiplier();

                if (self.backingFields._totalResourcePoolAmount !== value) {
                    self.backingFields._totalResourcePoolAmount = value;

                    // TODO Update related
                    if (updateRelated) {

                    }
                }
            }

            function totalDirectIncome() {

                if (self.backingFields._totalDirectIncome === null) {
                    self.setTotalDirectIncome(false);
                }

                return self.backingFields._totalDirectIncome;
            }

            function totalDirectIncomeIncludingResourcePoolAmount() { // A.k.a Total Sales Price incl. VAT
                return self.directIncomeIncludingResourcePoolAmount() * self.multiplier();
            }

            function totalIncome() {
                var totalIncome = self.totalDirectIncome() + self.totalResourcePoolIncome();
                // TODO Make rounding better, instead of toFixed + number
                return Number(totalIncome.toFixed(2));
            }

            function totalResourcePoolAmount() {

                if (self.backingFields._totalResourcePoolAmount === null) {
                    self.setTotalResourcePoolAmount(false);
                }

                return self.backingFields._totalResourcePoolAmount;
            }

            // TODO This is out of pattern!
            function totalResourcePoolIncome() {

                var value = 0;

                self.ElementCellSet.forEach(function (cell) {
                    value += cell.indexIncome();
                });

                if (self.backingFields._totalResourcePoolIncome !== value) {
                    self.backingFields._totalResourcePoolIncome = value;

                    // Update related
                    // TODO Is this correct? It looks like it didn't affect anything?
                    self.ParentCellSet.forEach(function (parentCell) {
                        parentCell.setIndexIncome();
                    });
                }

                return value;
            }

        }
    }
})();
(function () {
    'use strict';

    var factoryId = 'Enums';
    angular.module('main')
        .factory(factoryId, ['logger', enumsFactory]);

    function enumsFactory(logger) {

        // Logger
        logger = logger.forSource(factoryId);

        var self = {};

        self.ElementFieldDataType = {

            // A field that holds string value.
            // Use StringValue property to set its value on ElementItem level.
            'String': 1,

            // A field that holds boolean value.
            // Use BooleanValue property to set its value on ElementItem level.
            'Boolean': 2,

            // A field that holds integer value.
            // Use IntegerValue property to set its value on ElementItem level.
            'Integer': 3,

            // A field that holds decimal value.
            // Use DecimalValue property to set its value on ElementItem level.
            'Decimal': 4,

            //// A field that holds DateTime value.
            //// Use DateTimeValue property to set its value on ElementItem level.
            //'DateTime': 5,

            // A field that holds another defined Element object within the resource pool.
            // Use SelectedElementItem property to set its value on ElementItem level.
            'Element': 6,

            // The field that presents each item's main income (e.g. Sales Price).
            // Also resource pool amount will be calculated based on this field.
            // Defined once per Element (at the moment, can be changed to per Resource Pool).
            // Use DecimalValue property to set its value on ElementItem level.
            'DirectIncome': 11,

            // The multiplier of the resource pool (e.g. Number of sales, number of users).
            // Defined once per Element (at the moment, can be changed to per Resource Pool).
            // Use DecimalValue property to set its value on ElementItem level.
            'Multiplier': 12
        };
        
        self.ElementFieldIndexCalculationType = {
            // Default type.
            // Uses the lowest score as the base (reference) rating in the group, then calculates the difference from that base.
            // Base rating (lowest) gets 0 from the pool and other items get an amount based on their difference.
            // Aims to maximize the benefit of the pool.
            'Aggressive': 1,

            // Sums all ratings and calculates the percentages.
            // All items get an amount, including the lowest scored item.
            // Good for cases that only use 'Resource Pool - Initial Amount' feature.
            'Passive': 2
        };

        self.ElementFieldIndexSortType = {

            // Default type.
            // High rating is better.
            'Highest': 1,

            // Low rating is better.
            'Lowest': 2
        };

        self.getEnumKey = function (enumTableKey, value) {
            for (var tableKey in self) {

                // Ignore these tables
                if (enumTableKey === '$get' || enumTableKey === 'getEnumKey') {
                    return;
                }

                // Search through enum tables & their values
                if (tableKey === enumTableKey) {
                    for (var valueKey in self[tableKey]) {
                        if (self[tableKey][valueKey] === value) {
                            return valueKey;
                        }
                    }
                }
            }
        };

        return self;
    }
})();

(function () {
    'use strict';

    var factoryId = 'ResourcePool';
    angular.module('main')
        .factory(factoryId, ['logger', resourcePoolFactory]);

    function resourcePoolFactory(logger) {

        // Logger
        logger = logger.forSource(factoryId);

        // Server-side properties
        Object.defineProperty(ResourcePool.prototype, 'UseFixedResourcePoolRate', {
            enumerable: true,
            configurable: true,
            get: function () { return this.backingFields._useFixedResourcePoolRate; },
            set: function (value) {

                if (this.backingFields._useFixedResourcePoolRate !== value) {
                    this.backingFields._useFixedResourcePoolRate = value;

                    this.setResourcePoolRate();
                }
            }
        });

        // Client-side properties
        Object.defineProperty(ResourcePool.prototype, 'RatingMode', {
            enumerable: true,
            configurable: true,
            get: function () { return this.backingFields._ratingMode; },
            set: function (value) {
                if (this.backingFields._ratingMode !== value) {
                    this.backingFields._ratingMode = value;

                    this.setResourcePoolRate();

                    this.ElementSet.forEach(function (element) {

                        element.ElementFieldSet.forEach(function (field) {

                            // Field calculations
                            if (field.IndexEnabled) {
                                field.setIndexRating();
                            }

                            if (!field.UseFixedValue) {
                                field.ElementCellSet.forEach(function (cell) {

                                    // Cell calculations
                                    switch (field.DataType) {
                                        case 2:
                                        case 3:
                                        case 4:
                                            // TODO 5 (DateTime?)
                                        case 11:
                                        case 12: {
                                            cell.setNumericValue();
                                            break;
                                        }
                                    }
                                });
                            }
                        });
                    });
                }
            }
        });

        // Return
        return ResourcePool;

        function ResourcePool() {

            var self = this;

            // Server-side
            self.Id = 0;
            self.UserId = 0;
            self.Name = '';
            self.InitialValue = 0;
            self.ResourcePoolRateTotal = 0; // Computed value - Used in: setOtherUsersResourcePoolRateTotal
            self.ResourcePoolRateCount = 0; // Computed value - Used in: setOtherUsersResourcePoolRateCount
            self.RatingCount = 0; // Computed value - Used in: resourcePoolEditor.html
            // TODO breezejs - Cannot assign a navigation property in an entity ctor
            //self.User = null;
            //self.ElementSet = [];
            //self.UserResourcePoolSet = [];

            // Local variables
            self.backingFields = {
                _currentUserResourcePoolRate: null,
                _isAdded: false,
                _otherUsersResourcePoolRateTotal: null,
                _otherUsersResourcePoolRateCount: null,
                _ratingMode: 1, // Only my ratings vs. All users' ratings
                _resourcePoolRate: null,
                _resourcePoolRatePercentage: null,
                _selectedElement: null,
                _useFixedResourcePoolRate: false
            };
            self.isEditing = false; // Determines whether the object is being edited or not
            self.isTemp = false; // Determines whether object was created for demo purposes or not
            // TODO Move this to field.js?
            self.displayMultiplierFunctions = true; // In some cases, it's not necessary for the user to change multiplier

            // Functions
            self._init = _init;
            self.currentUserResourcePool = currentUserResourcePool;
            self.currentUserResourcePoolRate = currentUserResourcePoolRate;
            self.displayResourcePoolDetails = displayResourcePoolDetails;
            self.displayRatingMode = displayRatingMode;
            self.getEntities = getEntities;
            // Determines whether entityState is actually isAdded.
            // Anonymous users can also add/edit resource pool.
            // However, when an anonymous user adds a new resource pool, it actually doesn't save to database and entityState stays as isAdded().
            // Then, when the user clicks on 'Cancel CMRP', rejectChanges() will be called, which removes the resource pool.
            // To prevent this issue, when anon user calls saveChanges, this flag will be used (isAdded will become true) and acceptChanges will be called (still not saving to actual database).
            // Now, calling rejectChanges will return the entities to their previous state without any problem.
            // And if the anon user will register or login, this flag will be checked in dataContext.js and all the related entities will be converted back to isAdded() state.
            // SH - 30 Nov. '15
            self.isAdded = isAdded;
            self.mainElement = mainElement;
            self.name = name;
            self.otherUsersResourcePoolRateCount = otherUsersResourcePoolRateCount;
            self.otherUsersResourcePoolRateTotal = otherUsersResourcePoolRateTotal;
            self.resourcePoolRate = resourcePoolRate;
            self.resourcePoolRateAverage = resourcePoolRateAverage;
            self.resourcePoolRateCount = resourcePoolRateCount;
            self.resourcePoolRatePercentage = resourcePoolRatePercentage;
            self.resourcePoolRateTotal = resourcePoolRateTotal;
            self.selectedElement = selectedElement;
            self.setCurrentUserResourcePoolRate = setCurrentUserResourcePoolRate;
            self.setOtherUsersResourcePoolRateCount = setOtherUsersResourcePoolRateCount;
            self.setOtherUsersResourcePoolRateTotal = setOtherUsersResourcePoolRateTotal;
            self.setResourcePoolRate = setResourcePoolRate;
            self.setResourcePoolRatePercentage = setResourcePoolRatePercentage;
            self.toggleRatingMode = toggleRatingMode;
            self.updateAnonymousEntities = updateAnonymousEntities;
            self.updateCache = updateCache;

            /*** Implementations ***/

            // Should be called after createEntity or retrieving it from server
            function _init(setComputedFields) {
                setComputedFields = typeof setComputedFields !== 'undefined' ? setComputedFields : false;

                // Set initial values of computed fields
                if (setComputedFields) {

                    var userRatings = [];

                    // ResourcePool
                    self.UserResourcePoolSet.forEach(function (userResourcePool) {
                        self.ResourcePoolRateTotal += userResourcePool.ResourcePoolRate;
                        self.ResourcePoolRateCount += 1;

                        if (userRatings.indexOf(userResourcePool.UserId) === -1) {
                            userRatings.push(userResourcePool.UserId);
                        }
                    });

                    // Fields
                    self.ElementSet.forEach(function (element) {
                        element.ElementFieldSet.forEach(function (elementField) {
                            elementField.UserElementFieldSet.forEach(function (userElementField) {
                                elementField.IndexRatingTotal += userElementField.IndexRating;
                                elementField.IndexRatingCount += 1;

                                if (userRatings.indexOf(userElementField.UserId) === -1) {
                                    userRatings.push(userElementField.UserId);
                                }
                            });

                            // Cells
                            elementField.ElementCellSet.forEach(function (elementCell) {
                                elementCell.UserElementCellSet.forEach(function (userElementCell) {
                                    elementCell.StringValue = ''; // TODO ?
                                    elementCell.NumericValueTotal += userElementCell.DecimalValue; // TODO Correct approach?
                                    elementCell.NumericValueCount += 1;

                                    if (elementField.IndexEnabled) {
                                        if (userRatings.indexOf(userElementCell.UserId) === -1) {
                                            userRatings.push(userElementCell.UserId);
                                        }
                                    }
                                });
                            });
                        });
                    });

                    // Rating count
                    self.RatingCount = userRatings.length;
                }

                // Set otherUsers' data
                self.setOtherUsersResourcePoolRateTotal();
                self.setOtherUsersResourcePoolRateCount();

                // Elements
                if (typeof self.ElementSet !== 'undefined') {
                    self.ElementSet.forEach(function (element) {

                        // Fields
                        if (typeof element.ElementFieldSet !== 'undefined') {
                            element.ElementFieldSet.forEach(function (field) {

                                field.setOtherUsersIndexRatingTotal();
                                field.setOtherUsersIndexRatingCount();

                                // Cells
                                if (typeof field.ElementCellSet !== 'undefined') {
                                    field.ElementCellSet.forEach(function (cell) {

                                        cell.setOtherUsersNumericValueTotal();
                                        cell.setOtherUsersNumericValueCount();
                                    });
                                }
                            });
                        }
                    });
                }

                updateCache();
            }

            function currentUserResourcePool() {
                return self.UserResourcePoolSet.length > 0 ?
                    self.UserResourcePoolSet[0] :
                    null;
            }

            function currentUserResourcePoolRate() {

                if (self.backingFields._currentUserResourcePoolRate === null) {
                    self.setCurrentUserResourcePoolRate(false);
                }

                return self.backingFields._currentUserResourcePoolRate;
            }

            function displayResourcePoolDetails() {
                return self.selectedElement().directIncomeField() !== null &&
                    self.selectedElement().elementFieldIndexSet().length > 0;
            }

            // Checks whether resource pool has any item that can be rateable
            // Obsolete: Replaced with RatingCount > 0 / coni2k - 21 Feb. '16
            function displayRatingMode() {

                // Check resource pool level first
                if (!self.UseFixedResourcePoolRate) {
                    return true;
                }

                // Field index level
                for (var elementIndex = 0; elementIndex < self.ElementSet.length; elementIndex++) {
                    var element = self.ElementSet[elementIndex];

                    // If there are multiple indexes, then the users can set index rating
                    if (element.elementFieldIndexSet().length > 1) {
                        return true;
                    }

                    // If there is an index without a fixed value
                    if (element.elementFieldIndexSet().length > 0 && !element.elementFieldIndexSet()[0].UseFixedValue) {
                        return true;
                    }
                }

                return false;
            }

            function getEntities() {

                var entities = [];

                // No need to continue
                if (self.isTemp) {
                    return entities;
                }

                // Resource pool
                entities.push(self);

                // User resource pools
                self.UserResourcePoolSet.forEach(function (userResourcePool) {
                    entities.push(userResourcePool);
                });

                // Elements
                self.ElementSet.forEach(function (element) {
                    entities.push(element);

                    // Fields
                    element.ElementFieldSet.forEach(function (elementField) {
                        entities.push(elementField);

                        // User element fields
                        elementField.UserElementFieldSet.forEach(function (userElementField) {
                            entities.push(userElementField);
                        });
                    });

                    // Items
                    element.ElementItemSet.forEach(function (elementItem) {
                        entities.push(elementItem);

                        // Cells
                        elementItem.ElementCellSet.forEach(function (elementCell) {
                            entities.push(elementCell);

                            // User cells
                            elementCell.UserElementCellSet.forEach(function (userElementCell) {
                                entities.push(userElementCell);
                            });
                        });
                    });
                });

                return entities;
            }

            function isAdded(value) {
                if (typeof value !== 'undefined') {
                    self.backingFields._isAdded = value;
                }
                return self.backingFields._isAdded;
            }

            function mainElement() {
                var result = self.ElementSet.filter(function (element) {
                    return element.IsMainElement;
                });

                return result.length > 0 ? result[0] : null;
            }

            function name() {
                var name = self.Name;
                name += self.isEditing ? ' - Editing' : '';
                return name;
            }

            // TODO Since this is a fixed value based on ResourcePoolRateCount & current user's rate,
            // it could be calculated on server, check it later again / SH - 03 Aug. '15
            function otherUsersResourcePoolRateCount() {

                // Set other users' value on the initial call
                if (self.backingFields._otherUsersResourcePoolRateCount === null) {
                    self.setOtherUsersResourcePoolRateCount();
                }

                return self.backingFields._otherUsersResourcePoolRateCount;
            }

            // TODO Since this is a fixed value based on ResourcePoolRateTotal & current user's rate,
            // it could be calculated on server, check it later again / SH - 03 Aug. '15
            function otherUsersResourcePoolRateTotal() {

                // Set other users' value on the initial call
                if (self.backingFields._otherUsersResourcePoolRateTotal === null) {
                    self.setOtherUsersResourcePoolRateTotal();
                }

                return self.backingFields._otherUsersResourcePoolRateTotal;
            }

            function resourcePoolRate() {

                if (self.backingFields._resourcePoolRate === null) {
                    self.setResourcePoolRate(false);
                }

                return self.backingFields._resourcePoolRate;
            }

            function resourcePoolRateAverage() {

                if (self.resourcePoolRateCount() === null) {
                    return null;
                }

                return self.resourcePoolRateCount() === 0 ?
                    0 :
                    self.resourcePoolRateTotal() / self.resourcePoolRateCount();
            }

            function resourcePoolRateCount() {
                return self.UseFixedResourcePoolRate ?
                    self.currentUserResourcePool() !== null && self.currentUserResourcePool().UserId === self.UserId ? // If it belongs to current user
                    1 :
                    self.otherUsersResourcePoolRateCount() :
                    self.otherUsersResourcePoolRateCount() + 1; // There is always default value, increase count by 1
            }

            function resourcePoolRatePercentage() {

                if (self.backingFields._resourcePoolRatePercentage === null) {
                    self.setResourcePoolRatePercentage(false);
                }

                return self.backingFields._resourcePoolRatePercentage;
            }

            function resourcePoolRateTotal() {
                return self.UseFixedResourcePoolRate ?
                    self.currentUserResourcePool() !== null && self.currentUserResourcePool().UserId === self.UserId ? // If it belongs to current user
                    self.currentUserResourcePoolRate() :
                    self.otherUsersResourcePoolRateTotal() :
                    self.otherUsersResourcePoolRateTotal() + self.currentUserResourcePoolRate();
            }

            function selectedElement(value) {

                // Set new value
                if (typeof value !== 'undefined' && self.backingFields._selectedElement !== value) {
                    self.backingFields._selectedElement = value;
                }

                // If there is no existing value (initial state), use mainElement() as the selected
                if (self.backingFields._selectedElement === null && self.mainElement()) {
                    self.backingFields._selectedElement = self.mainElement();
                }

                return self.backingFields._selectedElement;
            }

            function setCurrentUserResourcePoolRate(updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = self.currentUserResourcePool() !== null ?
                    self.currentUserResourcePool().ResourcePoolRate :
                    10; // Default value?

                if (self.backingFields._currentUserResourcePoolRate !== value) {
                    self.backingFields._currentUserResourcePoolRate = value;

                    // Update related
                    if (updateRelated) {
                        self.setResourcePoolRate();
                    }
                }
            }

            function setOtherUsersResourcePoolRateCount() {

                self.backingFields._otherUsersResourcePoolRateCount = self.ResourcePoolRateCount;

                // Exclude current user's
                if (self.currentUserResourcePool() !== null) {
                    self.backingFields._otherUsersResourcePoolRateCount--;
                }
            }

            function setOtherUsersResourcePoolRateTotal() {
                self.backingFields._otherUsersResourcePoolRateTotal = self.ResourcePoolRateTotal !== null ?
                    self.ResourcePoolRateTotal :
                    0;

                // Exclude current user's
                if (self.currentUserResourcePool() !== null) {
                    self.backingFields._otherUsersResourcePoolRateTotal -= self.currentUserResourcePool().ResourcePoolRate;
                }
            }

            function setResourcePoolRate(updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value;

                if (self.UseFixedResourcePoolRate) {
                    value = self.resourcePoolRateAverage();
                } else {
                    switch (self.RatingMode) {
                        case 1: { value = self.currentUserResourcePoolRate(); break; } // Current user's
                        case 2: { value = self.resourcePoolRateAverage(); break; } // All
                    }
                }

                if (self.backingFields._resourcePoolRate !== value) {
                    self.backingFields._resourcePoolRate = value;

                    // Update related
                    if (updateRelated) {
                        self.setResourcePoolRatePercentage();
                    }
                }
            }

            function setResourcePoolRatePercentage(updateRelated) {
                updateRelated = typeof updateRelated === 'undefined' ? true : updateRelated;

                var value = self.resourcePoolRate() === 0 ?
                    0 :
                    self.resourcePoolRate() / 100;

                if (self.backingFields._resourcePoolRatePercentage !== value) {
                    self.backingFields._resourcePoolRatePercentage = value;

                    // Update related
                    if (updateRelated) {
                        self.ElementSet.forEach(function (element) {

                            element.ElementItemSet.forEach(function (item) {
                                item.setResourcePoolAmount();
                            });
                        });
                    }
                }
            }

            function toggleRatingMode() {
                self.RatingMode = self.RatingMode === 1 ? 2 : 1;
            }

            // TOOD Should be obsolete if we could start using "auto save anonymous user"
            function updateAnonymousEntities() {

                if (!self.isAdded()) {
                    return;
                }

                // Turn the flag off
                self.isAdded(false);

                // Resource pool itself
                self.entityAspect.setAdded();

                // User resource pools
                self.UserResourcePoolSet.forEach(function (userResourcePool) {
                    userResourcePool.entityAspect.setAdded();
                });

                // Elements
                self.ElementSet.forEach(function (element) {
                    element.entityAspect.setAdded();

                    // Fields
                    element.ElementFieldSet.forEach(function (elementField) {
                        elementField.entityAspect.setAdded();

                        // User element fields
                        elementField.UserElementFieldSet.forEach(function (userElementField) {
                            userElementField.entityAspect.setAdded();
                        });
                    });

                    // Items
                    element.ElementItemSet.forEach(function (elementItem) {
                        elementItem.entityAspect.setAdded();

                        // Cells
                        elementItem.ElementCellSet.forEach(function (elementCell) {
                            elementCell.entityAspect.setAdded();

                            // User cells
                            elementCell.UserElementCellSet.forEach(function (userElementCell) {
                                userElementCell.entityAspect.setAdded();
                            });
                        });
                    });
                });
            }

            // TODO Most of these functions are related with userService.js - updateX functions
            // Try to merge these two - Actually try to handle these actions within the related entity / SH - 27 Nov. '15
            function updateCache() {

                var isUnchanged = false;

                self.setCurrentUserResourcePoolRate();

                // Elements
                if (typeof self.ElementSet !== 'undefined') {
                    self.ElementSet.forEach(function (element) {

                        // TODO Review this later / SH - 24 Nov. '15
                        element.setElementFieldIndexSet();

                        // Fields
                        if (typeof element.ElementFieldSet !== 'undefined') {
                            element.ElementFieldSet.forEach(function (field) {

                                if (field.IndexEnabled) {
                                    // TODO Actually index rating can't be set through resourcePoolEdit page and no need to update this cache
                                    // But still keep it as a reminder? / SH - 29 Nov. '15
                                    field.setCurrentUserIndexRating();
                                }

                                // Cells
                                if (typeof field.ElementCellSet !== 'undefined') {
                                    field.ElementCellSet.forEach(function (cell) {

                                        switch (cell.ElementField.DataType) {
                                            case 1: {
                                                // TODO Again what a mess!
                                                // StringValue is a computed value, it should normally come from the server
                                                // But in case resource pool was just created, then it should be directly set like this.
                                                // Otherwise, it doesn't show its value on editor.
                                                // And on top of it, since it changes, breeze thinks that 'cell' is modified and tries to send it server
                                                // which results an error. So that's why modified check & acceptChanges parts were added.
                                                // SH - 01 Dec. '15
                                                if (cell.UserElementCellSet.length > 0) {
                                                    isUnchanged = cell.entityAspect.entityState.isUnchanged();
                                                    cell.StringValue = cell.UserElementCellSet[0].StringValue;
                                                    if (isUnchanged) { cell.entityAspect.acceptChanges(); }
                                                }
                                                break;
                                            }
                                            case 2:
                                            case 3:
                                            case 4:
                                                // TODO DateTime?
                                                {
                                                    cell.setCurrentUserNumericValue();
                                                    break;
                                                }
                                            case 11:
                                                {
                                                    // TODO DirectIncome is always calculated from NumericValueTotal
                                                    // Which is actually not correct but till that its fixed, update it like this / SH - 29 Nov. '15
                                                    // Also check 'What a mess' of StringValue
                                                    if (cell.UserElementCellSet.length > 0) {
                                                        isUnchanged = cell.entityAspect.entityState.isUnchanged();
                                                        cell.NumericValueTotal = cell.UserElementCellSet[0].DecimalValue;
                                                        if (isUnchanged) { cell.entityAspect.acceptChanges(); }
                                                    }

                                                    cell.setCurrentUserNumericValue();
                                                    break;
                                                }
                                            case 12:
                                                {
                                                    cell.ElementItem.setMultiplier();

                                                    if (cell.ElementField.IndexEnabled) {
                                                        cell.setNumericValueMultiplied();
                                                    }

                                                    break;
                                                }
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }
        }
    }
})();
(function () {
    'use strict';

    var factoryId = 'User';
    angular.module('main')
        .factory(factoryId, ['logger', userFactory]);

    function userFactory(logger) {

        // Logger
        logger = logger.forSource(factoryId);

        // Return
        return User;

        function User() {

            var self = this;

            // Server-side
            self.Id = 0;
            self.Email = '';
            self.EmailConfirmed = false;
            self.UserName = '';
            self.FirstName = '';
            self.MiddleName = '';
            self.LastName = '';
            self.PhoneNumber = '';
            self.PhoneNumberConfirmed = false;
            self.TwoFactorEnabled = false;
            self.AccessFailedCount = 0;
            self.LockoutEnabled = false;
            self.LockoutEndDateUtc = null;
            self.Notes = '';
            self.CreatedOn = new Date();
            self.ModifiedOn = new Date();
            self.DeletedOn = null;
            // TODO breezejs - Cannot assign a navigation property in an entity ctor
            //self.Claims = null;
            //self.Logins = [];
            //self.Roles = [];

            // Client-side
            self.isEditing = false;

            // Functions
            self.getEntities = getEntities;
            self.hasPassword = hasPassword;
            self.isAuthenticated = isAuthenticated;

            /*** Implementations ***/

            function getEntities() {

                var entities = [];

                entities.push(self);

                self.ResourcePoolSet.forEach(function (resourcePool) {
                    var resourcePoolEntities = resourcePool.getEntities(); // TODO Probably there is an easier way to do this?
                    resourcePoolEntities.forEach(function (entity) {
                        entities.push(entity);
                    });
                });

                // TODO Other user related entities?

                return entities;
            }

            function hasPassword() {
                if (typeof self.Claims === 'undefined') {
                    throw new Error('Invalid operation: Claims is undefined');
                }

                for (var i = 0; i < self.Claims.length; i++) {
                    var claim = self.Claims[i];
                    if (claim.ClaimType === 'HasNoPassword') {
                        return false;
                    }
                }

                return true;
            }

            function isAuthenticated() {
                return self.Id > 0;
            }
        }
    }
})();
(function () {
    'use strict';

    var factoryId = 'UserElementCell';
    angular.module('main')
        .factory(factoryId, ['logger', userElementCellFactory]);

    function userElementCellFactory(logger) {

        // Logger
        logger = logger.forSource(factoryId);

        // Properties
        Object.defineProperty(UserElementCell.prototype, 'DecimalValue', {
            enumerable: true,
            configurable: true,
            get: function () { return this.backingFields._DecimalValue; },
            set: function (value) {
                if (this.backingFields._DecimalValue !== value) {
                    this.backingFields._DecimalValue = value;
                }
            }
        });

        // Return
        return UserElementCell;

        function UserElementCell() {

            var self = this;

            // Server-side
            self.UserId = 0;
            self.ElementCellId = 0;
            self.StringValue = null;
            self.BooleanValue = null;
            self.IntegerValue = null;
            // 
            self.DateTimeValue = null;

            // Local variables
            self.backingFields = {
                _DecimalValue: null
            };
            self.isEditing = false;
        }
    }
})();
(function () {
    'use strict';

    var factoryId = 'UserElementField';
    angular.module('main')
        .factory(factoryId, ['logger', userElementFieldFactory]);

    function userElementFieldFactory(logger) {

        // Logger
        logger = logger.forSource(factoryId);

        // Return
        return UserElementField;

        function UserElementField() {

            var self = this;

            // Server-side
            self.UserId = 0;
            self.ElementFieldId = 0;
            self.Rating = 0;

            // Local variables
            self.isEditing = false;
        }
    }
})();
(function () {
    'use strict';

    var factoryId = 'UserResourcePool';
    angular.module('main')
        .factory(factoryId, ['logger', userResourcePoolFactory]);

    function userResourcePoolFactory(logger) {

        // Logger
        logger = logger.forSource(factoryId);

        // Return
        return UserResourcePool;

        function UserResourcePool() {

            var self = this;

            // Server-side
            self.UserId = 0;
            self.ResourcePoolId = 0;
            self.ResourcePoolRate = 0;

            // Local variables
            self.isEditing = false;
        }
    }
})();
(function () {
    'use strict';

    var factoryId = 'applicationFactory';
    angular.module('main')
        .factory(factoryId, ['$http', '$q', 'serviceAppUrl', 'logger', applicationFactory]);

    function applicationFactory($http, $q, serviceAppUrl, logger) {
        logger = logger.forSource(factoryId);

        var applicationInfoUrl = serviceAppUrl + '/api/Application/ApplicationInfo';
        var applicationInfo = null;

        // Factory methods
        var factory = {
            getApplicationInfo: getApplicationInfo
        };

        return factory;

        /*** Implementations ***/

        function getApplicationInfo() {

            var deferred = $q.defer();

            if (applicationInfo !== null) {
                deferred.resolve(applicationInfo);
            }
            else {
                $http.get(applicationInfoUrl)
                    .success(function (data) {
                        applicationInfo = data;
                        deferred.resolve(applicationInfo);
                    })
                    .error(function (data, status, headers, config) {
                        // TODO Check this approach? - Just return 'Something went wrong'?
                        deferred.reject({ data: data, status: status, headers: headers, config: config });
                    });
            }

            return deferred.promise;
        }
    }
})();

/***
 * Service: dataContext 
 *
 * Handles all persistence and creation/deletion of app entities
 * using BreezeJS.
 *
 ***/
(function () {
    'use strict';

    var factoryId = 'dataContext';
    angular.module('main')
        .factory(factoryId, ['entityManagerFactory', '$q', '$rootScope', '$timeout', 'logger', dataContext]);

    function dataContext(entityManagerFactory, $q, $rootScope, $timeout, logger) {

        // Logger
        logger = logger.forSource(factoryId);

        // Manager
        var currentUser = { isAuthenticated: function () { return false; } };
        var manager = null;
        var metadataReadyPromise = null;
        var saveTimer = null;

        // Factory methods
        var factory = {
            clear: clear,
            createEntity: createEntity,
            executeQuery: executeQuery,
            fetchEntityByKey: fetchEntityByKey,
            getChanges: getChanges,
            getChangesCount: getChangesCount,
            getEntities: getEntities,
            hasChanges: hasChanges,
            metadataReady: metadataReady,
            rejectChanges: rejectChanges,
            saveChanges: saveChanges,
            saveChangesAlt: saveChangesAlt,
            updateAnonymousChanges: updateAnonymousChanges
        };

        // Event handlers
        $rootScope.$on('ElementField_createUserElementCell', createUserElementCell);
        $rootScope.$on('userFactory_currentUserChanged', currentUserChanged);

        _init();

        return factory;

        /*** Implementations ***/

        function _init() {
            manager = entityManagerFactory.newManager();
        }

        function clear() {
            manager.clear();
        }

        function createEntity(entityType, initialValues) {

            // All entities will be created in isEditing state by default
            if (typeof initialValues.isEditing === 'undefined') {
                initialValues.isEditing = true;
            }

            return manager.createEntity(entityType, initialValues);
        }

        function createUserElementCell(event, userElementCell) {
            return createEntity('UserElementCell', userElementCell);
        }

        function currentUserChanged(event, newUser) {
            currentUser = newUser;
        }

        function executeQuery(query) {
            return manager.executeQuery(query);
        }

        function fetchEntityByKey(typeName, keyValues, checkLocalCacheFirst) {
            return manager.fetchEntityByKey(typeName, keyValues, checkLocalCacheFirst);
        }

        function getChanges(entityTypeName, entityState) {
            entityTypeName = typeof entityTypeName !== 'undefined' ? entityTypeName : null;
            entityState = typeof entityState !== 'undefined' ? entityState : null;

            var all = manager.getChanges();
            var changes = [];

            // Filters
            all.forEach(function (change) {
                if (!change.isEditing &&
                    (entityTypeName === null || change.entityType.shortName === entityTypeName) &&
                    (entityState === null || change.entityAspect.entityState === entityState)) {
                    changes.push(change);
                }
            });

            return changes;
            // return manager.getChanges();
        }

        function getChangesCount() {
            return getChanges().length;
            // return manager.getChanges().length;
        }

        function getEntities(entityTypes, entityStates) {
            return manager.getEntities(entityTypes, entityStates);
        }

        function hasChanges() {
            return manager.hasChanges();
        }

        function metadataReady() {

            if (metadataReadyPromise === null) {

                var deferred = $q.defer();

                metadataReadyPromise = deferred.promise;

                if (manager.metadataStore.isEmpty()) {
                    manager.fetchMetadata()
                        .then(function () {
                            deferred.resolve();
                        },
                        function (error) {
                            deferred.reject(error);
                        });
                } else {
                    deferred.resolve();
                }
            }

            return metadataReadyPromise;
        }

        function rejectChanges() {
            manager.rejectChanges();
        }

        function saveChanges(delay) {
            delay = typeof delay !== 'undefined' ? delay : 0;

            // Anonymous user check
            if (!currentUser.isAuthenticated()) {
                $rootScope.$broadcast('anonymousUserInteracted');
                return $q.reject({});
            }

            // Cancel existing timers (delay the save)
            if (saveTimer !== null) {
                $timeout.cancel(saveTimer);
            }

            // Save immediately or wait based on delay
            if (delay === 0) {
                return saveChangesInternal();
            } else {
                saveTimer = $timeout(function () {
                    saveChangesInternal();
                }, delay);
                return saveTimer;
            }

            // TODO Is it necessary to cancel the timer at the end of the service, like this ?

            //// When the DOM element is removed from the page,
            //// AngularJS will trigger the $destroy event on
            //// the scope. This gives us a chance to cancel any
            //// pending timer that we may have.
            //$scope.$on("$destroy", function (event) {
            //    $timeout.cancel(increaseMultiplierTimeoutInitial);
            //    $timeout.cancel(increaseMultiplierTimeoutRecursive);
            //});
        }

        function saveChangesInternal() {

            var count = getChangesCount();
            var promise = null;
            var saveBatches = prepareSaveBatches();
            saveBatches.forEach(function (batch) {

                // ignore empty batches (except 'null' which means "save everything else")
                if (batch === null || batch.length > 0) {

                    // Broadcast, so UI can block
                    $rootScope.$broadcast('saveChangesStart');

                    promise = promise ?
                        promise.then(function () { return manager.saveChanges(batch); }) :
                        manager.saveChanges(batch);
                }
            });

            // There is nothing to save?
            if (promise === null) {
                promise = $q.resolve(null);
            }

            return promise.then(success).catch(failed).finally(completed);

            function success(result) {
                logger.logSuccess('Saved ' + count + ' change(s)');
                return result;
            }

            function failed(error) {
                if (typeof error.status !== 'undefined' && error.status === '409') {
                    logger.logError('Save failed!<br />The record you attempted to edit was modified by another user after you got the original value. The edit operation was canceled.', error, true);
                } else if (typeof error.entityErrors !== 'undefined') {

                    var errorMessage = 'Save failed!<br />';

                    for (var key in error.entityErrors) {
                        var entityError = error.entityErrors[key];
                        errorMessage += entityError.errorMessage + '<br />';
                    }

                    logger.logError(errorMessage, null, true);

                } else {
                    logger.logError('Save failed!', error, true);
                }

                return $q.reject(error); // pass error along to next handler
            }

            function completed() {

                // Broadcast, so UI can unblock
                $rootScope.$broadcast('saveChangesCompleted');
            }

            function prepareSaveBatches() {

                var batches = [];

                // RowVersion fix
                // TODO How about Deleted state?
                var modifiedEntities = getChanges(null, breeze.EntityState.Modified);
                modifiedEntities.forEach(function (entity) {
                    var rowVersion = entity.RowVersion;
                    entity.RowVersion = '';
                    entity.RowVersion = rowVersion;
                });
                batches.push(modifiedEntities);

                /* Aaargh! 
                * Web API OData doesn't calculate the proper save order
                * which means, if we aren't careful on the client,
                * we could save a new TodoItem before we saved its parent new TodoList
                * or delete the parent TodoList before saving its deleted child TodoItems.
                * OData says it is up to the client to save entities in the order
                * required by referential constraints of the database.
                * While we could save each time you make a change, that sucks.
                * So we'll divvy up the pending changes into 4 batches
                * 1. Deleted Todos
                * 2. Deleted TodoLists
                * 3. Added TodoLists
                * 4. Every other change
                */

                batches.push(getChanges('UserElementCell', breeze.EntityState.Deleted));
                batches.push(getChanges('ElementCell', breeze.EntityState.Deleted));
                batches.push(getChanges('ElementItem', breeze.EntityState.Deleted));
                batches.push(getChanges('UserElementField', breeze.EntityState.Deleted));
                batches.push(getChanges('ElementField', breeze.EntityState.Deleted));
                batches.push(getChanges('Element', breeze.EntityState.Deleted));
                batches.push(getChanges('UserResourcePool', breeze.EntityState.Deleted));
                batches.push(getChanges('ResourcePool', breeze.EntityState.Deleted));

                batches.push(getChanges('ResourcePool', breeze.EntityState.Added));
                batches.push(getChanges('UserResourcePool', breeze.EntityState.Added));
                batches.push(getChanges('Element', breeze.EntityState.Added));
                batches.push(getChanges('ElementField', breeze.EntityState.Added));
                batches.push(getChanges('UserElementField', breeze.EntityState.Added));
                batches.push(getChanges('ElementItem', breeze.EntityState.Added));
                batches.push(getChanges('ElementCell', breeze.EntityState.Added));
                batches.push(getChanges('UserElementCell', breeze.EntityState.Added));

                // batches.push(null); // empty = save all remaining pending changes

                return batches;
                /*
                 *  No we can't flatten into one request because Web API OData reorders
                 *  arbitrarily, causing the database failure we're trying to avoid.
                 */
            }
        }

        function saveChangesAlt(entities, delay) {
            delay = typeof delay !== 'undefined' ? delay : 0;

            // Anonymous user check
            if (!currentUser.isAuthenticated()) {
                $rootScope.$broadcast('anonymousUserInteracted');
                return $q.reject({});
            }

            // Cancel existing timers (delay the save)
            if (saveTimer !== null) {
                $timeout.cancel(saveTimer);
            }

            // Save immediately or wait based on delay
            if (delay === 0) {
                return saveChangesInternalAlt(entities);
            } else {
                saveTimer = $timeout(function () {
                    saveChangesInternalAlt(entities);
                }, delay);
                return saveTimer;
            }

            // TODO Is it necessary to cancel the timer at the end of the service, like this ?

            //// When the DOM element is removed from the page,
            //// AngularJS will trigger the $destroy event on
            //// the scope. This gives us a chance to cancel any
            //// pending timer that we may have.
            //$scope.$on("$destroy", function (event) {
            //    $timeout.cancel(increaseMultiplierTimeoutInitial);
            //    $timeout.cancel(increaseMultiplierTimeoutRecursive);
            //});
        }

        function saveChangesInternalAlt(entities) {

            var count = entities.length; // getChangesCount();
            var promise = null;
            var saveBatches = prepareSaveBatches(entities);
            saveBatches.forEach(function (batch) {

                // ignore empty batches (except 'null' which means "save everything else")
                if (batch === null || batch.length > 0) {

                    // Broadcast, so UI can block
                    $rootScope.$broadcast('saveChangesStart');

                    promise = promise ?
                        promise.then(function () { return manager.saveChanges(batch); }) :
                        manager.saveChanges(batch);
                }
            });
            return promise.then(success).catch(failed).finally(completed);

            function success(result) {
                logger.logSuccess('Saved ' + count + ' change(s)');
                return result;
            }

            function failed(error) {
                if (typeof error.status !== 'undefined' && error.status === '409') {
                    logger.logError('Save failed!<br />The record you attempted to edit was modified by another user after you got the original value. The edit operation was canceled.', error, true);
                } else if (typeof error.entityErrors !== 'undefined') {

                    var errorMessage = 'Save failed!<br />';

                    for (var key in error.entityErrors) {
                        var entityError = error.entityErrors[key];
                        errorMessage += entityError.errorMessage + '<br />';
                    }

                    logger.logError(errorMessage, null, true);

                } else {
                    logger.logError('Save failed!', error, true);
                }

                return $q.reject(error); // pass error along to next handler
            }

            function completed() {

                // Broadcast, so UI can unblock
                $rootScope.$broadcast('saveChangesCompleted');
            }

            function prepareSaveBatches(entities) {

                var batches = [];

                // RowVersion fix
                // TODO How about Deleted state?
                var modifiedEntities = [];
                entities.forEach(function (entity) {
                    if (entity.entityAspect.entityState.isModified()) {
                        var rowVersion = entity.RowVersion;
                        entity.RowVersion = '';
                        entity.RowVersion = rowVersion;
                        modifiedEntities.push(entity);
                    }
                });
                batches.push(modifiedEntities);

                /* Aaargh! 
                * Web API OData doesn't calculate the proper save order
                * which means, if we aren't careful on the client,
                * we could save a new TodoItem before we saved its parent new TodoList
                * or delete the parent TodoList before saving its deleted child TodoItems.
                * OData says it is up to the client to save entities in the order
                * required by referential constraints of the database.
                * While we could save each time you make a change, that sucks.
                * So we'll divvy up the pending changes into 4 batches
                * 1. Deleted Todos
                * 2. Deleted TodoLists
                * 3. Added TodoLists
                * 4. Every other change
                */

                batches.push(getEntities(entities, 'UserElementCell', breeze.EntityState.Deleted));
                batches.push(getEntities(entities, 'ElementCell', breeze.EntityState.Deleted));
                batches.push(getEntities(entities, 'ElementItem', breeze.EntityState.Deleted));
                batches.push(getEntities(entities, 'UserElementField', breeze.EntityState.Deleted));
                batches.push(getEntities(entities, 'ElementField', breeze.EntityState.Deleted));
                batches.push(getEntities(entities, 'Element', breeze.EntityState.Deleted));
                batches.push(getEntities(entities, 'UserResourcePool', breeze.EntityState.Deleted));
                batches.push(getEntities(entities, 'ResourcePool', breeze.EntityState.Deleted));

                batches.push(getEntities(entities, 'ResourcePool', breeze.EntityState.Added));
                batches.push(getEntities(entities, 'UserResourcePool', breeze.EntityState.Added));
                batches.push(getEntities(entities, 'Element', breeze.EntityState.Added));
                batches.push(getEntities(entities, 'ElementField', breeze.EntityState.Added));
                batches.push(getEntities(entities, 'UserElementField', breeze.EntityState.Added));
                batches.push(getEntities(entities, 'ElementItem', breeze.EntityState.Added));
                batches.push(getEntities(entities, 'ElementCell', breeze.EntityState.Added));
                batches.push(getEntities(entities, 'UserElementCell', breeze.EntityState.Added));

                function getEntities(entities, typeName, entityState) {
                    var result = [];

                    entities.forEach(function (entity) {
                        if (entity.entityType.shortName === typeName && entity.entityAspect.entityState === entityState) {
                            result.push(entity);
                        }
                    });

                    return result;
                }

                // batches.push(null); // empty = save all remaining pending changes

                return batches;
                /*
                 *  No we can't flatten into one request because Web API OData reorders
                 *  arbitrarily, causing the database failure we're trying to avoid.
                 */
            }
        }

        // When the user interact with the application without registering or login in,
        // it creates an anonymous user and all entity creations done by this user
        // If the user has actually an account and logs in afterwards, this function moves all those changes to that logged in user
        function updateAnonymousChanges(anonymousUser, newUser) {

            var deferred = $q.defer();

            if (typeof anonymousUser === 'undefined' || anonymousUser === null) {
                deferred.reject('anonymousUser parameter cannot be undefined or null');
            }

            if (typeof newUser === 'undefined' || newUser === null) {
                deferred.reject('newUser parameter cannot be undefined or null');
            }

            var existingEntityPromises = [];
            anonymousUser.UserResourcePoolSet.forEach(function (userResourcePool) {
                var keyValues = [newUser.Id, userResourcePool.ResourcePoolId];
                var promise = fetchEntityByKey('UserResourcePool', keyValues);
                existingEntityPromises.push(promise);
            });

            anonymousUser.UserElementFieldSet.forEach(function (userElementField) {
                var keyValues = [newUser.Id, userElementField.ElementFieldId];
                var promise = fetchEntityByKey('UserElementField', keyValues);
                existingEntityPromises.push(promise);
            });

            anonymousUser.UserElementCellSet.forEach(function (userElementCell) {
                var keyValues = [newUser.Id, userElementCell.ElementCellId];
                var promise = fetchEntityByKey('UserElementCell', keyValues);
                existingEntityPromises.push(promise);
            });

            $q.all(existingEntityPromises).then(function () {

                // Resource pools
                anonymousUser.ResourcePoolSet.forEach(function (anonymousResourcePool) {
                    anonymousResourcePool.User = newUser;
                });

                // User resource pools
                var userResourcePoolSet = anonymousUser.UserResourcePoolSet.slice();
                userResourcePoolSet.forEach(function (anonymousUserResourcePool) {

                    var result = newUser.UserResourcePoolSet.filter(function (userResourcePool) {
                        return userResourcePool.ResourcePoolId === anonymousUserResourcePool.ResourcePoolId;
                    });

                    if (result.length > 0) { // If there is an existing entity, update it and remove the anonymous one
                        result[0].ResourcePoolRate = anonymousUserResourcePool.ResourcePoolRate;
                        anonymousUserResourcePool.entityAspect.rejectChanges();
                    } else { // Otherwise update the anonymous one with the new user
                        anonymousUserResourcePool.User = newUser;
                    }
                });

                // User element fields
                var userElementFieldSet = anonymousUser.UserElementFieldSet.slice();
                userElementFieldSet.forEach(function (anonymousUserElementField) {

                    // If existing entity, then make it modified
                    var result = newUser.UserElementFieldSet.filter(function (userElementField) {
                        return userElementField.ElementFieldId === anonymousUserElementField.ElementFieldId;
                    });

                    if (result.length > 0) { // If there is an existing entity, update it and remove the anonymous one
                        result[0].Rating = anonymousUserElementField.Rating;
                        anonymousUserElementField.entityAspect.rejectChanges();
                    } else { // Otherwise update the anonymous one with the new user
                        anonymousUserElementField.User = newUser;
                    }
                });

                // User element cells
                var userElementCellSet = anonymousUser.UserElementCellSet.slice();
                userElementCellSet.forEach(function (anonymousUserElementCell) {

                    // If existing entity, then make it modified
                    var result = newUser.UserElementCellSet.filter(function (userElementCell) {
                        return userElementCell.ElementCellId === anonymousUserElementCell.ElementCellId;
                    });

                    if (result.length > 0) { // If there is an existing entity, update it and remove the anonymous one
                        result[0].StringValue = anonymousUserElementCell.StringValue;
                        result[0].BooleanValue = anonymousUserElementCell.BooleanValue;
                        result[0].IntegerValue = anonymousUserElementCell.IntegerValue;
                        result[0].DecimalValue = anonymousUserElementCell.DecimalValue;
                        result[0].DateTimeValue = anonymousUserElementCell.DateTimeValue;
                        anonymousUserElementCell.entityAspect.rejectChanges();
                    } else { // Otherwise update the anonymous one with the new user
                        anonymousUserElementCell.User = newUser;
                    }
                });

                // Remove the old (anonymous) user
                anonymousUser.entityAspect.rejectChanges();

                deferred.resolve();
            });

            return deferred.promise;
        }
    }
})();
/***
 * Service: entityManagerFactory 
 *
 * Configures BreezeJS and creates new instance(s) of the 
 * BreezeJS EntityManager for use in a 'dataContext' service
 *
 ***/
(function () {
    'use strict';

    var factoryId = 'entityManagerFactory';
    angular.module('main')
        .factory(factoryId, ['breeze',
            'Element',
            'ElementCell',
            'ElementField',
            'ElementItem',
            'ResourcePool',
            'User',
            'UserElementCell',
            'UserElementField',
            'UserResourcePool',
            '$rootScope',
            'serviceAppUrl',
            'logger',
            entityManagerFactory]);

    function entityManagerFactory(breeze,
        Element,
        ElementCell,
        ElementField,
        ElementItem,
        ResourcePool,
        User,
        UserElementCell,
        UserElementField,
        UserResourcePool,
        $rootScope,
        serviceAppUrl,
        logger) {

        // Logger
        logger = logger.forSource(factoryId);

        // var serviceRoot = window.location.protocol + '//localhost:15001/';
        var serviceRoot = serviceAppUrl;
        var serviceName = serviceRoot + '/odata';
        var factory = {
            newManager: newManager,
            serviceName: serviceName
        };

        return factory;

        function newManager() {
            var manager = new breeze.EntityManager(serviceName);
            var store = manager.metadataStore;

            store.registerEntityTypeCtor('Element', Element);
            store.registerEntityTypeCtor('ElementCell', ElementCell);
            store.registerEntityTypeCtor('ElementField', ElementField);
            store.registerEntityTypeCtor('ElementItem', ElementItem);
            store.registerEntityTypeCtor('ResourcePool', ResourcePool);
            store.registerEntityTypeCtor('User', User);
            store.registerEntityTypeCtor('UserElementCell', UserElementCell);
            store.registerEntityTypeCtor('UserElementField', UserElementField);
            store.registerEntityTypeCtor('UserResourcePool', UserResourcePool);

            return manager;
        }
    }
})();
(function () {
    'use strict';

    var factoryId = 'locationHistory';
    angular.module('main')
        .factory(factoryId, ['resourcePoolFactory', '$q', 'logger', locationHistory]);

    function locationHistory(resourcePoolFactory, $q, logger) {

        // Logger
        logger = logger.forSource(factoryId);

        var self = {
            history: [new LocationItem('/')],
            historyLimit: 10
        };

        var factory = {
            createItem: createItem,
            getHistory: getHistory,
            previousItem: previousItem
        };

        // Return
        return factory;

        /*** Implementations ***/

        function createItem($location, $routeCurrent) {

            var deferred = $q.defer();

            // TODO Try to use only routeCurrent?
            var itemUrl = $location.url();
            var accessType = $routeCurrent.accessType;
            var resourcePoolId = $routeCurrent.params.resourcePoolId;
            var isEdit = $location.path().substring($location.path().lastIndexOf('/') + 1) === 'edit';

            if (typeof resourcePoolId !== 'undefined') {
                resourcePoolFactory.getResourcePool(resourcePoolId).then(createItemInternal);
            } else {
                createItemInternal();
            }

            function createItemInternal(resourcePool) {
                var item = new LocationItem(itemUrl, accessType, resourcePool, isEdit);
                self.history.push(item);

                // Only keep limited number of items
                if (self.history.length > self.historyLimit) {
                    self.history.splice(0, self.history.length - self.historyLimit);
                }

                deferred.resolve();
            }

            return deferred.promise;
        }

        function getHistory() {
            return self.history.slice();
        }

        function previousItem(excludeAccessType) {
            excludeAccessType = typeof excludeAccessType !== 'undefined' ? excludeAccessType : '';

            for (var i = self.history.length - 2; i >= 0; i--) {
                var item = self.history[i];

                if (excludeAccessType === '' || excludeAccessType !== item.accessType) {
                    return item;
                }
            }
        }

        function LocationItem(itemUrl, accessType, resourcePool, isEdit) {
            itemUrl = typeof itemUrl !== 'undefined' ? itemUrl : '';
            accessType = typeof accessType !== 'undefined' ? accessType : 'undefined';
            resourcePool = typeof resourcePool !== 'undefined' ? resourcePool : null;
            isEdit = typeof isEdit !== 'undefined' ? isEdit : false;

            var self = this;
            self.itemUrl = itemUrl;
            self.accessType = accessType;
            self.resourcePool = resourcePool;
            self.isEdit = isEdit;
            self.url = url;

            function url() {
                return self.resourcePool !== null ?
                    self.isEdit ?
                    '/_system/resourcePool/' + self.resourcePool.Id + '/edit' :
                    '/_system/resourcePool/' + self.resourcePool.Id :
                    self.itemUrl;
            }
        }
    }
})();
/***
 * Service: logger 
 *
 * Provides semantic logging services with help of
 * Angular's $log service that writes to the console and
 * John Papa's 'toastr.js': https://github.com/CodeSeven/toastr
 *
 ***/
(function () {
    'use strict';

    angular.module('main')
        .factory('logger', ['$log', logger]);

    function logger($log) {
        configureToastr();

        var factory = {
            forSource: forSource,
            log: log,
            logError: logError,
            logInfo: logInfo,
            logSuccess: logSuccess,
            logWarning: logWarning
        };

        return factory;

        function configureToastr() {
            toastr.options = {
                "positionClass": "toast-bottom-right"
            };
        }

        function forSource(src) {
            return {
                log: function (m, d, s, t, o) { return log(m, d, src, s, t, o); },
                logError: function (m, d, s, t, o) { return logError(m, d, src, s, t, o); },
                logInfo: function (m, d, s, t, o) { return logInfo(m, d, src, s, t, o); },
                logSuccess: function (m, d, s, t, o) { return logSuccess(m, d, src, s, t, o); },
                logWarning: function (m, d, s, t, o) { return logWarning(m, d, src, s, t, o); },
            };
        }

        function log(message, data, source, showToast, title, optionsOverride) {
            return logIt(message, data, source, showToast, title, optionsOverride, 'debug');
        }

        function logError(message, data, source, showToast, title, optionsOverride) {
            return logIt(message, data, source, showToast, title, optionsOverride, 'error');
        }

        function logInfo(message, data, source, showToast, title, optionsOverride) {
            return logIt(message, data, source, showToast, title, optionsOverride, 'info');
        }

        function logSuccess(message, data, source, showToast, title, optionsOverride) {
            return logIt(message, data, source, showToast, title, optionsOverride, 'success');
        }

        function logWarning(message, data, source, showToast, title, optionsOverride) {
            return logIt(message, data, source, showToast, title, optionsOverride, 'warning');
        }

        function logIt(message, data, source, showToast, title, optionsOverride, toastType) {
            showToast = typeof showToast === 'undefined' ? false : showToast;
            var currentDateTime = new Date().getHours() + ':' +
                new Date().getMinutes() + ':' +
                new Date().getSeconds();
            source = source ? '[' + source + '] ' : '';
            var write;
            switch (toastType) {
                case 'debug': write = $log.debug; break;
                case 'error': write = $log.error; break;
                case 'info': write = $log.info; break;
                case 'success': write = $log.log; break;
                case 'warning': write = $log.warn; break;
            }
            write(currentDateTime, source, message, data);
            var toast = null;
            if (showToast) {
                switch (toastType) {
                    case 'debug': toast = toastr.info(message, title, optionsOverride); break;
                    case 'error': toast = toastr.error(message, title, optionsOverride); break;
                    case 'info': toast = toastr.info(message, title, optionsOverride); break;
                    case 'success': toast = toastr.success(message, title, optionsOverride); break;
                    case 'warning': toast = toastr.warning(message, title, optionsOverride); break;
                }
            }
            return toast;
        }
    }
})();
(function () {
    'use strict';

    var factoryId = 'resourcePoolFactory';
    angular.module('main')
        .config(['$provide', extendFactory]);

    function extendFactory($provide) {
        $provide.decorator(factoryId, ['$delegate', 'ResourcePool', 'Element', 'userFactory', 'dataContext', '$rootScope', 'logger', resourcePoolFactory]);
    }

    function resourcePoolFactory($delegate, ResourcePool, Element, userFactory, dataContext, $rootScope, logger) {

        // Logger
        logger = logger.forSource(factoryId);

        var fetched = [];

        // Factory methods
        $delegate.acceptChanges = acceptChanges;
        $delegate.cancelResourcePool = cancelResourcePool;
        $delegate.copyResourcePool = copyResourcePool;
        $delegate.createElement = createElement;
        $delegate.createElementField = createElementField;
        $delegate.createElementItem = createElementItem;
        $delegate.createResourcePoolBasic = createResourcePoolBasic;
        $delegate.createResourcePoolDirectIncomeAndMultiplier = createResourcePoolDirectIncomeAndMultiplier;
        $delegate.createResourcePoolTwoElements = createResourcePoolTwoElements;
        $delegate.getResourcePoolExpanded = getResourcePoolExpanded;
        $delegate.removeElement = removeElement;
        $delegate.removeElementField = removeElementField;
        $delegate.removeElementItem = removeElementItem;
        $delegate.removeResourcePool = removeResourcePool;

        // User logged out
        $rootScope.$on('userFactory_currentUserChanged', function () {
            fetched = [];
        });

        return $delegate;

        /*** Implementations ***/

        function acceptChanges(resourcePool) {

            // Set isAdded flag to true, so before saving it to database,
            // we can replace resource pool and its child entities state back to 'isAdded'
            if (resourcePool.entityAspect.entityState.isAdded()) {
                resourcePool.isAdded(true);
            }

            // Resource pool itself
            resourcePool.entityAspect.acceptChanges();

            // If isAdded, then make it modified, so it be retrieved when getChanges() called
            if (resourcePool.isAdded()) {
                resourcePool.entityAspect.setModified();
            }

            // User resource pools
            resourcePool.UserResourcePoolSet.forEach(function (userResourcePool) {
                userResourcePool.entityAspect.acceptChanges();
            });

            // Elements
            resourcePool.ElementSet.forEach(function (element) {
                element.entityAspect.acceptChanges();

                // Fields
                element.ElementFieldSet.forEach(function (elementField) {
                    elementField.entityAspect.acceptChanges();

                    // User element fields
                    elementField.UserElementFieldSet.forEach(function (userElementField) {
                        userElementField.entityAspect.acceptChanges();
                    });
                });

                // Items
                element.ElementItemSet.forEach(function (elementItem) {
                    elementItem.entityAspect.acceptChanges();

                    // Cells
                    elementItem.ElementCellSet.forEach(function (elementCell) {
                        elementCell.entityAspect.acceptChanges();

                        // User cells
                        elementCell.UserElementCellSet.forEach(function (userElementCell) {
                            userElementCell.entityAspect.acceptChanges();
                        });
                    });
                });
            });
        }

        function cancelResourcePool(resourcePool) {

            // Resource pool itself
            resourcePool.entityAspect.rejectChanges();

            // User resource pools
            resourcePool.UserResourcePoolSet.forEach(function (userResourcePool) {
                userResourcePool.entityAspect.rejectChanges();
            });

            // Elements
            resourcePool.ElementSet.forEach(function (element) {
                element.entityAspect.rejectChanges();

                // Fields
                element.ElementFieldSet.forEach(function (elementField) {
                    elementField.entityAspect.rejectChanges();

                    // User element fields
                    elementField.UserElementFieldSet.forEach(function (userElementField) {
                        userElementField.entityAspect.rejectChanges();
                    });
                });

                // Items
                element.ElementItemSet.forEach(function (elementItem) {
                    elementItem.entityAspect.rejectChanges();

                    // Cells
                    elementItem.ElementCellSet.forEach(function (elementCell) {
                        elementCell.entityAspect.rejectChanges();

                        // User cells
                        elementCell.UserElementCellSet.forEach(function (userElementCell) {
                            userElementCell.entityAspect.rejectChanges();
                        });
                    });
                });
            });
        }

        function copyResourcePool(resourcePoolSource) {
            // TODO
        }

        function createElement(element) {
            return dataContext.createEntity('Element', element);
        }

        function createElementCell(elementCellInitial) {

            var elementCell = dataContext.createEntity('ElementCell', elementCellInitial);

            // User element cell
            if (elementCell.ElementField.DataType !== 6) {

                var userElementCell = {
                    User: elementCell.ElementField.Element.ResourcePool.User,
                    ElementCell: elementCell
                };

                switch (elementCell.ElementField.DataType) {
                    case 1: { userElementCell.StringValue = ''; break; }
                    case 2: { userElementCell.BooleanValue = false; break; }
                    case 3: { userElementCell.IntegerValue = 0; break; }
                    case 4: { userElementCell.DecimalValue = 50; break; }
                        // TODO 5 (DateTime?)
                    case 11: { userElementCell.DecimalValue = 100; break; }
                    case 12: { userElementCell.DecimalValue = 0; break; }
                }

                dataContext.createEntity('UserElementCell', userElementCell);
            }

            return elementCell;
        }

        function createElementField(elementField) {

            elementField = dataContext.createEntity('ElementField', elementField);

            // Related cells
            elementField.Element.ElementItemSet.forEach(function (elementItem) {
                createElementCell({
                    ElementField: elementField,
                    ElementItem: elementItem
                });
            });

            return elementField;
        }

        function createElementItem(elementItem) {

            elementItem = dataContext.createEntity('ElementItem', elementItem);

            // Related cells
            elementItem.Element.ElementFieldSet.forEach(function (elementField) {
                createElementCell({
                    ElementField: elementField,
                    ElementItem: elementItem
                });
            });

            return elementItem;
        }

        function createResourcePoolBasic(initializeResourcePool) {
            initializeResourcePool = typeof initializeResourcePool !== 'undefined' ? initializeResourcePool : false;

            return userFactory.getCurrentUser()
                .then(function (currentUser) {

                    var resourcePoolRate = 10;

                    var resourcePool = dataContext.createEntity('ResourcePool', {
                        User: currentUser,
                        Name: 'New CMRP',
                        InitialValue: 100,
                        UseFixedResourcePoolRate: true
                    });

                    dataContext.createEntity('UserResourcePool', {
                        User: currentUser,
                        ResourcePool: resourcePool,
                        ResourcePoolRate: resourcePoolRate
                    });

                    var element = createElement({
                        ResourcePool: resourcePool,
                        Name: 'New element'
                    });
                    element.IsMainElement = true;

                    // Importance field (index)
                    var importanceField = createElementField({
                        Element: element,
                        Name: 'Importance',
                        DataType: 4,
                        UseFixedValue: false,
                        IndexEnabled: true,
                        IndexCalculationType: 2,
                        IndexSortType: 1,
                        SortOrder: 1
                    });

                    // Item 1
                    var item1 = createElementItem({
                        Element: element,
                        Name: 'New item 1'
                    });

                    // Item 2
                    var item2 = createElementItem({
                        Element: element,
                        Name: 'New item 2'
                    });

                    // Initialize
                    if (initializeResourcePool) {
                        resourcePool._init(true);
                    }

                    return resourcePool;
                });
        }

        function createResourcePoolDirectIncomeAndMultiplier(initializeResourcePool) {
            initializeResourcePool = typeof initializeResourcePool !== 'undefined' ? initializeResourcePool : false;

            return createResourcePoolBasic()
                .then(function (resourcePool) {

                    // Convert Importance field to Sales Price field
                    var salesPriceField = resourcePool.mainElement().ElementFieldSet[0];
                    salesPriceField.Name = 'Sales Price';
                    salesPriceField.DataType = 11;
                    salesPriceField.UseFixedValue = true;
                    salesPriceField.IndexEnabled = false;
                    salesPriceField.IndexCalculationType = 0;
                    salesPriceField.IndexSortType = 0;

                    // Update Sales Price field cells
                    var cell1 = salesPriceField.ElementCellSet[0];
                    var cell2 = salesPriceField.ElementCellSet[1];

                    // Number of Sales field
                    var numberOfSalesField = createElementField({
                        Element: resourcePool.mainElement(),
                        Name: 'Number of Sales',
                        DataType: 12,
                        UseFixedValue: false,
                        SortOrder: 2
                    });

                    if (initializeResourcePool) {
                        resourcePool._init(true);
                    }

                    return resourcePool;
                });
        }

        function createResourcePoolTwoElements(initializeResourcePool) {
            initializeResourcePool = typeof initializeResourcePool !== 'undefined' ? initializeResourcePool : false;

            return createResourcePoolBasic()
                .then(function (resourcePool) {

                    // Element 2 & items
                    var element2 = resourcePool.ElementSet[0];
                    element2.Name = 'Child';

                    var element2Item1 = element2.ElementItemSet[0];
                    var element2Item2 = element2.ElementItemSet[1];

                    // Element 1
                    var element1 = createElement({
                        ResourcePool: resourcePool,
                        Name: 'Parent'
                    });
                    element1.IsMainElement = true;

                    // Child field (second element)
                    var childField = createElementField({
                        Element: element1,
                        Name: 'Child',
                        DataType: 6,
                        SelectedElement: element2,
                        UseFixedValue: true,
                        SortOrder: 1
                    });

                    // Item 1
                    var item1 = createElementItem({
                        Element: element1,
                        Name: 'Parent 1'
                    });

                    // Item 1 Cell
                    item1.ElementCellSet[0].SelectedElementItem = element2Item1;

                    // Item 2
                    var item2 = createElementItem({
                        Element: element1,
                        Name: 'Parent 2'
                    });

                    // Item 2 Cell
                    item2.ElementCellSet[0].SelectedElementItem = element2Item2;

                    if (initializeResourcePool) {
                        resourcePool._init(true);
                    }

                    return resourcePool;
                });
        }

        function getResourcePoolExpanded(resourcePoolId) {
            // TODO Other validations?
            resourcePoolId = Number(resourcePoolId);

            return userFactory.getCurrentUser()
                .then(function (currentUser) {

                    // Prepare the query
                    var query = null;
                    var isNewResourcePool = resourcePoolId <= 0; // Determines whether this is just created by this user, or an existing resource pool
                    var fetchedEarlier = false;
                    var fromServer = false;

                    // If it's not newly created, check the fetched list
                    if (!isNewResourcePool) {
                        fetchedEarlier = fetched.some(function (fetchedId) {
                            return resourcePoolId === fetchedId;
                        });
                    }

                    fromServer = !isNewResourcePool && !fetchedEarlier;

                    // Is authorized? No, then get only the public data, yes, then get include user's own records
                    if (currentUser.isAuthenticated() || isNewResourcePool) {
                        query = breeze.EntityQuery
                            .from('ResourcePool')
                            .expand('UserResourcePoolSet, ElementSet.ElementFieldSet.UserElementFieldSet, ElementSet.ElementItemSet.ElementCellSet.UserElementCellSet')
                            .where('Id', 'eq', resourcePoolId);
                    } else {
                        query = breeze.EntityQuery
                            .from('ResourcePool')
                            .expand('ElementSet.ElementFieldSet, ElementSet.ElementItemSet.ElementCellSet')
                            .where('Id', 'eq', resourcePoolId);
                    }

                    // From server or local?
                    if (fromServer) {
                        query = query.using(breeze.FetchStrategy.FromServer);
                    }
                    else {
                        query = query.using(breeze.FetchStrategy.FromLocalCache);
                    }

                    return dataContext.executeQuery(query)
                        .then(success)
                        .catch(failed);

                    function success(response) {

                        // If there is no cmrp with this Id, return null
                        if (response.results.length === 0) {
                            return null;
                        }

                        // ResourcePool
                        var resourcePool = response.results[0];

                        // Init
                        if (fromServer) {
                            resourcePool._init();
                        }

                        // Add the record into fetched list
                        fetched.push(resourcePool.Id);

                        return resourcePool;
                    }

                    function failed(error) {
                        var message = error.message || 'ResourcePool query failed';
                        logger.logError(message, error, true);
                    }
                });
        }

        function removeElement(element) {

            // Remove from selectedElement
            if (element.ResourcePool.selectedElement() === element) {
                element.ResourcePool.selectedElement(null);
            }

            // Related items
            var elementItemSet = element.ElementItemSet.slice();
            elementItemSet.forEach(function (elementItem) {
                removeElementItem(elementItem);
            });

            // Related fields
            var elementFieldSet = element.ElementFieldSet.slice();
            elementFieldSet.forEach(function (elementField) {
                removeElementField(elementField);
            });

            element.entityAspect.setDeleted();
        }

        function removeElementCell(elementCell) {

            // Related user cells
            var userElementCellSet = elementCell.UserElementCellSet.slice();
            userElementCellSet.forEach(function (userElementCell) {
                userElementCell.entityAspect.setDeleted();
            });

            elementCell.entityAspect.setDeleted();
        }

        function removeElementField(elementField) {

            // Related cells
            var elementCellSet = elementField.ElementCellSet.slice();
            elementCellSet.forEach(function (elementCell) {
                removeElementCell(elementCell);
            });

            // Related user element fields
            var userElementFieldSet = elementField.UserElementFieldSet.slice();
            userElementFieldSet.forEach(function (userElementField) {
                userElementField.entityAspect.setDeleted();
            });

            elementField.entityAspect.setDeleted();
        }

        function removeElementItem(elementItem) {

            // Related cells
            var elementCellSet = elementItem.ElementCellSet.slice();
            elementCellSet.forEach(function (elementCell) {
                removeElementCell(elementCell);
            });

            elementItem.entityAspect.setDeleted();
        }

        function removeResourcePool(resourcePool) {

            // Related elements
            var elementSet = resourcePool.ElementSet.slice();
            elementSet.forEach(function (element) {
                removeElement(element);
            });

            // Related user resource pools
            var userResourcePoolSet = resourcePool.UserResourcePoolSet.slice();
            userResourcePoolSet.forEach(function (userResourcePool) {
                userResourcePool.entityAspect.setDeleted();
            });

            resourcePool.entityAspect.setDeleted();
        }
    }
})();

(function () {
    'use strict';

    var factoryId = 'userFactory';
    angular.module('main')
        .config(['$provide', extendFactory]);

    function extendFactory($provide) {
        $provide.decorator(factoryId, ['$delegate', 'dataContext', '$http', '$q', '$rootScope', '$window', '$location', 'serviceAppUrl', 'logger', userFactory]);
    }

    function userFactory($delegate, dataContext, $http, $q, $rootScope, $window, $location, serviceAppUrl, logger) {
        logger = logger.forSource(factoryId);

        // Service urls
        var addPasswordUrl = serviceAppUrl + '/api/Account/AddPassword';
        var changeEmailUrl = serviceAppUrl + '/api/Account/ChangeEmail';
        var changePasswordUrl = serviceAppUrl + '/api/Account/ChangePassword';
        var confirmEmailUrl = serviceAppUrl + '/api/Account/ConfirmEmail';
        var currentUser = null;
        var getCurrentUserPromise = null;
        var registerUrl = serviceAppUrl + '/api/Account/Register';
        var resendConfirmationEmailUrl = serviceAppUrl + '/api/Account/ResendConfirmationEmail';
        var resetPasswordUrl = serviceAppUrl + '/api/Account/ResetPassword';
        var resetPasswordRequestUrl = serviceAppUrl + '/api/Account/ResetPasswordRequest';
        var tokenUrl = serviceAppUrl + '/api/Token';

        // Service methods
        $delegate.addPassword = addPassword;
        $delegate.changeEmail = changeEmail;
        $delegate.changePassword = changePassword;
        $delegate.confirmEmail = confirmEmail;
        $delegate.getCurrentUser = getCurrentUser;
        $delegate.getToken = getToken;
        $delegate.logout = logout;
        $delegate.register = register;
        $delegate.resendConfirmationEmail = resendConfirmationEmail;
        $delegate.resetPassword = resetPassword;
        $delegate.resetPasswordRequest = resetPasswordRequest;

        $delegate.updateElementMultiplier = updateElementMultiplier;
        $delegate.updateElementCellMultiplier = updateElementCellMultiplier;
        $delegate.updateElementCellNumericValue = updateElementCellNumericValue;
        $delegate.updateElementFieldIndexRating = updateElementFieldIndexRating;
        $delegate.updateResourcePoolRate = updateResourcePoolRate;

        _init();

        function _init() {
            getCurrentUser()
                .then(function () {
                    broadcastUserChanged();
                });
        }

        return $delegate;

        /*** Implementations ***/

        function addPassword(addPasswordBindingModel) {
            return $http.post(addPasswordUrl, addPasswordBindingModel)
                .success(function (updatedUser) {

                    // Remove 'HasNoPassword' claim
                    var claimIndex = null;
                    for (var i = 0; i < currentUser.Claims.length; i++) {
                        if (currentUser.Claims[i].ClaimType === 'HasNoPassword') {
                            claimIndex = i;
                            break;
                        }
                    }

                    if (claimIndex === null) {
                        // TODO throw error?
                    }

                    var claims = currentUser.Claims.splice(claimIndex, 1);
                    claims[0].entityAspect.setDetached();

                    // Sync RowVersion fields
                    syncRowVersion(currentUser, updatedUser);
                })
                .error(handleErrorResult);
        }

        function changeEmail(changeEmailBindingModel) {
            return $http.post(changeEmailUrl, changeEmailBindingModel)
                .success(function (updatedUser) {

                    currentUser.Email = updatedUser.Email;
                    currentUser.EmailConfirmed = false;

                    // Sync RowVersion fields
                    syncRowVersion(currentUser, updatedUser);
                })
                .error(handleErrorResult);
        }

        function changePassword(changePasswordBindingModel) {
            return $http.post(changePasswordUrl, changePasswordBindingModel)
                .success(function (updatedUser) {
                    // Sync RowVersion fields
                    syncRowVersion(currentUser, updatedUser);
                })
                .error(handleErrorResult);
        }

        function confirmEmail(confirmEmailBindingModel) {
            return $http.post(confirmEmailUrl, confirmEmailBindingModel)
                .success(function (updatedUser) {

                    currentUser.EmailConfirmed = true;

                    // Sync RowVersion fields
                    syncRowVersion(currentUser, updatedUser);
                })
                .error(handleErrorResult);
        }

        function getToken(email, password, rememberMe, tempToken, isRegister) {
            isRegister = typeof isRegister === 'undefined' ? false : isRegister;

            var deferred = $q.defer();

            var tokenData = 'grant_type=password' +
                '&username=' + email +
                '&password=' + password +
                '&rememberMe=' + rememberMe +
                '&tempToken=' + (typeof tempToken !== 'undefined' ? tempToken : '');

            $http.post(tokenUrl, tokenData, { 'Content-Type': 'application/x-www-form-urlencoded' })
                .success(function (token) {

                    // Set token to the session
                    $window.localStorage.setItem('token', angular.toJson(token));

                    // Set currentUser as the old one.
                    // In case if this is coming from login page, anonymous changes will be merged/copied into logged in user
                    var oldUser = currentUser;

                    getCurrentUser(!isRegister)
                        .then(function () {

                            if (isRegister) {

                                // Raise logged in event
                                broadcastUserChanged();

                                // Update anonymous entities
                                currentUser.ResourcePoolSet.forEach(function (resourcePool) {
                                    resourcePool.updateAnonymousEntities();
                                });

                                // Save the changes that's been done before the registration
                                dataContext.saveChanges()
                                    .then(function () {
                                        deferred.resolve();
                                    });
                            } else {

                                // Raise logged in event
                                broadcastUserChanged();

                                // Move anonymously created entities to this logged in user
                                dataContext.updateAnonymousChanges(oldUser, currentUser)
                                    .then(function () {

                                        // Update anonymous entities
                                        currentUser.ResourcePoolSet.forEach(function (resourcePool) {
                                            resourcePool.updateAnonymousEntities();
                                        });

                                        // Save changes
                                        dataContext.saveChanges()
                                            .then(function () {
                                                deferred.resolve();
                                            });
                                    });
                            }
                        });
                })
                .error(function (data, status, headers, config) {
                    handleErrorResult(data, status, headers, config);
                    deferred.reject(data);
                });

            return deferred.promise;
        }

        // Returns either anonymous (not authenticated) or logged in user
        function getCurrentUser(resetPromise) {
            resetPromise = typeof resetPromise !== 'undefined' ? resetPromise : false;

            if (getCurrentUserPromise === null || resetPromise) {

                var deferred = $q.defer();
                getCurrentUserPromise = deferred.promise;

                if (localStorage.getItem('token') === null) {

                    dataContext.metadataReady()
                        .then(function () {
                            var user = dataContext.createEntity('User', { isEditing: false });
                            currentUser = user;
                            deferred.resolve(user);
                        })
                        .catch(function () {
                            // TODO Handle?
                        });

                } else {
                    var query = breeze.EntityQuery
                        .from('Users')
                        .expand('Claims')
                        .using(breeze.FetchStrategy.FromServer);

                    dataContext.executeQuery(query)
                        .then(success)
                        .catch(failed);
                }
            }

            return getCurrentUserPromise;

            function success(response) {

                // If the response has an entity, use that, otherwise create an anonymous user
                var user = response.results.length > 0 ?
                    response.results[0] :
                    dataContext.createEntity('User', { isEditing: false });

                currentUser = user;
                deferred.resolve(user);
            }

            function failed(error) {
                var message = error.message || 'User query failed';
                // TODO Handle this case better!
                deferred.reject(message);
                throw new Error(message);
            }
        }

        function getUserElementCell(user, elementCell) {

            var userCell = elementCell.currentUserCell();

            if (userCell === null) {

                // Since there is a delay between client-side changes and actual save operation (editor.js - saveChanges(1500)), these entities might be deleted but not yet saved. 
                // To prevent having the exception of creating an entity with the same keys twice, search 'deleted' ones and restore it back to life! / SH - 02 Dec. '15
                var deletedUserCells = dataContext.getEntities(['UserElementCell'], [breeze.EntityState.Deleted]);
                var userCells = deletedUserCells.filter(function (deletedUserCell) {
                    return deletedUserCell.UserId === user.Id && deletedUserCell.ElementCellId === elementCell.Id;
                });

                if (userCells.length > 0) {
                    userCell = userCells[0];
                    userCell.entityAspect.rejectChanges();
                    userCell.DecimalValue = elementCell.ElementField.DataType === 12 ? 0 : 50; // TODO ?
                }
            }

            return userCell;
        }

        function getUserElementField(user, elementField) {

            var userField = elementField.currentUserElementField();

            if (userField === null) {

                // Since there is a delay between client-side changes and actual save operation (editor.js - saveChanges(1500)), these entities might be deleted but not yet saved. 
                // To prevent having the exception of creating an entity with the same keys twice, search 'deleted' ones and restore it back to life! / SH - 02 Dec. '15
                var deletedUserFields = dataContext.getEntities(['UserElementField'], [breeze.EntityState.Deleted]);
                var userFields = deletedUserFields.filter(function (deletedUserField) {
                    return deletedUserField.UserId === user.Id && deletedUserField.ElementFieldId === elementField.Id;
                });

                if (userFields.length > 0) {
                    userField = userFields[0];
                    userField.entityAspect.rejectChanges();
                    userField.Rating = 50;
                }
            }

            return userField;
        }

        function getUserResourcePool(user, resourcePool) {

            var userResourcePool = resourcePool.currentUserResourcePool();

            if (userResourcePool === null) {

                // Since there is a delay between client-side changes and actual save operation (editor.js - saveChanges(1500)), these entities might be deleted but not yet saved. 
                // To prevent having the exception of creating an entity with the same keys twice, search 'deleted' ones and restore it back to life! / SH - 02 Dec. '15
                var deletedUserResourcePools = dataContext.getEntities(['UserResourcePool'], [breeze.EntityState.Deleted]);
                var userResourcePools = deletedUserResourcePools.filter(function (deletedUserResourcePool) {
                    return deletedUserResourcePool.UserId === user.Id && deletedUserResourcePool.ResourcePoolId === resourcePool.Id;
                });

                if (userResourcePools.length > 0) {
                    userResourcePool = userResourcePools[0];
                    userResourcePool.entityAspect.rejectChanges();
                    userResourcePool.ResourcePoolRate = 10;
                }
            }

            return userResourcePool;
        }

        function handleErrorResult(data, status, headers, config) {

            // TODO Can this be done on a higher level?
            var message = '';

            if (typeof data.ModelState !== 'undefined') {
                for (var key in data.ModelState) {
                    var array = data.ModelState[key];
                    array.forEach(addErrorMessage);
                }
            }

            function addErrorMessage(error) {
                message += error + '<br />';
            }

            if (message === '' && typeof data.Message !== 'undefined') {
                message = data.Message;
            }

            if (message === '' && typeof data.error_description !== 'undefined') {
                message = data.error_description;
            }

            logger.logError(message, null, true);
        }

        function logout() {

            // Remove token from the session
            $window.localStorage.removeItem('token');

            // Clear breeze's metadata store
            dataContext.clear();

            // Raise logged out event
            return getCurrentUser(true)
                .then(function () {
                    broadcastUserChanged();
                });
        }

        function broadcastUserChanged() {
            $rootScope.$broadcast('userFactory_currentUserChanged', currentUser);
        }

        function register(registerBindingModel) {
            return $http.post(registerUrl, registerBindingModel)
                .success(function (newUser) {

                    // breeze context user entity fix-up!
                    // TODO Try to make this part better, use OData method?
                    currentUser.Id = newUser.Id;
                    currentUser.Email = newUser.Email;
                    currentUser.UserName = newUser.UserName;
                    currentUser.RowVersion = newUser.RowVersion;
                    currentUser.entityAspect.acceptChanges();

                    return getToken(registerBindingModel.email, registerBindingModel.password, false, true);
                })
                .error(handleErrorResult);
        }

        function resendConfirmationEmail() {
            return $http.post(resendConfirmationEmailUrl).error(handleErrorResult);
        }

        function resetPassword(resetPasswordBindingModel) {
            return $http.post(resetPasswordUrl, resetPasswordBindingModel)
                .success(function (updatedUser) {
                    // Sync RowVersion fields
                    syncRowVersion(currentUser, updatedUser);
                })
                .error(handleErrorResult);
        }

        function resetPasswordRequest(resetPasswordRequestBindingModel) {
            return $http.post(resetPasswordRequestUrl, resetPasswordRequestBindingModel).error(handleErrorResult);
        }

        // When an entity gets updated through angular, unlike breeze updates, it doesn't sync RowVersion automatically
        // After each update, call this function to sync the entities RowVersion with the server's. Otherwise it'll get Conflict error
        // SH - 05 Jan. '16
        function syncRowVersion(oldEntity, newEntity) {
            // TODO Validations?
            oldEntity.RowVersion = newEntity.RowVersion;
        }

        // These 'updateX' functions were defined in their related entities (user.js).
        // Only because they had to use createEntity() on dataContext, it was moved to this service.
        // Try do handle them in a better way, maybe by using broadcast?

        function updateElementMultiplier(element, updateType) {

            // Find user element cell
            element.ElementItemSet.forEach(function (item) {

                var multiplierCell;
                for (var cellIndex = 0; cellIndex < item.ElementCellSet.length; cellIndex++) {
                    var elementCell = item.ElementCellSet[cellIndex];
                    if (elementCell.ElementField.DataType === 12) {
                        multiplierCell = elementCell;
                        break;
                    }
                }

                updateElementCellMultiplierInternal(multiplierCell, updateType);
            });

            // Update related

            // Update items
            element.ElementItemSet.forEach(function (item) {
                item.setMultiplier();
            });

            element.ElementFieldSet.forEach(function (field) {

                if (field.IndexEnabled) {
                    // Update numeric value cells
                    field.ElementCellSet.forEach(function (cell) {
                        cell.setNumericValueMultiplied(false);
                    });

                    // Update fields
                    field.setNumericValueMultiplied();
                }
            });
        }

        function updateElementCellMultiplier(elementCell, updateType) {

            updateElementCellMultiplierInternal(elementCell, updateType);

            // Update items
            elementCell.ElementField.Element.ElementItemSet.forEach(function (item) {
                item.setMultiplier();
            });

            if (elementCell.ElementField.IndexEnabled) {
                // Update numeric value cells
                elementCell.ElementField.ElementCellSet.forEach(function (cell) {
                    cell.setNumericValueMultiplied(false);
                });

                // Update fields
                elementCell.ElementField.setNumericValueMultiplied();
            }
        }

        function updateElementCellMultiplierInternal(elementCell, updateType) {

            var userCell = getUserElementCell(currentUser, elementCell);

            switch (updateType) {
                case 'increase':
                case 'decrease': {

                    if (userCell === null) { // If there is no item, create it

                        userCell = dataContext.createEntity('UserElementCell', {
                            User: currentUser,
                            ElementCell: elementCell,
                            DecimalValue: updateType === 'increase' ? 1 : 0,
                            isEditing: false
                        });

                    } else { // If there is an item, update DecimalValue, but cannot be lower than zero

                        userCell.DecimalValue = updateType === 'increase' ?
                            userCell.DecimalValue + 1 :
                            userCell.DecimalValue - 1 < 0 ? 0 : userCell.DecimalValue - 1;
                    }

                    break;
                }
                case 'reset': {

                    if (userCell !== null) { // If there is an item, delete it
                        userCell.entityAspect.setDeleted();
                    }

                    break;
                }
            }
        }

        function updateElementCellNumericValue(elementCell, updateType) {

            var userCell = getUserElementCell(currentUser, elementCell);

            switch (updateType) {
                case 'increase':
                case 'decrease': {

                    if (userCell === null) { // If there is no item, create it

                        dataContext.createEntity('UserElementCell', {
                            User: currentUser,
                            ElementCell: elementCell,
                            DecimalValue: updateType === 'increase' ? 55 : 45,
                            isEditing: false
                        });

                    } else { // If there is an item, update DecimalValue, but cannot be smaller than zero and cannot be bigger than 100

                        userCell.DecimalValue = updateType === 'increase' ?
                            userCell.DecimalValue + 5 > 100 ? 100 : userCell.DecimalValue + 5 :
                            userCell.DecimalValue - 5 < 0 ? 0 : userCell.DecimalValue - 5;
                    }

                    // Update the cached value
                    elementCell.setCurrentUserNumericValue();

                    break;
                }
                case 'reset': {

                    if (userCell !== null) { // If there is an item, delete it
                        userCell.entityAspect.setDeleted();

                        // Update the cached value
                        elementCell.setCurrentUserNumericValue();
                    }

                    break;
                }
            }
        }

        function updateElementFieldIndexRating(elementField, updateType) {

            var userElementField = getUserElementField(currentUser, elementField);

            switch (updateType) {
                case 'increase':
                case 'decrease': {

                    // If there is no item, create it
                    if (userElementField === null) {
                        userElementField = {
                            User: currentUser,
                            ElementField: elementField,
                            Rating: updateType === 'increase' ? 55 : 45,
                            isEditing: false
                        };

                        dataContext.createEntity('UserElementField', userElementField);

                    } else { // If there is an item, update Rating, but cannot be smaller than zero and cannot be bigger than 100

                        userElementField.Rating = updateType === 'increase' ?
                            userElementField.Rating + 5 > 100 ? 100 : userElementField.Rating + 5 :
                            userElementField.Rating - 5 < 0 ? 0 : userElementField.Rating - 5;
                    }

                    // Update the cached value
                    elementField.setCurrentUserIndexRating();

                    break;
                }
                case 'reset': {

                    // If there is an item, delete it
                    if (userElementField !== null) {
                        userElementField.entityAspect.setDeleted();

                        // Update the cached value
                        elementField.setCurrentUserIndexRating();
                    }

                    break;
                }
            }
        }

        function updateResourcePoolRate(resourcePool, updateType) {

            var userResourcePool = getUserResourcePool(currentUser, resourcePool);

            switch (updateType) {
                case 'increase':
                case 'decrease': {

                    // If there is no item, create it
                    if (userResourcePool === null) {
                        userResourcePool = {
                            User: currentUser,
                            ResourcePool: resourcePool,
                            ResourcePoolRate: updateType === 'increase' ? 15 : 5,
                            isEditing: false
                        };

                        dataContext.createEntity('UserResourcePool', userResourcePool);

                    } else { // If there is an item, update Rating, but cannot be smaller than zero and cannot be bigger than 1000

                        userResourcePool.ResourcePoolRate = updateType === 'increase' ?
                            userResourcePool.ResourcePoolRate + 5 > 1000 ? 1000 : userResourcePool.ResourcePoolRate + 5 :
                            userResourcePool.ResourcePoolRate - 5 < 0 ? 0 : userResourcePool.ResourcePoolRate - 5;
                    }

                    // Update the cached value
                    resourcePool.setCurrentUserResourcePoolRate();

                    break;
                }
                case 'reset': {

                    // If there is an item, delete it
                    if (userResourcePool !== null) {
                        userResourcePool.entityAspect.setDeleted();

                        // Update the cached value
                        resourcePool.setCurrentUserResourcePoolRate();
                    }

                    break;
                }
            }
        }
    }
})();

/***
 * Filter: enum
 *
 * Converts the enum value to its key by searching through tables in Enums.js
 *
 ***/
(function () {
    'use strict';

    angular.module('main')
        .filter('enum', ['Enums', 'logger', function (Enums, logger) {

            return function (input, enumTableKey) {

                if (typeof input === 'undefined' || typeof enumTableKey === 'undefined' || enumTableKey === '') {
                    return null;
                }

                return Enums.getEnumKey(enumTableKey, input);
            };
        }]);

})();

/***
 * Filter: numberSymbol
 *
 * Convert the number to a short format with symbol format.
 *
 ***/
(function () {
    'use strict';

    angular.module('main')
        .filter('numberSymbol', ['$filter', 'logger', function ($filter, logger) {
            return function (input, decimals) {

                if (typeof input === 'undefined')
                    return null;

                decimals = typeof decimals === 'undefined' ? 0 : decimals;

                var number = Number(input);
                number = decimals > 0 ? number.toFixed(decimals) : number;
                var symbol = '';

                if (number / Math.pow(10, 12) >= 1) { // Trillion
                    number = number / Math.pow(10, 12);
                    symbol = 'T';
                } else if (number / Math.pow(10, 9) >= 1) { // Billion
                    number = number / Math.pow(10, 9);
                    symbol = 'B';
                } else if (number / Math.pow(10, 6) >= 1) { // Million
                    number = number / Math.pow(10, 6);
                    symbol = 'M';
                } else if (number / Math.pow(10, 3) >= 1) { // Thousand
                    number = number / Math.pow(10, 3);
                    symbol = 'K';
                } else {
                    number = number;
                }

                return $filter('number')(number, decimals) + symbol;
            };
        }]);

})();

/***
 * Filter: percentage
 *
 * Convert the number to a percentage format.
 *
 ***/
(function () {
    'use strict';

    angular.module('main')
        .filter('percentage', ['$filter', function ($filter) {
            return function (input, decimals) {
                // TODO Whether Percentage symbol should be in front or behind of the value differs based on cultural settings
                return $filter('number')(input * 100, decimals) + '%';
            };
        }]);
})();

(function () {
    'use strict';

    var controllerId = 'AccountEditController';
    angular.module('main')
        .controller(controllerId, ['userFactory', 'logger', AccountEditController]);

    function AccountEditController(userFactory, logger) {
        logger = logger.forSource(controllerId);

        var isSaving = false;

        // Controller methods (alphabetically)
        var vm = this;
        vm.cancelChanges = cancelChanges;
        vm.isSaveDisabled = isSaveDisabled;
        vm.user = null;
        vm.saveChanges = saveChanges;

        // Get current user
        userFactory.getCurrentUser()
            .then(function (currentUser) {
                vm.user = currentUser;
                vm.user.isEditing = true;
            });

        /*** Implementations ***/

        function cancelChanges() {
            // TODO
        }

        function isSaveDisabled() {
            //return isSaving || (!userFactory.hasChanges());
            return isSaving;
        }

        function saveChanges() {

            isSaving = true;
            vm.user.isEditing = false;
            userFactory.saveChanges()
                .then(function (result) {
                    logger.logSuccess('Your changes have been saved!', null, true);
                })
                .catch(function (error) {

                    // Conflict (Concurrency exception)
                    if (error.status === '409') {
                        // TODO Try to recover!
                    }
                })
                .finally(function () {
                    isSaving = false;
                });
        }
    }
})();

(function () {
    'use strict';

    var controllerId = 'AddPasswordController';
    angular.module('main')
        .controller(controllerId, ['userFactory', '$location', 'logger', AddPasswordController]);

    function AddPasswordController(userFactory, $location, logger) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.addPassword = addPassword;

        function addPassword() {
            userFactory.addPassword(vm)
                .success(function () {
                    $location.url('/');
                    logger.logSuccess('Your password has been set!', null, true);
                });
        }
    }
})();

(function () {
    'use strict';

    var controllerId = 'ChangeEmailController';
    angular.module('main')
        .controller(controllerId, ['userFactory', '$location', 'logger', ChangeEmailController]);

    function ChangeEmailController(userFactory, $location, logger) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.isChangeEmailDisabled = false;
        vm.changeEmail = changeEmail;

        _init();

        function _init() {

            // Generate test data if localhost
            if ($location.host() === 'localhost') {
                var now = new Date();
                var year = now.getFullYear();
                var month = now.getMonth() + 1;
                var day = now.getDate();
                var hour = now.getHours();
                var minute = now.getMinutes();
                var second = now.getSeconds();
                var email = 'local_' + year + month + day + '_' + hour + minute + second + '@forcrowd.org';

                vm.email = email;
            }
        }

        function changeEmail() {

            vm.isChangeEmailDisabled = true;

            userFactory.changeEmail(vm)
                .success(function () {
                    $location.url('/_system/account/confirmEmail');
                })
                .finally(function () {
                    vm.isChangeEmailDisabled = false;
                });
        }
    }
})();

(function () {
    'use strict';

    var controllerId = 'ChangePasswordController';
    angular.module('main')
        .controller(controllerId, ['userFactory', '$location', 'logger', ChangePasswordController]);

    function ChangePasswordController(userFactory, $location, logger) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.changePassword = changePassword;

        function changePassword() {
            userFactory.changePassword(vm)
                .success(function () {
                    $location.url('/');
                    logger.logSuccess('Your password has been changed!', null, true);
                });
        }
    }
})();

(function () {
    'use strict';

    var controllerId = 'ConfirmEmailController';
    angular.module('main')
        .controller(controllerId, ['userFactory', '$rootScope', '$location', 'logger', ConfirmEmailController]);

    function ConfirmEmailController(userFactory, $rootScope, $location, logger) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.currentUser = { EmailConfirmed: false, isAuthenticated: function () { return false; } };
        vm.isResendDisabled = false;
        vm.resendConfirmationEmail = resendConfirmationEmail;

        _init();

        /*** Implementations ***/

        function _init() {

            userFactory.getCurrentUser()
                .then(function (currentUser) {

                    vm.currentUser = currentUser;

                    if (!vm.currentUser.isAuthenticated()) {
                        return;
                    }

                    // If there is no token, no need to continue
                    var token = $location.search().token;
                    if (typeof token === 'undefined') {
                        return;
                    }

                    userFactory.confirmEmail({ Token: token });
                });
        }

        function resendConfirmationEmail() {

            vm.isResendDisabled = true;

            userFactory.resendConfirmationEmail()
                .then(function () {
                    logger.logSuccess('Confirmation email has been resent to your email address!', null, true);
                })
                .finally(function () {
                    vm.isResendDisabled = false;
                });
        }
    }
})();

(function () {
    'use strict';

    var controllerId = 'LoginController';
    angular.module('main')
        .controller(controllerId, ['userFactory', '$location', 'locationHistory', 'serviceAppUrl', 'logger', LoginController]);

    function LoginController(userFactory, $location, locationHistory, serviceAppUrl, logger) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.email = '';
        vm.login = login;
        vm.getExternalLoginUrl = getExternalLoginUrl;
        vm.password = '';
        vm.rememberMe = false;

        _init();

        function _init() {

            // Error
            var error = $location.search().error;
            if (typeof error !== 'undefined') {
                logger.logError(error, null, true);
                return;
            }

            login();
        }

        function login() {

            // External (temp token) login
            var tempToken = $location.search().tempToken;
            if (typeof tempToken !== 'undefined') {
                userFactory.getToken('', '', vm.rememberMe, tempToken).then(success).catch(failedExternal);
            } else { // Internal login
                if (vm.email !== '' && vm.password !== '') {
                    userFactory.getToken(vm.email, vm.password, vm.rememberMe).then(success);
                }
            }

            function success() {
                logger.logSuccess('You have been logged in!', null, true);
                $location.url(getReturnUrl());
            }

            function failedExternal() {
                logger.logError('Invalid token', null, true);
            }
        }

        function getExternalLoginUrl(provider) {
            return serviceAppUrl + '/api/Account/ExternalLogin?provider=' + provider + '&clientReturnUrl=' + getReturnUrl();
        }

        function getReturnUrl() {
            // If login pages called after a result from server, it will have "clientReturnUrl" param, which will have a higher priority than locationHistory
            var clientReturnUrl = $location.search().clientReturnUrl;
            return typeof clientReturnUrl !== 'undefined' ? clientReturnUrl : locationHistory.previousItem().url();
        }
    }
})();

(function () {
    'use strict';

    var controllerId = 'RegisterController';
    angular.module('main')
        .controller(controllerId, ['userFactory', '$location', 'locationHistory', 'serviceAppUrl', 'logger', RegisterController]);

    function RegisterController(userFactory, $location, locationHistory, serviceAppUrl, logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
        vm.confirmPassword = '';
        vm.email = '';
        vm.getExternalLoginUrl = getExternalLoginUrl;
        vm.password = '';
        vm.register = register;

        _init();

        function _init() {
            // Generate test data if localhost
            if ($location.host() === 'localhost') {
                var now = new Date();
                var year = now.getFullYear();
                var month = now.getMonth() + 1;
                var day = now.getDate();
                var hour = now.getHours();
                var minute = now.getMinutes();
                var second = now.getSeconds();
                var email = 'local_' + year + month + day + '_' + hour + minute + second + '@forcrowd.org';

                vm.email = email;
                vm.password = 'q1w2e3';
                vm.confirmPassword = 'q1w2e3';
            }
        }

        function getExternalLoginUrl(provider) {
            var returnUrl = locationHistory.previousItem().url();
            return serviceAppUrl + '/api/Account/ExternalLogin?provider=' + provider + '&clientReturnUrl=' + returnUrl;
        }

        function register() {
            userFactory.register(vm)
                .success(function () {
                    logger.logSuccess('You have been registered!', null, true);
                    $location.url('/_system/account/confirmEmail');
                })
                .error(function (response) {
                    if (typeof response.error_description !== 'undefined') {
                        logger.logError(response.error_description, null, true);
                    }
                });
        }
    }
})();

(function () {
    'use strict';

    var controllerId = 'ResetPasswordController';
    angular.module('main')
        .controller(controllerId, ['userFactory', '$location', 'logger', ResetPasswordController]);

    function ResetPasswordController(userFactory, $location, logger) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.email = $location.search().email;
        vm.token = $location.search().token;
        vm.resetPassword = resetPassword;
        vm.resetPasswordRequest = resetPasswordRequest;
        vm.viewMode = typeof $location.search().email === 'undefined' || typeof $location.search().token === 'undefined' ?
            'initial' :
            'received'; // initial | sent | received

        /*** Implementations ***/

        function resetPassword() {
            // var resetPasswordBindingModel = { Token: vm.token, NewPassword: vm.newPassword, ConfirmPassword: vm.confirmPassword };
            var resetPasswordBindingModel = vm;
            userFactory.resetPassword(resetPasswordBindingModel)
                .success(function () {
                    $location.url('/_system/account/login');
                    logger.logSuccess('Your password has been reset!', null, true);
                });
        }

        function resetPasswordRequest() {
            var resetPasswordRequestBindingModel = vm;
            userFactory.resetPasswordRequest(resetPasswordRequestBindingModel)
                .success(function () {
                    vm.viewMode = 'sent';
                });
        }
    }
})();

(function () {
    'use strict';

    var controllerId = 'ResourcePoolListController';
    angular.module('main')
        .controller(controllerId, ['resourcePoolFactory',
            'logger',
			ResourcePoolListController]);

    function ResourcePoolListController(resourcePoolFactory,
        logger) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.resourcePoolSet = [];

        _init();

        function _init() {
            resourcePoolFactory.getResourcePoolSet(false)
			    .then(function (data) {
			        vm.resourcePoolSet = data;
			    });
        }
    }
})();

(function () {
    'use strict';

    var controllerId = 'ResourcePoolManageController';
    angular.module('main')
        .controller(controllerId, ['resourcePoolFactory',
            'userFactory',
            '$location',
            '$routeParams',
            '$rootScope',
            '$uibModal',
            'Enums',
            'logger',
            ResourcePoolManageController]);

    function ResourcePoolManageController(resourcePoolFactory,
        userFactory,
        $location,
        $routeParams,
        $rootScope,
        $uibModal,
        Enums,
        logger) {

        // Logger
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.addElement = addElement;
        vm.addElementField = addElementField;
        vm.addElementItem = addElementItem;
        vm.cancelElement = cancelElement;
        vm.cancelElementCell = cancelElementCell;
        vm.cancelElementField = cancelElementField;
        vm.cancelElementItem = cancelElementItem;
        vm.cancelResourcePool = cancelResourcePool;
        vm.editElement = editElement;
        vm.editElementCell = editElementCell;
        vm.editElementField = editElementField;
        vm.editElementItem = editElementItem;
        vm.element = null;
        vm.elementMaster = null;
        vm.elementCell = null;
        vm.elementCellMaster = null;
        vm.elementCellSet = elementCellSet;
        vm.elementField = null;
        vm.elementFieldMaster = null;
        vm.elementFieldSet = elementFieldSet;
        vm.elementFieldDataTypeFiltered = elementFieldDataTypeFiltered;
        vm.elementItem = null;
        vm.elementItemMaster = null;
        vm.elementItemSet = elementItemSet;
        vm.entityErrors = [];
        vm.isElementEdit = false;
        vm.isElementNew = true;
        vm.isElementFieldEdit = false;
        vm.isElementFieldNew = true;
        vm.isElementItemEdit = false;
        vm.isElementItemNew = true;
        vm.isNew = $location.path() === '/_system/resourcePool/new';
        vm.isSaveEnabled = isSaveEnabled;
        vm.isSaving = false;
        vm.openCopyModal = openCopyModal;
        vm.openRemoveResourcePoolModal = openRemoveResourcePoolModal;
        vm.removeElement = removeElement;
        vm.removeElementField = removeElementField;
        vm.removeElementItem = removeElementItem;
        vm.removeResourcePool = removeResourcePool;
        vm.resourcePool = { ElementSet: [] };
        vm.resourcePoolId = $routeParams.resourcePoolId;
        vm.saveResourcePool = saveResourcePool;
        vm.saveElement = saveElement;
        vm.saveElementCell = saveElementCell;
        vm.saveElementField = saveElementField;
        vm.saveElementItem = saveElementItem;

        // Enums
        vm.ElementFieldDataType = Enums.ElementFieldDataType;
        vm.ElementFieldIndexCalculationType = Enums.ElementFieldIndexCalculationType;
        vm.ElementFieldIndexSortType = Enums.ElementFieldIndexSortType;

        _init();

        /*** Implementations ***/

        function _init() {

            if (vm.isNew) {
                resourcePoolFactory.createResourcePoolBasic()
                    .then(function (resourcePool) {
                        vm.resourcePool = resourcePool;
                        vm.resourcePool.isEditing = true;

                        // Title
                        // TODO viewTitle was also set in route.js?
                        $rootScope.viewTitle = vm.resourcePool.Name;
                    });
            } else {
                resourcePoolFactory.getResourcePoolExpanded(vm.resourcePoolId)
                    .then(function (resourcePool) {

                        // Not found, navigate to 404
                        if (resourcePool === null) {
                            $location.url('/_system/content/404');
                            return;
                        }

                        vm.resourcePool = resourcePool;
                        vm.resourcePool.isEditing = true;

                        // Title
                        // TODO viewTitle was also set in route.js?
                        $rootScope.viewTitle = vm.resourcePool.Name;
                    });
            }
        }

        function addElement() {
            vm.element = resourcePoolFactory.createElement({
                ResourcePool: vm.resourcePool,
                Name: 'New element',
                IsMainElement: false
            });

            vm.isElementEdit = true;
            vm.isElementNew = true;
        }

        function addElementField() {

            var element = vm.resourcePool.ElementSet[0];

            // A temp fix for default value of 'SortOrder'
            // Later handle 'SortOrder' by UI, not by asking
            var sortOrder = element.ElementFieldSet.length + 1;

            vm.elementField = resourcePoolFactory.createElementField({
                Element: element,
                Name: 'New field',
                DataType: 1,
                SortOrder: sortOrder
            });

            vm.isElementFieldEdit = true;
            vm.isElementFieldNew = true;
        }

        function addElementItem() {
            vm.elementItem = { Element: vm.resourcePool.ElementSet[0], Name: 'New item' };
            vm.isElementItemEdit = true;
            vm.isElementItemNew = true;
        }

        function cancelElement() {

            // TODO Find a better way?
            // Can't use reject changes because in 'New CMRP' case, these are newly added entities and reject changes removes them / SH - 23 Nov. '15
            if (vm.isElementNew) {
                resourcePoolFactory.removeElement(vm.element);
            } else {
                vm.element.Name = vm.elementMaster.Name;
            }

            vm.isElementEdit = false;
            vm.element = null;
            vm.elementMaster = null;
        }

        function cancelElementCell() {

            // TODO Find a better way?
            // Can't use reject changes because in 'New CMRP' case, these are newly added entities and reject changes removes them / SH - 23 Nov. '15
            vm.elementCell.SelectedElementItemId = vm.elementCellMaster.SelectedElementItemId;
            vm.elementCell.UserElementCellSet[0].StringValue = vm.elementCellMaster.UserElementCellSet[0].StringValue;
            vm.elementCell.UserElementCellSet[0].BooleanValue = vm.elementCellMaster.UserElementCellSet[0].BooleanValue;
            vm.elementCell.UserElementCellSet[0].IntegerValue = vm.elementCellMaster.UserElementCellSet[0].IntegerValue;
            vm.elementCell.UserElementCellSet[0].DecimalValue = vm.elementCellMaster.UserElementCellSet[0].DecimalValue;
            vm.elementCell.UserElementCellSet[0].DateTimeValue = vm.elementCellMaster.UserElementCellSet[0].DateTimeValue;

            vm.isElementCellEdit = false;
            vm.elementCell = null;
            vm.elementCellMaster = null;
        }

        function cancelElementField() {

            // TODO Find a better way?
            // Can't use reject changes because in 'New CMRP' case, these are newly added entities and reject changes removes them / SH - 23 Nov. '15
            if (vm.isElementFieldNew) {
                resourcePoolFactory.removeElementField(vm.elementField);
            } else {
                vm.elementField.Name = vm.elementFieldMaster.Name;
                vm.elementField.DataType = vm.elementFieldMaster.DataType;
                vm.elementField.SelectedElementId = vm.elementFieldMaster.SelectedElementId;
                vm.elementField.UseFixedValue = vm.elementFieldMaster.UseFixedValue;
                vm.elementField.IndexEnabled = vm.elementFieldMaster.IndexEnabled;
                vm.elementField.IndexCalculationType = vm.elementFieldMaster.IndexCalculationType;
                vm.elementField.IndexSortType = vm.elementFieldMaster.IndexSortType;
                vm.elementField.SortOrder = vm.elementFieldMaster.SortOrder;
            }

            vm.isElementFieldEdit = false;
            vm.elementField = null;
            vm.elementFieldMaster = null;
        }

        function cancelElementItem() {

            // TODO Find a better way?
            // Can't use reject changes because in 'New CMRP' case, these are newly added entities and reject changes removes them / SH - 23 Nov. '15
            if (!vm.isElementItemNew) {
                vm.elementItem.Name = vm.elementItemMaster.Name;
            }

            vm.isElementItemEdit = false;
            vm.elementItem = null;
            vm.elementItemMaster = null;
        }

        function cancelResourcePool() {

            resourcePoolFactory.cancelResourcePool(vm.resourcePool);

            var locationPath = vm.isNew ?
                '/_system/resourcePool' :
                '/_system/resourcePool/' + vm.resourcePool.Id;

            $location.url(locationPath);
        }

        function editElement(element) {
            vm.elementMaster = angular.copy(element);
            vm.element = element;
            vm.isElementEdit = true;
            vm.isElementNew = false;
        }

        function editElementCell(elementCell) {
            vm.elementCellMaster = angular.copy(elementCell);
            vm.elementCell = elementCell;
            vm.isElementCellEdit = true;
        }

        function editElementField(elementField) {
            vm.elementFieldMaster = angular.copy(elementField);
            vm.elementField = elementField;
            vm.isElementFieldEdit = true;
            vm.isElementFieldNew = false;
        }

        function editElementItem(elementItem) {
            vm.elementItemMaster = angular.copy(elementItem);
            vm.elementItem = elementItem;
            vm.isElementItemEdit = true;
            vm.isElementItemNew = false;
        }

        function elementCellSet() {

            var elementItems = elementItemSet();

            var list = [];
            elementItems.forEach(function (elementItem) {
                elementItem.ElementCellSet.forEach(function (elementCell) {
                    list.push(elementCell);
                });
            });
            return list;
        }

        function elementFieldSet() {
            var list = [];
            vm.resourcePool.ElementSet.forEach(function (element) {
                element.ElementFieldSet.forEach(function (elementField) {
                    list.push(elementField);
                });
            });
            return list;
        }

        function elementFieldDataTypeFiltered() {

            var filtered = {};
            for (var key in vm.ElementFieldDataType) {

                // These types can be added only once at the moment
                if (key === 'DirectIncome' || key === 'Multiplier') {
                    var exists = vm.elementField.Element.ElementFieldSet.some(fieldExists);

                    if (!exists) {
                        filtered[key] = vm.ElementFieldDataType[key];
                    }
                } else if (key === 'Element') { // Element type can only be added if there are more than one element in the pool
                    if (vm.elementField.Element.ResourcePool.ElementSet.length > 1) {
                        filtered[key] = vm.ElementFieldDataType[key];
                    }
                } else {
                    filtered[key] = vm.ElementFieldDataType[key];
                }
            }

            function fieldExists(field) {
                return vm.ElementFieldDataType[key] === field.ElementFieldDataType;
            }

            return filtered;
        }

        function elementItemSet() {
            var list = [];
            vm.resourcePool.ElementSet.forEach(function (element) {
                element.ElementItemSet.forEach(function (elementItem) {
                    list.push(elementItem);
                });
            });
            return list;
        }

        function isSaveEnabled() {
            var value = !vm.isSaving &&
                typeof vm.resourcePoolForm !== 'undefined' &&
                vm.resourcePoolForm.$valid;

            return value;
        }

        function openCopyModal() {
            var modalInstance = $uibModal.open({
                templateUrl: 'copyResourcePoolModal.html',
                controllerAs: 'vm',
                controller: ['resourcePoolFactory', '$uibModalInstance', CopyResourcePoolModalController]
            });

            modalInstance.result.then(function (resourcePool) {
                vm.resourcePool = resourcePool;
            });
        }

        function openRemoveResourcePoolModal() {
            var modalInstance = $uibModal.open({
                templateUrl: 'removeResourcePoolModal.html',
                controller: ['$scope', '$uibModalInstance', RemoveResourcePoolModalController]
            });

            modalInstance.result.then(function () {
                removeResourcePool();
            });
        }

        function removeElement(element) {
            resourcePoolFactory.removeElement(element);
        }

        function removeElementField(elementField) {
            resourcePoolFactory.removeElementField(elementField);
        }

        function removeElementItem(elementItem) {
            resourcePoolFactory.removeElementItem(elementItem);
        }

        function removeResourcePool() {
            vm.isSaving = true;

            resourcePoolFactory.removeResourcePool(vm.resourcePool);

            userFactory.getCurrentUser()
                .then(function (currentUser) {
                    if (currentUser.isAuthenticated()) {
                        resourcePoolFactory.saveChanges()
                            .then(function () {
                                $location.url('/_system/resourcePool');
                            })
                            .finally(function () {
                                vm.isSaving = false;
                            });
                    } else {
                        $location.url('/_system/resourcePool');
                        vm.isSaving = false;
                    }
                });
        }

        function saveElement() {
            vm.isElementEdit = false;
            vm.element = null;
            vm.elementMaster = null;
        }

        function saveElementCell() {
            vm.isElementCellEdit = false;
            vm.elementCell = null;
            vm.elementCellMaster = null;
        }

        function saveElementField() {

            // Fixes
            // a. UseFixedValue must be null for String & Element types
            if (vm.elementField.DataType === vm.ElementFieldDataType.String ||
                vm.elementField.DataType === vm.ElementFieldDataType.Element) {
                vm.elementField.UseFixedValue = null;
            }

            // b. UseFixedValue must be 'false' for Multiplier type
            if (vm.elementField.DataType === vm.ElementFieldDataType.Multiplier) {
                vm.elementField.UseFixedValue = false;
            }

            // c. DirectIncome cannot be Use Fixed Value false at the moment
            if (vm.elementField.DataType === vm.ElementFieldDataType.DirectIncome) {
                vm.elementField.UseFixedValue = true;
            }

            vm.isElementFieldEdit = false;
            vm.elementField = null;
            vm.elementFieldMaster = null;
        }

        function saveElementItem() {

            if (vm.isElementItemNew) {
                vm.elementItem = resourcePoolFactory.createElementItem(vm.elementItem);
            }

            vm.isElementItemEdit = false;
            vm.elementItem = null;
            vm.elementItemMaster = null;
        }

        function saveResourcePool() {

            vm.isSaving = true;

            // TODO Try to move this to a better place?
            vm.resourcePool.updateCache();

            userFactory.getCurrentUser()
                .then(function (currentUser) {

                    /* Update isEditing state */
                    // Resource pool
                    vm.resourcePool.isEditing = false;

                    // User resource pools
                    vm.resourcePool.UserResourcePoolSet.forEach(function (userResourcePool) {
                        userResourcePool.isEditing = false;
                    });

                    // Elements
                    vm.resourcePool.ElementSet.forEach(function (element) {
                        element.isEditing = false;

                        // Fields
                        element.ElementFieldSet.forEach(function (elementField) {
                            elementField.isEditing = false;

                            // User element fields
                            elementField.UserElementFieldSet.forEach(function (userElementField) {
                                userElementField.isEditing = false;
                            });
                        });

                        // Items
                        element.ElementItemSet.forEach(function (elementItem) {
                            elementItem.isEditing = false;

                            // Cells
                            elementItem.ElementCellSet.forEach(function (elementCell) {
                                elementCell.isEditing = false;

                                // User cells
                                elementCell.UserElementCellSet.forEach(function (userElementCell) {
                                    userElementCell.isEditing = false;
                                });
                            });
                        });
                    });
                    /* Update isEditing state end */

                    if (currentUser.isAuthenticated()) {
                        resourcePoolFactory.saveChanges()
                            .then(function () {
                                $location.url('/_system/resourcePool/' + vm.resourcePool.Id);
                            })
                            .finally(function () {
                                vm.isSaving = false;
                            });
                    } else {
                        resourcePoolFactory.acceptChanges(vm.resourcePool);
                        vm.isSaving = false;
                        $location.url('/_system/resourcePool/' + vm.resourcePool.Id);
                    }
                });
        }
    }

    function RemoveResourcePoolModalController($scope, $uibModalInstance) {
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.remove = function () {
            $uibModalInstance.close();
        };
    }

    function CopyResourcePoolModalController(resourcePoolFactory, $uibModalInstance) {

        var vm = this;
        vm.close = close;
        vm.copy = copy;
        vm.resourcePoolSet = [];

        _init();

        function _init() {
            resourcePoolFactory.getResourcePoolSet(false)
                .then(function (data) {
                    vm.resourcePoolSet = data;
                });
        }

        function close() {
            $uibModalInstance.dismiss('cancel');
        }

        function copy(resourcePool) {
            $uibModalInstance.close(resourcePool);
        }
    }

})();

(function () {
    'use strict';

    var controllerId = 'ResourcePoolViewController';
    angular.module('main')
        .controller(controllerId, ['resourcePoolFactory',
            '$location',
            '$routeParams',
            '$rootScope',
            'logger',
            ResourcePoolViewController]);

    function ResourcePoolViewController(resourcePoolFactory, $location, $routeParams, $rootScope, logger) {

        // Logger
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.editorConfig = getEditorConfig();

        init();

        function init() {

            // Title
            if (!vm.editorConfig.isNew) {
                resourcePoolFactory.getResourcePool(vm.editorConfig.resourcePoolId)
                    .then(function (resourcePool) {

                        // Not found, navigate to 404
                        if (resourcePool === null) {
                            $location.url('/_system/content/404');
                            return;
                        }

                        // TODO viewTitle was also set in route.js?
                        $rootScope.viewTitle = resourcePool.name();
                    });
            }
        }

        function getEditorConfig() {

            var action = $location.path().substring($location.path().lastIndexOf('/') + 1);
            var isNew = action === 'new';
            var isEdit = action === 'edit';
            var resourcePoolId = $routeParams.resourcePoolId;

            var config = {
                isNew: isNew,
                isEdit: isEdit,
                resourcePoolId: isNew ? null : resourcePoolId
            };

            return config;
        }
    }
})();

(function () {
    'use strict';

    var controllerId = 'AllInOneController';
    angular.module('main')
        .controller(controllerId, ['resourcePoolFactory', '$scope', 'logger', AllInOneController]);

    function AllInOneController(resourcePoolFactory, $scope, logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
        vm.allInOneConfig = { resourcePoolId: 7 };

        // Event listeners
        $scope.$on('resourcePoolEditor_elementCellNumericValueIncreased', processNewInteraction);
        $scope.$on('resourcePoolEditor_elementCellNumericValueDecreased', processNewInteraction);
        $scope.$on('resourcePoolEditor_elementCellNumericValueReset', processNewInteraction);

        _init();

        function _init() {
            processExistingInteraction();
        }

        // Processes whether the current user had already interacted with this example
        function processExistingInteraction() {
            // Priority & Knowledge Index examples copy their ratings to this one
            // However if the user starts directly playing ..
            resourcePoolFactory.getResourcePoolExpanded(vm.allInOneConfig.resourcePoolId)
                .then(function (resourcePool) {
                    // Elements
                    for (var elementIndex = 0; elementIndex < resourcePool.ElementSet.length; elementIndex++) {
                        var element = resourcePool.ElementSet[elementIndex];
                        // Element fields
                        for (var elementFieldIndex = 0; elementFieldIndex < element.ElementFieldSet.length; elementFieldIndex++) {
                            var elementField = element.ElementFieldSet[elementFieldIndex];
                            // Element cells
                            for (var elementCellIndex = 0; elementCellIndex < elementField.ElementCellSet.length; elementCellIndex++) {
                                var elementCell = elementField.ElementCellSet[elementCellIndex];

                                if (elementCell.currentUserCell()) {
                                    resourcePool.userInteracted = true;
                                    return;
                                }
                            }
                        }
                    }
                });
        }

        // Processes whether the user is currently interacting with this example
        function processNewInteraction(event, cell) {
            if (cell.ElementField.Element.ResourcePoolId === vm.allInOneConfig.resourcePoolId) {
                cell.ElementField.Element.ResourcePool.userInteracted = true;
                return;
            }
        }
    }
})();

(function () {
    'use strict';

    var controllerId = 'BasicsController';
    angular.module('main')
        .controller(controllerId, ['resourcePoolFactory', 'userFactory', 'dataContext', '$scope', 'logger', BasicsController]);

    function BasicsController(resourcePoolFactory, userFactory, dataContext, $scope, logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
        vm.existingModelConfig = {};
        vm.newModelConfig = {};

        // Listen resource pool updated event
        $scope.$on('resourcePoolEditor_elementMultiplierIncreased', updateOppositeResourcePool);
        $scope.$on('resourcePoolEditor_elementMultiplierDecreased', updateOppositeResourcePool);
        $scope.$on('resourcePoolEditor_elementMultiplierReset', updateOppositeResourcePool);

        _init();

        /*** Implementations ***/

        function _init() {

            var existingModelSampleId = -102;
            var newModelSampleId = -103;

            resourcePoolFactory.getResourcePoolExpanded(existingModelSampleId)
                .then(function (resourcePool) {
                    if (resourcePool === null) {
                        getBasicsSample()
                            .then(function (resourcePool) {
                                resourcePool.Id = existingModelSampleId;
                                resourcePool.Name = 'Basics - Existing Model';
                                resourcePool.UserResourcePoolSet[0].entityAspect.setDeleted(); // Remove resource pool rate
                                resourcePool._init(true);

                                vm.existingModelConfig.resourcePoolId = resourcePool.Id;
                            });
                    } else {
                        vm.existingModelConfig.resourcePoolId = resourcePool.Id;
                    }
                });

            resourcePoolFactory.getResourcePoolExpanded(newModelSampleId)
                .then(function (resourcePool) {
                    if (resourcePool === null) {
                        getBasicsSample()
                            .then(function (resourcePool) {
                                resourcePool.Id = newModelSampleId;
                                resourcePool.Name = 'Basics - New Model';

                                // Employee Satisfaction field (index)
                                var employeeSatisfactionField = resourcePoolFactory.createElementField({
                                    Element: resourcePool.mainElement(),
                                    Name: 'Employee Satisfaction',
                                    DataType: 4,
                                    UseFixedValue: false,
                                    IndexEnabled: true,
                                    IndexCalculationType: 1,
                                    IndexSortType: 1,
                                    SortOrder: 2
                                });

                                // A fake user & ratings
                                // TODO Use factories instead of dataContext?
                                var fakeUser = dataContext.createEntity('User', {});

                                employeeSatisfactionField.ElementCellSet.forEach(function (elementCell) {
                                    var userElementCell = {
                                        User: fakeUser,
                                        ElementCell: elementCell,
                                        DecimalValue: Math.floor((Math.random() * 100) + 1)
                                    };

                                    dataContext.createEntity('UserElementCell', userElementCell);
                                });

                                resourcePool._init(true);

                                vm.newModelConfig.resourcePoolId = resourcePool.Id;
                            });
                    } else {
                        vm.newModelConfig.resourcePoolId = resourcePool.Id;
                    }
                });
        }

        function getBasicsSample() {
            return resourcePoolFactory.createResourcePoolDirectIncomeAndMultiplier()
                .then(function (resourcePool) {
                    resourcePool.InitialValue = 0;
                    resourcePool.isTemp = true;

                    var mainElement = resourcePool.mainElement();
                    mainElement.Name = 'Organization';

                    mainElement.ElementItemSet[0].Name = 'Alpha';
                    mainElement.ElementItemSet[1].Name = 'Beta';
                    resourcePoolFactory.createElementItem({
                        Element: mainElement,
                        Name: 'Charlie'
                    });
                    resourcePoolFactory.createElementItem({
                        Element: mainElement,
                        Name: 'Delta'
                    });

                    return resourcePool;
                });
        }

        function updateOppositeResourcePool(event, element) {

            var oppositeResourcePoolId = 0;

            if (element.ResourcePool.Id === vm.existingModelConfig.resourcePoolId) {
                oppositeResourcePoolId = vm.newModelConfig.resourcePoolId;
            } else if (element.ResourcePool.Id === vm.newModelConfig.resourcePoolId) {
                oppositeResourcePoolId = vm.existingModelConfig.resourcePoolId;
            }

            // Call the service to increase the multiplier
            if (oppositeResourcePoolId !== 0) {
                resourcePoolFactory.getResourcePoolExpanded(oppositeResourcePoolId)
                    .then(function (resourcePool) {
                        switch (event.name) {
                            case 'resourcePoolEditor_elementMultiplierIncreased': {
                                userFactory.updateElementMultiplier(resourcePool.mainElement(), 'increase');
                                break;
                            }
                            case 'resourcePoolEditor_elementMultiplierDecreased': {
                                userFactory.updateElementMultiplier(resourcePool.mainElement(), 'decrease');
                                break;
                            }
                            case 'resourcePoolEditor_elementMultiplierReset': {
                                userFactory.updateElementMultiplier(resourcePool.mainElement(), 'reset');
                                break;
                            }
                        }
                    });
            }
        }
    }
})();

(function () {
    'use strict';

    var controllerId = 'DefaultController';
    angular.module('main')
        .controller(controllerId, ['applicationFactory', 'userFactory', '$scope', '$location', 'disqusShortname', 'logger', DefaultController]);

    function DefaultController(applicationFactory, userFactory, $scope, $location, disqusShortname, logger) {

        // Logger
        logger = logger.forSource(controllerId);

        // Local variables
        var anonymousUserWarning = null;

        // View model
        var vm = this;
        vm.applicationInfo = null;
        vm.currentUser = { Email: '', isAuthenticated: function () { return false; }, hasPassword: function () { return false; } };
        vm.currentDate = new Date();
        vm.displayBankTransfer = false;
        vm.displayFooterIcons = false;
        vm.disqusConfig = {
            disqus_shortname: disqusShortname,
            disqus_identifier: '',
            disqus_url: ''
        };
        vm.logout = logout;
        vm.toggleBankTransfer = toggleBankTransfer;

        // Events
        $scope.$on('$routeChangeSuccess', routeChangeSuccess);
        $scope.$on('anonymousUserInteracted', anonymousUserInteracted); // Anonymous user warning
        $scope.$on('userFactory_currentUserChanged', currentUserChanged);

        _init();

        /*** Implementations ***/

        function _init() {
            getApplicationInfo();
        }

        function anonymousUserInteracted() {
            if (anonymousUserWarning === null) {
                var warningText = 'To prevent losing your changes, you can register for free or if you have an existing account, please login first.';
                var warningTitle = 'Save your changes?';
                var loggerOptions = { extendedTimeOut: 0, timeOut: 0 };
                anonymousUserWarning = logger.logWarning(warningText, null, true, warningTitle, loggerOptions);
            }
        }

        function currentUserChanged(event, newUser) {
            vm.currentUser = newUser;
        }

        function getApplicationInfo() {
            applicationFactory.getApplicationInfo()
                .then(function (applicationInfo) {
                    vm.applicationInfo = applicationInfo;
                    vm.applicationInfo.CurrentVersionText = vm.applicationInfo.CurrentVersion + ' - Alpha ~ Beta';
                });
        }

        function logout() {
            userFactory.logout()
                .then(function () {
                    $location.url('/');
                });
        }

        function routeChangeSuccess(event, current, previous) {

            // Footer icons
            vm.displayFooterIcons = $location.path() === '/';

            // Load related disqus
            if (typeof current.enableDisqus !== 'undefined' && current.enableDisqus) {
                vm.disqusConfig.disqus_identifier = disqusShortname + $location.path().replace(/\//g, '_');
                vm.disqusConfig.disqus_url = $location.absUrl().substring(0, $location.absUrl().length - $location.url().length + $location.path().length);
            } else {
                vm.disqusConfig.disqus_identifier = '';
            }

            // Remove anonymousUserWarning toastr in register & login pages, if there is
            if (($location.path() === '/_system/account/register' ||
                $location.path() === '/_system/account/login') &&
                anonymousUserWarning !== null) {
                anonymousUserWarning.remove();
            }
        }

        function toggleBankTransfer() {
            vm.displayBankTransfer = !vm.displayBankTransfer;
        }
    }
})();

(function () {
    'use strict';

    var controllerId = 'IntroductionController';
    angular.module('main')
        .controller(controllerId, ['resourcePoolFactory', 'userFactory', '$scope', '$timeout', 'logger', IntroductionController]);

    function IntroductionController(resourcePoolFactory, userFactory, $scope, $timeout, logger) {

        // Logger
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.upoConfig = {};

        _init();

        /*** Implementations ***/

        function _init() {

            var upoId = -101;

            resourcePoolFactory.getResourcePoolExpanded(upoId)
                .then(function (resourcePool) {
                    if (resourcePool === null) {

                        resourcePoolFactory.createResourcePoolDirectIncomeAndMultiplier()
                            .then(function (resourcePool) {
                                resourcePool.Id = upoId;
                                resourcePool.Name = 'Unidentified Profiting Object (UPO)';
                                resourcePool.InitialValue = 0;
                                resourcePool.isTemp = true;
                                resourcePool.displayMultiplierFunctions = false;
                                resourcePool.UserResourcePoolSet[0].entityAspect.setDeleted(); // Remove resource pool rate

                                var mainElement = resourcePool.mainElement();
                                mainElement.Name = 'Organization';

                                mainElement.ElementItemSet[0].Name = 'UPO';
                                resourcePoolFactory.removeElementItem(mainElement.ElementItemSet[1]);

                                resourcePool._init(true);

                                initResourcePool(resourcePool);
                            });
                    } else {
                        initResourcePool(resourcePool);
                    }

                    function initResourcePool(resourcePool) {
                        vm.upoConfig.resourcePoolId = resourcePool.Id;

                        var increaseMultiplierTimeout = $timeout(increaseMultiplier, 5000);

                        function increaseMultiplier() {

                            // Call the service to increase the multiplier
                            resourcePoolFactory.getResourcePoolExpanded(vm.upoConfig.resourcePoolId)
                                .then(function (resourcePool) {

                                    if (resourcePool === null) {
                                        return;
                                    }

                                    resourcePool.ElementSet.forEach(function (element) {
                                        userFactory.updateElementMultiplier(element, 'increase');
                                    });
                                });

                            // Then increase recursively
                            increaseMultiplierTimeout = $timeout(increaseMultiplier, 2500);
                        }

                        // When the DOM element is removed from the page,
                        // AngularJS will trigger the $destroy event on
                        // the scope. This gives us a chance to cancel any
                        // pending timer that we may have.
                        $scope.$on("$destroy", function (event) {
                            $timeout.cancel(increaseMultiplierTimeout);
                        });
                    }
                });
        }

    }
})();

(function () {
    'use strict';

    var controllerId = 'KnowledgeIndexController';
    angular.module('main')
        .controller(controllerId, ['resourcePoolFactory', 'userFactory', '$scope', '$timeout', 'logger', KnowledgeIndexController]);

    function KnowledgeIndexController(resourcePoolFactory, userFactory, $scope, $timeout, logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
        vm.oldModelChartConfig = {
            title: {
                text: ''
            },
            options: {
                chart: {
                    type: 'column',
                    height: 358
                },
                plotOptions: {
                    column: {
                        allowPointSelect: true,
                        pointWidth: 15
                    }
                },
                xAxis: { categories: ['Knowledge'] },
                yAxis: {
                    title: {
                        text: 'Development process'
                    },
                    allowDecimals: false,
                    min: 0
                }
            },
            size: {},
            series: [
                { name: "My Precious Jewelry", data: [0] },
                { name: 'Death Star Architecture', data: [0] },
                { name: "Christina's Secret", data: [0] },
                { name: 'Nuka Cola Company', data: [0] }
            ]
        };
        vm.newModelChartConfig = {
            title: {
                text: ''
            },
            options: {
                chart: {
                    type: 'column',
                    height: 300
                },
                plotOptions: {
                    column: {
                        allowPointSelect: true,
                        pointWidth: 15
                    }
                },
                xAxis: { categories: ['Knowledge'] },
                yAxis: {
                    title: {
                        text: 'Development process'
                    },
                    allowDecimals: false,
                    min: 0
                }
            },
            size: {},
            series: [
                { name: 'Global Knowledge Database', data: [0] }
            ]
        };
        vm.knowledgeIndexConfig = { resourcePoolId: 3 };

        // Event listeners
        $scope.$on('resourcePoolEditor_elementCellNumericValueIncreased', updateAllInOne);
        $scope.$on('resourcePoolEditor_elementCellNumericValueDecreased', updateAllInOne);
        $scope.$on('resourcePoolEditor_elementCellNumericValueReset', updateAllInOne);

        _init();

        function _init() {
            var timeout = $timeout(refreshPage, 10000);

            function refreshPage() {
                var organizationIndex = Math.floor(Math.random() * 4);
                vm.oldModelChartConfig.series[organizationIndex].data[0] += 1;
                vm.newModelChartConfig.series[0].data[0] += 1;

                timeout = $timeout(refreshPage, 1000);
            }

            // When the DOM element is removed from the page,
            // AngularJS will trigger the $destroy event on
            // the scope. This gives us a chance to cancel any
            // pending timer that we may have.
            $scope.$on("$destroy", function (event) {
                $timeout.cancel(timeout);
            });
        }

        // Sync this example's values with 'All in One'
        function updateAllInOne(event, cell) {

            var allInOneId = 7;

            if (cell.ElementField.Element.ResourcePoolId !== vm.knowledgeIndexConfig.resourcePoolId) {
                return;
            }

            resourcePoolFactory.getResourcePoolExpanded(allInOneId)
                .then(function (resourcePool) {

                    // If the current user already interacted with 'All in One', stop copying ratings
                    if (typeof resourcePool.userInteracted !== 'undefined' && resourcePool.userInteracted) {
                        return;
                    }

                    // Elements
                    for (var elementIndex = 0; elementIndex < resourcePool.ElementSet.length; elementIndex++) {
                        var element = resourcePool.ElementSet[elementIndex];
                        if (element.Name === cell.ElementField.Element.Name) {
                            // Element fields
                            for (var elementFieldIndex = 0; elementFieldIndex < element.ElementFieldSet.length; elementFieldIndex++) {
                                var elementField = element.ElementFieldSet[elementFieldIndex];
                                if (elementField.Name === cell.ElementField.Name) {
                                    // Element cells
                                    for (var elementCellIndex = 0; elementCellIndex < elementField.ElementCellSet.length; elementCellIndex++) {
                                        var elementCell = elementField.ElementCellSet[elementCellIndex];
                                        if (elementCell.ElementItem.Name === cell.ElementItem.Name) {
                                            switch (event.name) {
                                                case 'resourcePoolEditor_elementCellNumericValueIncreased': {
                                                    userFactory.updateElementCellNumericValue(elementCell, 'increase');
                                                    break;
                                                }
                                                case 'resourcePoolEditor_elementCellNumericValueDecreased': {
                                                    userFactory.updateElementCellNumericValue(elementCell, 'decrease');
                                                    break;
                                                }
                                                case 'resourcePoolEditor_elementCellNumericValueReset': {
                                                    userFactory.updateElementCellNumericValue(elementCell, 'reset');
                                                    break;
                                                }
                                            }

                                            // Save changes
                                            resourcePoolFactory.saveChanges(1500);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
        }
    }
})();

(function () {
    'use strict';

    var controllerId = 'PriorityIndexController';
    angular.module('main')
        .controller(controllerId, ['resourcePoolFactory', 'userFactory', '$scope', 'logger', PriorityIndexController]);

    function PriorityIndexController(resourcePoolFactory, userFactory, $scope, logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
        vm.priorityIndexConfig = { resourcePoolId: 2 };

        // Event listeners
        $scope.$on('resourcePoolEditor_elementCellNumericValueIncreased', updateAllInOne);
        $scope.$on('resourcePoolEditor_elementCellNumericValueDecreased', updateAllInOne);
        $scope.$on('resourcePoolEditor_elementCellNumericValueReset', updateAllInOne);

        // Sync this example's values with 'All in One'
        function updateAllInOne(event, cell) {

            var allInOneId = 7;

            if (cell.ElementField.Element.ResourcePoolId !== vm.priorityIndexConfig.resourcePoolId) {
                return;
            }

            resourcePoolFactory.getResourcePoolExpanded(allInOneId)
                .then(function (resourcePool) {

                    // If the current user already interacted with 'All in One', stop copying ratings
                    if (typeof resourcePool.userInteracted !== 'undefined' && resourcePool.userInteracted) {
                        return;
                    }

                    // Elements
                    for (var elementIndex = 0; elementIndex < resourcePool.ElementSet.length; elementIndex++) {
                        var element = resourcePool.ElementSet[elementIndex];
                        if (element.Name === cell.ElementField.Element.Name) {
                            // Element fields
                            for (var elementFieldIndex = 0; elementFieldIndex < element.ElementFieldSet.length; elementFieldIndex++) {
                                var elementField = element.ElementFieldSet[elementFieldIndex];
                                if (elementField.Name === cell.ElementField.Name) {
                                    // Element cells
                                    for (var elementCellIndex = 0; elementCellIndex < elementField.ElementCellSet.length; elementCellIndex++) {
                                        var elementCell = elementField.ElementCellSet[elementCellIndex];
                                        if (elementCell.ElementItem.Name === cell.ElementItem.Name) {
                                            switch (event.name) {
                                                case 'resourcePoolEditor_elementCellNumericValueIncreased': {
                                                    userFactory.updateElementCellNumericValue(elementCell, 'increase');
                                                    break;
                                                }
                                                case 'resourcePoolEditor_elementCellNumericValueDecreased': {
                                                    userFactory.updateElementCellNumericValue(elementCell, 'decrease');
                                                    break;
                                                }
                                                case 'resourcePoolEditor_elementCellNumericValueReset': {
                                                    userFactory.updateElementCellNumericValue(elementCell, 'reset');
                                                    break;
                                                }
                                            }

                                            // Save changes
                                            resourcePoolFactory.saveChanges(1500);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
        }
    }
})();

(function () {
    'use strict';

    var controllerId = 'TotalCostIndexController';
    angular.module('main')
        .controller(controllerId, ['resourcePoolFactory', 'userFactory', '$scope', 'logger', TotalCostIndexController]);

    function TotalCostIndexController(resourcePoolFactory, userFactory, $scope, logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
        vm.existingModelConfig = { resourcePoolId: 5 };
        vm.newModelConfig = { resourcePoolId: 6 };

        // Listen resource pool updated event
        $scope.$on('resourcePoolEditor_elementMultiplierIncreased', updateOppositeResourcePool);
        $scope.$on('resourcePoolEditor_elementMultiplierDecreased', updateOppositeResourcePool);
        $scope.$on('resourcePoolEditor_elementMultiplierReset', updateOppositeResourcePool);

        function updateOppositeResourcePool(event, element) {

            var oppositeResourcePoolId = 0;

            if (element.ResourcePool.Id === vm.existingModelConfig.resourcePoolId) {
                oppositeResourcePoolId = vm.newModelConfig.resourcePoolId;
            } else if (element.ResourcePool.Id === vm.newModelConfig.resourcePoolId) {
                oppositeResourcePoolId = vm.existingModelConfig.resourcePoolId;
            }

            // Call the service to increase the multiplier
            if (oppositeResourcePoolId > 0) {
                resourcePoolFactory.getResourcePoolExpanded(oppositeResourcePoolId)
                    .then(function (resourcePool) {

                        switch (event.name) {
                            case 'resourcePoolEditor_elementMultiplierIncreased': {
                                userFactory.updateElementMultiplier(resourcePool.mainElement(), 'increase');
                                break;
                            }
                            case 'resourcePoolEditor_elementMultiplierDecreased': {
                                userFactory.updateElementMultiplier(resourcePool.mainElement(), 'decrease');
                                break;
                            }
                            case 'resourcePoolEditor_elementMultiplierReset': {
                                userFactory.updateElementMultiplier(resourcePool.mainElement(), 'reset');
                                break;
                            }
                        }

                        resourcePoolFactory.saveChanges(1500);
                    });
            }
        }
    }
})();

(function () {
    'use strict';

    var directiveId = 'resourcePoolEditor';

    angular.module('main')
        .directive(directiveId, ['resourcePoolFactory',
            'userFactory',
            'Enums',
            '$location',
            '$rootScope',
            'logger',
            resourcePoolEditor]);

    function resourcePoolEditor(resourcePoolFactory,
        userFactory,
        Enums,
        $location,
        $rootScope,
        logger) {

        // Logger
        logger = logger.forSource(directiveId);

        function link(scope, elm, attrs) {

            // Local variables
            scope.currentUser = null;
            scope.displayIndexDetails = false;
            scope.editResourcePool = editResourcePool;
            scope.errorMessage = '';
            scope.isSaving = false;
            scope.resourcePool = { Name: 'Loading...' };
            scope.resourcePoolId = null;

            // Functions
            scope.changeSelectedElement = changeSelectedElement;
            scope.decreaseElementCellNumericValue = decreaseElementCellNumericValue;
            scope.decreaseElementMultiplier = decreaseElementMultiplier;
            scope.decreaseElementCellMultiplier = decreaseElementCellMultiplier;
            scope.decreaseIndexRating = decreaseIndexRating;
            scope.decreaseResourcePoolRate = decreaseResourcePoolRate;
            scope.increaseElementCellNumericValue = increaseElementCellNumericValue;
            scope.increaseElementMultiplier = increaseElementMultiplier;
            scope.increaseElementCellMultiplier = increaseElementCellMultiplier;
            scope.increaseIndexRating = increaseIndexRating;
            scope.increaseResourcePoolRate = increaseResourcePoolRate;
            scope.resetElementCellNumericValue = resetElementCellNumericValue;
            scope.resetElementMultiplier = resetElementMultiplier;
            scope.resetElementCellMultiplier = resetElementCellMultiplier;
            scope.resetIndexRating = resetIndexRating;
            scope.resetResourcePoolRate = resetResourcePoolRate;
            scope.toggleIndexDetails = toggleIndexDetails;

            // Event handlers
            scope.$watch('config', configChanged, true);
            scope.$on('saveChangesStart', saveChangesStart);
            scope.$on('saveChangesCompleted', saveChangesCompleted);
            scope.$on('userFactory_currentUserChanged', currentUserChanged);

            /*** Implementations ***/

            function changeSelectedElement(element) {
                scope.resourcePool.selectedElement(element);
                loadChartData();
            }

            function configChanged() {
                var resourcePoolId = typeof scope.config.resourcePoolId === 'undefined' ? null : Number(scope.config.resourcePoolId);
                userFactory.getCurrentUser()
                    .then(function (currentUser) {
                        initialize(currentUser, resourcePoolId);
                    });
            }

            function decreaseElementCellNumericValue(cell) {
                userFactory.updateElementCellNumericValue(cell, 'decrease');
                $rootScope.$broadcast('resourcePoolEditor_elementCellNumericValueDecreased', cell);
                saveChanges();
            }

            function decreaseElementMultiplier(element) {
                userFactory.updateElementMultiplier(element, 'decrease');
                $rootScope.$broadcast('resourcePoolEditor_elementMultiplierDecreased', element);
                saveChanges();
            }

            function decreaseElementCellMultiplier(elementCell) {
                userFactory.updateElementCellMultiplier(elementCell, 'decrease');
                $rootScope.$broadcast('resourcePoolEditor_elementCellMultiplierDecreased', element);
                saveChanges();
            }

            function decreaseIndexRating(field) {
                userFactory.updateElementFieldIndexRating(field, 'decrease');
                saveChanges();
            }

            function decreaseResourcePoolRate() {
                userFactory.updateResourcePoolRate(scope.resourcePool, 'decrease');
                saveChanges();
            }

            function editResourcePool() {
                // TODO Instead of having fixed url here, broadcast an 'edit request'?
                $location.url('/_system/resourcePool/' + scope.resourcePoolId + '/edit');
            }

            function increaseElementCellNumericValue(cell) {
                $rootScope.$broadcast('resourcePoolEditor_elementCellNumericValueIncreased', cell);
                userFactory.updateElementCellNumericValue(cell, 'increase');
                saveChanges();
            }

            function increaseElementMultiplier(element) {
                userFactory.updateElementMultiplier(element, 'increase');
                $rootScope.$broadcast('resourcePoolEditor_elementMultiplierIncreased', element);
                saveChanges();
            }

            function increaseElementCellMultiplier(elementCell) {
                userFactory.updateElementCellMultiplier(elementCell, 'increase');
                $rootScope.$broadcast('resourcePoolEditor_elementCellMultiplierIncreased', element);
                saveChanges();
            }

            function increaseIndexRating(field) {
                userFactory.updateElementFieldIndexRating(field, 'increase');
                saveChanges();
            }

            function increaseResourcePoolRate() {
                userFactory.updateResourcePoolRate(scope.resourcePool, 'increase');
                saveChanges();
            }

            function initialize(user, resourcePoolId) {

                if (scope.currentUser !== user || scope.resourcePoolId !== resourcePoolId) {
                    scope.currentUser = user;
                    scope.resourcePoolId = resourcePoolId;

                    // Clear previous error messages
                    scope.errorMessage = '';

                    scope.chartConfig = {
                        credits: {
                            enabled: false
                        },
                        loading: true,
                        options: {
                            plotOptions: {
                                column: {
                                    allowPointSelect: true,
                                    pointWidth: 15
                                },
                                pie: {
                                    allowPointSelect: true,
                                    cursor: 'pointer',
                                    dataLabels: {
                                        enabled: false
                                    },
                                    showInLegend: true
                                }
                            },
                            tooltip: {
                                headerFormat: ''
                            },
                            xAxis: { categories: [''] },
                            yAxis: {
                                allowDecimals: false,
                                min: 0
                            }
                        },
                        size: {},
                        title: { text: '' }
                    };

                    // Validate
                    if (scope.resourcePoolId === null) {
                        scope.errorMessage = 'CMRP Id cannot be null';
                        scope.chartConfig.loading = false;
                        return;
                    }

                    // Get resource pool
                    resourcePoolFactory.getResourcePoolExpanded(scope.resourcePoolId)
                            .then(function (resourcePool) {

                                if (resourcePool === null) {
                                    scope.errorMessage = 'Invalid CMRP Id';
                                    return;
                                }

                                // It returns an array, set the first item in the list
                                scope.resourcePool = resourcePool;

                                if (scope.resourcePool.selectedElement() !== null) {
                                    loadChartData();
                                }
                            })
                            .catch(function () {
                                // TODO scope.errorMessage ?
                            })
                            .finally(function () {
                                scope.chartConfig.loading = false;
                            });
                }
            }

            function loadChartData() {

                // Current element
                var element = scope.resourcePool.selectedElement();
                var chartData = null;

                if (element === null) {
                    return;
                }

                // Item length check
                if (element.ElementItemSet.length > 20) {
                    return;
                }

                scope.chartConfig.title = { text: element.Name };
                scope.chartConfig.series = [];

                if (scope.displayIndexDetails) {

                    // Pie type
                    scope.chartConfig.title = { text: 'Indexes' };
                    scope.chartConfig.options.chart = { type: 'pie' };
                    scope.chartConfig.options.yAxis.title = { text: '' };

                    chartData = [];
                    element.elementFieldIndexSet().forEach(function (elementFieldIndex) {
                        var chartItem = new ElementFieldIndexChartItem(elementFieldIndex);
                        chartData.push(chartItem);
                    });
                    scope.chartConfig.series = [{ data: chartData }];

                } else {

                    scope.chartConfig.title = { text: element.Name };

                    // TODO Check this rule?
                    if (element === element.ResourcePool.mainElement() && (element.totalIncome() > 0 || element.directIncomeField() !== null)) {

                        // Column type
                        scope.chartConfig.options.chart = { type: 'column' };
                        scope.chartConfig.options.yAxis.title = { text: 'Total Income' };

                        element.ElementItemSet.forEach(function (elementItem) {
                            var chartItem = new ColumnChartItem(elementItem);
                            scope.chartConfig.series.push(chartItem);
                        });
                    } else {

                        // Pie type
                        scope.chartConfig.options.chart = { type: 'pie' };
                        scope.chartConfig.options.yAxis.title = { text: '' };

                        chartData = [];
                        element.ElementItemSet.forEach(function (elementItem) {
                            elementItem.ElementCellSet.forEach(function (elementCell) {
                                if (elementCell.ElementField.IndexEnabled) {
                                    var chartItem = new PieChartItem(elementCell);
                                    chartData.push(chartItem);
                                }
                            });
                        });
                        scope.chartConfig.series = [{ data: chartData }];
                    }
                }
            }

            function resetElementCellNumericValue(cell) {
                userFactory.updateElementCellNumericValue(cell, 'reset');
                $rootScope.$broadcast('resourcePoolEditor_elementCellNumericValueReset', element);
                saveChanges();
            }

            function resetElementMultiplier(element) {
                userFactory.updateElementMultiplier(element, 'reset');
                $rootScope.$broadcast('resourcePoolEditor_elementMultiplierReset', element);
                saveChanges();
            }

            function resetElementCellMultiplier(elementCell) {
                userFactory.updateElementCellMultiplier(elementCell, 'reset');
                $rootScope.$broadcast('resourcePoolEditor_elementCellMultiplierReset', element);
                saveChanges();
            }

            function resetIndexRating(field) {
                userFactory.updateElementFieldIndexRating(field, 'reset');
                saveChanges();
            }

            function resetResourcePoolRate() {
                userFactory.updateResourcePoolRate(scope.resourcePool, 'reset');
                saveChanges();
            }

            function saveChanges() {
                resourcePoolFactory.saveChanges(1500)
                    .catch(function (error) {
                        // Conflict (Concurrency exception)
                        if (typeof error.status !== 'undefined' && error.status === '409') {
                            // TODO Try to recover!
                        } else if (typeof error.entityErrors !== 'undefined') {
                            // config.entityErrors = error.entityErrors;
                        }
                    });
            }

            function saveChangesStart() {
                scope.isSaving = true;
            }

            function saveChangesCompleted() {
                scope.isSaving = false;
            }

            // Index Details
            function toggleIndexDetails() {
                scope.displayIndexDetails = !scope.displayIndexDetails;
                loadChartData();
            }

            function currentUserChanged(event, newUser) {
                initialize(newUser, scope.resourcePoolId);
            }

            /* Chart objects */

            // TODO Store these in a better place?
            // TODO Also test these better, by comparing it with resourcePool.selectedElement() property!
            function ColumnChartItem(elementItem) {
                var self = this;

                Object.defineProperty(self, "name", {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        return elementItem.Name;
                    }
                });

                Object.defineProperty(self, "data", {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        return [elementItem.totalIncome()];
                    }
                });
            }

            function ElementFieldIndexChartItem(elementFieldIndex) {
                var self = this;

                Object.defineProperty(self, "name", {
                    enumerable: true,
                    configurable: true,
                    get: function () { return elementFieldIndex.Name; }
                });

                Object.defineProperty(self, "y", {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        var indexRating = elementFieldIndex.indexRating();
                        // TODO Make rounding better, instead of toFixed + number
                        return Number(indexRating.toFixed(2));
                    }
                });
            }

            function PieChartItem(elementCell) {
                var self = this;

                Object.defineProperty(self, "name", {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        return elementCell.ElementItem.Name;
                    }
                });

                Object.defineProperty(self, "y", {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        var numericValue = elementCell.numericValue();
                        // TODO Make rounding better, instead of toFixed + number
                        return Number(numericValue.toFixed(2));
                    }
                });
            }
        }

        return {
            restrict: 'E',
            templateUrl: '/_system/js/app/directives/resourcePoolEditor/resourcePoolEditor.html?v=0.49.0',
            scope: {
                config: '='
            },
            link: link
        };
    }
})();

//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

(function () {
    'use strict';

    var factoryId = 'resourcePoolFactory';
    angular.module('main')
        .factory(factoryId, ['dataContext', '$rootScope', 'logger', resourcePoolFactory]);

    function resourcePoolFactory(dataContext, $rootScope, logger) {

        // Logger
        logger = logger.forSource(factoryId);

        // To determine whether the data will be fetched from server or local
        var minimumDate = new Date(0);
        var fetchedOn = minimumDate;

        // Factory methods (alphabetically)
        var factory = {
            createResourcePool: createResourcePool,
            deleteResourcePool: deleteResourcePool,
            getChanges: getChanges,
            getChangesCount: getChangesCount,
            getResourcePoolSet: getResourcePoolSet,
            getResourcePool: getResourcePool,
            hasChanges: hasChanges,
            rejectChanges: rejectChanges,
            saveChanges: saveChanges,
            saveChangesAlt: saveChangesAlt
        };

        // User logged out
        $rootScope.$on('userFactory_currentUserChanged', function () {
            fetchedOn = minimumDate;
        });

        return factory;

        /*** Implementations ***/

        function createResourcePool(resourcePool) {
            return dataContext.createEntity('ResourcePool', resourcePool);
        }

        function deleteResourcePool(resourcePool) {
            resourcePool.entityAspect.setDeleted();
        }

        function getChanges() {
            return dataContext.getChanges();
        }

        function getChangesCount() {
            return dataContext.getChangesCount();
        }

        function getResourcePoolSet(forceRefresh) {
            var count;
            if (forceRefresh) {
                if (dataContext.hasChanges()) {
                    count = dataContext.getChangesCount();
                    dataContext.rejectChanges(); // undo all unsaved changes!
                    logger.logWarning('Discarded ' + count + ' pending change(s)', null);
                }
            }

            var query = breeze.EntityQuery
				.from('ResourcePool')
				.expand(['User'])
            ;

            // Fetch the data from server, in case if it's not fetched earlier or forced
            var fetchFromServer = fetchedOn === minimumDate || forceRefresh;

            // Prepare the query
            if (fetchFromServer) { // From remote
                query = query.using(breeze.FetchStrategy.FromServer);
                fetchedOn = new Date();
            }
            else { // From local
                query = query.using(breeze.FetchStrategy.FromLocalCache);
            }

            return dataContext.executeQuery(query)
                .then(success).catch(failed);

            function success(response) {
                count = response.results.length;
                //logger.logSuccess('Got ' + count + ' resourcePool(s)', response);

                // Filter out 'temp' resource pools
                var data = [];
                response.results.forEach(function (item) {
                    if (!item.isTemp) {
                        data.push(item);
                    }
                });

                return data;
            }

            function failed(error) {
                var message = error.message || 'ResourcePool query failed';
                logger.logError(message, error, true);
            }
        }

        function getResourcePool(resourcePoolId, forceRefresh) {
            return dataContext.fetchEntityByKey('ResourcePool', resourcePoolId, !forceRefresh)
                .then(success).catch(failed);

            function success(result) {
                return result.entity;
            }

            function failed(error) {
                var message = error.message || 'getResourcePool query failed';
                logger.logError(message, error, true);
            }
        }

        function hasChanges() {
            return dataContext.hasChanges();
        }

        function rejectChanges() {
            dataContext.rejectChanges();
        }

        function saveChanges(delay) {
            return dataContext.saveChanges(delay);
        }

        function saveChangesAlt(resourcePool, delay) {
            return dataContext.saveChangesAlt(resourcePool.getEntities(), delay);
        }
    }
})();

//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

(function () {
    'use strict';

    var factoryId = 'userFactory';
    angular.module('main')
        .factory(factoryId, ['dataContext', '$rootScope', 'logger', userFactory]);

    function userFactory(dataContext, $rootScope, logger) {
        
		// Logger
		logger = logger.forSource(factoryId);

        // To determine whether the data will be fetched from server or local
        var minimumDate = new Date(0);
        var fetchedOn = minimumDate;

        // Factory methods (alphabetically)
        var factory = {
            createUser: createUser,
            deleteUser: deleteUser,
            getChanges: getChanges,
            getChangesCount: getChangesCount,
            getUserSet: getUserSet,
            getUser: getUser,
            hasChanges: hasChanges,
            rejectChanges: rejectChanges,
            saveChanges: saveChanges,
            saveChangesAlt: saveChangesAlt
        };

        // User logged out
        $rootScope.$on('userFactory_currentUserChanged', function () {
            fetchedOn = minimumDate;
        });

        return factory;

        /*** Implementations ***/

        function createUser(user) {
            return dataContext.createEntity('Users', user);
        }

        function deleteUser(user) {
            user.entityAspect.setDeleted();
        }

        function getChanges() {
            return dataContext.getChanges();
        }

        function getChangesCount() {
            return dataContext.getChangesCount();
        }

        function getUserSet(forceRefresh) {
            var count;
            if (forceRefresh) {
                if (dataContext.hasChanges()) {
                    count = dataContext.getChangesCount();
                    dataContext.rejectChanges(); // undo all unsaved changes!
                    logger.logWarning('Discarded ' + count + ' pending change(s)', null);
                }
            }

            var query = breeze.EntityQuery
				.from('Users')
            ;

            // Fetch the data from server, in case if it's not fetched earlier or forced
            var fetchFromServer = fetchedOn === minimumDate || forceRefresh;

            // Prepare the query
            if (fetchFromServer) { // From remote
                query = query.using(breeze.FetchStrategy.FromServer);
                fetchedOn = new Date();
            }
            else { // From local
                query = query.using(breeze.FetchStrategy.FromLocalCache);
            }

            return dataContext.executeQuery(query)
                .then(success).catch(failed);

            function success(response) {
                count = response.results.length;
                //logger.logSuccess('Got ' + count + ' user(s)', response);
                return response.results;
            }

            function failed(error) {
                var message = error.message || 'User query failed';
                logger.logError(message, error, true);
            }
        }

        function getUser(userId, forceRefresh) {
            return dataContext.fetchEntityByKey('User', userId, !forceRefresh)
                .then(success).catch(failed);

            function success(result) {
                return result.entity;
            }

            function failed(error) {
                var message = error.message || 'getUser query failed';
                logger.logError(message, error, true);
            }
        }

        function hasChanges() {
            return dataContext.hasChanges();
        }

        function rejectChanges() {
            dataContext.rejectChanges();
        }

        function saveChanges(delay) {
            return dataContext.saveChanges(delay);
        }

        function saveChangesAlt(user, delay) {

            var entities = [user];

            // TODO This approach is not good, controller should directly pass 'entities', otherwise factory cannot know whether it should only pass 'parent entity' or with its 'children'?'
            // Compare this with resourcePoolFactory saveChanges, use same approach
            // coni2k - 15 Feb. '16

            return dataContext.saveChangesAlt(entities, delay);
        }
    }
})();

(function () {
    'use strict';

    var controllerId = 'FairShareIndexSampleController';
    angular.module('main')
        .controller(controllerId, ['userFactory', 'logger', FairShareIndexSampleController]);

    function FairShareIndexSampleController(userFactory, logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
    }
})();

(function () {
    'use strict';

    var controllerId = 'ResourcePoolRateSampleController';
    angular.module('main')
        .controller(controllerId, ['logger', ResourcePoolRateSampleController]);

    function ResourcePoolRateSampleController(logger) {

        logger = logger.forSource(controllerId);

        var vm = this;
        vm.resourcePoolRate_SampleResourcePoolId = 12;
    }
})();
