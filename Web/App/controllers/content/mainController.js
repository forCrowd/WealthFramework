(function () {
    'use strict';

    var controllerId = 'mainController';
    angular.module('main')
        .controller(controllerId, ['mainService',
            'userService',
            '$rootScope',
            '$location',
            '$window',
            'logger',

            'resourcePoolFactory', // Just for test, remove
            'resourcePoolService',

            mainController]);

    function mainController(mainService,
        userService,
        $rootScope,
        $location,
        $window,
        logger,

        resourcePoolFactory, // Just for test, remove
        resourcePoolService

        ) {

        // Logger
        logger = logger.forSource(controllerId);

        var vm = this;

        function propertyTests() {
            // TODO Just for test some cases, remove it later!

            vm.resourcePool = new resourcePoolFactory.resourcePool();
            vm.resourcePool.Id = 1;
            vm.resourcePool.testPropGetSet = '1 getSet - after';
            vm.resourcePool.testPropWithEnumConf = '1. withEnumConf - after';
            vm.resourcePool.testPropWithEnumConfBack = '1. withEnumConfBack - after';
            vm.resourcePool.testPropWithEnumConfProt = '1. withEnumConfProt - after';
            vm.resourcePool.testPropWithEnumConfProtBack = '1. withEnumConfProtBack - after';

            logIt(vm.resourcePool);

            /* 2 */

            resourcePoolService.createResourcePool({ Id: 2 })
                .then(function (resourcePool) {

                    vm.resourcePool2 = resourcePool;
                    vm.resourcePool2.testPropGetSet = '2. getSet - after';
                    vm.resourcePool2.testPropWithEnumConf = '2. withEnumConf - after';
                    vm.resourcePool2.testPropWithEnumConfBack = '2. withEnumConfBack - after';
                    vm.resourcePool2.testPropWithEnumConfProt = '2. withEnumConfProt - after';
                    vm.resourcePool2.testPropWithEnumConfProtBack = '2. withEnumConfProtBack - after';

                    logIt(vm.resourcePool2);
                });

            /* 3 */

            resourcePoolService.getResourcePoolExpanded(3)
                .then(function (resourcePool) {

                    vm.resourcePool3 = resourcePool[0];
                    vm.resourcePool3.testPropGetSet = '3. getSet - after';
                    vm.resourcePool3.testPropWithEnumConf = '3. withEnumConf - after';
                    vm.resourcePool3.testPropWithEnumConfBack = '3. withEnumConfBack - after';
                    vm.resourcePool3.testPropWithEnumConfProt = '3. withEnumConfProt - after';
                    vm.resourcePool3.testPropWithEnumConfProtBack = '3. withEnumConfProtBack - after';

                    logIt(vm.resourcePool3);

                    logIt(vm.resourcePool);

                });

            function logIt(resourcePool) {


                //logger.log(resourcePool.Id + ' field', resourcePool.testField);

                //logger.log(resourcePool.Id + ' onlyGet', resourcePool.testPropOnlyGet);

                //logger.log(resourcePool.Id + ' getSet', resourcePool.testPropGetSet);

                //logger.log(resourcePool.Id + ' withEnumConf', resourcePool.testPropWithEnumConf);

                //logger.log(resourcePool.Id + ' withEnumConfBack', resourcePool.testPropWithEnumConfBack);

                //logger.log(resourcePool.Id + ' withEnumConfProt', resourcePool.testPropWithEnumConfProt);

                logger.log(resourcePool.Id + ' withEnumConfProtBack', resourcePool.testPropWithEnumConfProtBack);

                logger.log(resourcePool.Id + ' resourcePool', resourcePool);
            }
        }

        function undefinedAndNullTests() {
            // 1) vm.test is not defined yet
            logger.log('1) vm.test is not defined yet');

            var testIsUndefined = typeof vm.test === 'undefined';
            var testIsNull = vm.test === null;

            logger.log('1) testIsUndefined', testIsUndefined);
            logger.log('1) testIsNull', testIsNull);

            if (vm.test) {
                logger.log('1) vm.test is true');
            } else {
                logger.log('1) vm.test is false');
            }
            logger.log('');

            // 2) vm.test is now defined as null
            logger.log('2) vm.test is now defined as null');

            vm.test = null;

            var testIsUndefined = typeof vm.test === 'undefined';
            var testIsNull = vm.test === null;

            logger.log('2) testIsUndefined', testIsUndefined);
            logger.log('2) testIsNull', testIsNull);

            if (vm.test) {
                logger.log('2) vm.test is true');
            } else {
                logger.log('2) vm.test is false');
            }
            logger.log('');

            // 3) vm.test is now defined as {}
            logger.log('3) vm.test is now defined as {}');

            vm.test = {};

            var testIsUndefined = typeof vm.test === 'undefined';
            var testIsNull = vm.test === null;

            logger.log('3) testIsUndefined', testIsUndefined);
            logger.log('3) testIsNull', testIsNull);

            if (vm.test) {
                logger.log('3) vm.test is true');
            } else {
                logger.log('3) vm.test is false');
            }
            logger.log('');

            // 4) vm.test is now defined as false
            logger.log('// 4) vm.test is now defined as false');

            vm.test = false;

            var testIsUndefined = typeof vm.test === 'undefined';
            var testIsNull = vm.test === null;

            logger.log('4) testIsUndefined', testIsUndefined);
            logger.log('4) testIsNull', testIsNull);

            if (vm.test) {
                logger.log('4) vm.test is true');
            } else {
                logger.log('4) vm.test is false');
            }
            logger.log('');
        }

        /* */

        vm.applicationInfo = null;
        vm.currentDate = new Date();
        vm.logout = logout;
        vm.resetSampleData = resetSampleData;
        vm.userInfo = null;

        initialize();

        function initialize() {
            getApplicationInfo();
            getUserInfo();

            // User logged in
            $rootScope.$on('userLoggedIn', function () {
                getUserInfo();
            });

            // User logged out
            $rootScope.$on('userLoggedOut', function () {
                vm.userInfo = null;
            });
        };

        function getApplicationInfo() {
            mainService.getApplicationInfo()
                .then(function (applicationInfo) {
                    vm.applicationInfo = applicationInfo;
                });
        }

        function getUserInfo() {
            userService.getUserInfo()
                .then(function (userInfo) {
                    if (userInfo === null) {
                        return;
                    }

                    vm.userInfo = userInfo;
                }, function () {
                    // TODO Error?
                });
        }

        function logout() {
            userService.logout()
                .success(function () {
                    $location.path('/');
                });
        }

        function resetSampleData() {
            if (confirm('Are you sure you want to reset your sample data?')) {
                userService.resetSampleData()
                    .success(function () {
                        $location.path('/');
                        logger.logSuccess('Your sample data was reset!', null, true);
                    });
            }
        }
    };
})();
