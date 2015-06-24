/// <reference path="../../Web/Scripts/angular.js" />
/// <reference path="../../Web/Scripts/angular-route.js" />
/// <reference path="../../Web/Scripts/angular-sanitize.js" />
/// <reference path="../../Web/Scripts/angular-mocks.js" />
/// <reference path="../../Web/Scripts/breeze.debug.js" />
/// <reference path="../../Web/Scripts/breeze.bridge.angular.js" />
/// <reference path="../../Web/Scripts/toastr.js" />
/// <reference path="../../Web/App/external/highcharts.js" />
/// <reference path="../../Web/App/external/highcharts-ng.js" />
/// <reference path="../../Web/App/external/ui-bootstrap-tpls-0.13.0.min.js" />
/// <reference path="../../Web/App/main.js" />
/// <reference path="../../Web/App/logger.js" />
/// <reference path="../../Web/App/entities/Element.js" />
/// <reference path="../../Web/App/entities/ElementCell.js" />
/// <reference path="../../Web/App/entities/ElementField.js" />
/// <reference path="../../Web/App/entities/ElementItem.js" />
/// <reference path="../../Web/App/entities/ResourcePool.js" />
/// <reference path="../../Web/App/entities/UserElementCell.js" />

describe('ng-tests ResourcePool', function () {

    it('sanity check', function () {

        expect(0).toBe(0);

        var x1 = 1000000; // 1mil
        var x2 = 1000000000; // 1bil
        var x3 = 1000000000000; // 1tril
        var x4 = 1000000000000000; // 1?
        var x5 = 1000000000000000000; // 1?
        var x6 = 1000000000000000000000; // 1?
        var x7 = 1000000000000000000000000; // 1?
        var x8 = 1000000000000000000000000000; // 1?
        var x9 = 1000000000000000000000000000000; // 1?
        var x10 = 1000000000000000000000000000000000; // 1?
        var y = 99;
        var total = x10 * y;

        expect(x1 * y).toBe(x1 * y);
        expect(x2 * y).toBe(x2 * y);
        expect(x3 * y).toBe(x3 * y);
        expect(x4 * y).toBe(x4 * y);
        expect(x5 * y).toBe(x5 * y);
        expect(x6 * y).toBe(x6 * y);
        expect(x7 * y).toBe(x7 * y);
        expect(x8 * y).toBe(x8 * y);
        expect(x9 * y).toBe(x9 * y);

        expect(total).toBe(total);
    });

    function UserResourcePool() {
        var self = this;
        self.ResourcePool = null;
        self.ResourcePoolRate = 0;
        self.entityAspect = {
            entityState: {
                isDetached: function () {
                    return false;
                }
            }
        }
    }

    var resourcePool, rootScope;
    beforeEach(module('main'));
    beforeEach(function () {
        inject(function ($injector) {
            resourcePool = $injector.get('ResourcePool');
            rootScope = $injector.get('$rootScope');

            resourcePool.prototype.ElementSet = [];
            resourcePool.prototype.UserResourcePoolSet = [];

            element = $injector.get('Element');
            elementField = $injector.get('ElementField');
            elementItem = $injector.get('ElementItem');
            elementCell = $injector.get('ElementCell');
        });
    });

    it('Defined?', function () {

        var resourcePool1 = new resourcePool();
        var element1 = new element();
        var elementField1 = new elementField();
        var elementItem1 = new elementItem();
        var elementCell1 = new elementCell();

        expect(resourcePool1).toBeDefined();
        expect(element1).toBeDefined();
        expect(elementField1).toBeDefined();
        expect(elementItem1).toBeDefined();
        expect(elementCell1).toBeDefined();

    });

    it('resourcePoolRate - userResourcePool()', function () {

        var resourcePool1 = new resourcePool();

        var userResourcePool1 = new UserResourcePool();
        userResourcePool1.ResourcePoolRate = 30;

        userResourcePool1.ResourcePool = resourcePool1;
        resourcePool1.UserResourcePoolSet.push(userResourcePool1);

        expect(resourcePool1.userResourcePool()).not.toBe(null);
        expect(resourcePool1.userResourcePool().ResourcePoolRate).toBe(30);

    });

    it('resourcePoolRate - otherUsers w/o userResourcePool', function () {

        var resourcePool1 = new resourcePool();
        resourcePool1.ResourcePoolRate = 15;
        resourcePool1.ResourcePoolRateCount = 2;

        expect(resourcePool1.otherUsersResourcePoolRate()).toBe(15);
        expect(resourcePool1.otherUsersResourcePoolRateCount()).toBe(2);
        expect(resourcePool1.otherUsersResourcePoolRateTotal()).toBe(30);

    });

    it('resourcePoolRate - otherUsers w userResourcePool', function () {

        var resourcePool1 = new resourcePool();
        resourcePool1.ResourcePoolRate = 20;
        resourcePool1.ResourcePoolRateCount = 3;

        var userResourcePool1 = new UserResourcePool();
        userResourcePool1.ResourcePoolRate = 30;

        userResourcePool1.ResourcePool = resourcePool1;
        resourcePool1.UserResourcePoolSet.push(userResourcePool1);

        expect(resourcePool1.otherUsersResourcePoolRate()).toBe(15);
        expect(resourcePool1.otherUsersResourcePoolRateCount()).toBe(2);
        expect(resourcePool1.otherUsersResourcePoolRateTotal()).toBe(30);

    });

    it('resourcePoolRate - resourcePoolRate - only my ratings', function () {

        var resourcePool1 = new resourcePool();
        resourcePool1.ratingMode = 1; // Only my ratings

        var userResourcePool1 = new UserResourcePool();
        userResourcePool1.ResourcePoolRate = 10;

        userResourcePool1.ResourcePool = resourcePool1;
        resourcePool1.UserResourcePoolSet.push(userResourcePool1);

        expect(resourcePool1.resourcePoolRate()).toBe(10);
    });

    it('resourcePoolRate - resourcePoolRate - all ratings w/o userResourcePool', function () {

        var resourcePool1 = new resourcePool();
        resourcePool1.ResourcePoolRate = 15;
        resourcePool1.ResourcePoolRateCount = 2;
        resourcePool1.UseFixedResourcePoolRate = false;
        resourcePool1.ratingMode = 2; // All ratings

        expect(resourcePool1.otherUsersResourcePoolRate()).toBe(15);
        expect(resourcePool1.otherUsersResourcePoolRateCount()).toBe(2);
        expect(resourcePool1.otherUsersResourcePoolRateTotal()).toBe(30);

        expect(resourcePool1.currentUserResourcePoolRate()).toBe(10); // Default value
        expect(resourcePool1.resourcePoolRateAverage()).toBe(40 / 3);
        expect(resourcePool1.resourcePoolRateCount()).toBe(3);

    });

    it('resourcePoolRate - resourcePoolRate - all ratings w userResourcePool', function () {

        var resourcePool1 = new resourcePool();
        resourcePool1.ResourcePoolRate = 20;
        resourcePool1.ResourcePoolRateCount = 3;
        resourcePool1.UseFixedResourcePoolRate = false;
        resourcePool1.ratingMode = 2; // All ratings

        var userResourcePool1 = new UserResourcePool();
        userResourcePool1.ResourcePoolRate = 30;

        userResourcePool1.ResourcePool = resourcePool1;
        resourcePool1.UserResourcePoolSet.push(userResourcePool1);

        expect(resourcePool1.resourcePoolRate()).toBe(20);
        expect(resourcePool1.resourcePoolRateCount()).toBe(3);

    });

    it('resourcePoolRate - resourcePoolRate - all ratings w late userResourcePool', function () {

        var resourcePool1 = new resourcePool();
        resourcePool1.ResourcePoolRate = 15;
        resourcePool1.ResourcePoolRateCount = 2;
        resourcePool1.UseFixedResourcePoolRate = false;
        resourcePool1.ratingMode = 2; // All ratings

        expect(resourcePool1.currentUserResourcePoolRate()).toBe(10); // Default value

        expect(resourcePool1.resourcePoolRateAverage()).toBe(40 / 3);
        expect(resourcePool1.resourcePoolRateCount()).toBe(3);

        var userResourcePool1 = new UserResourcePool();
        userResourcePool1.ResourcePoolRate = 30;

        userResourcePool1.ResourcePool = resourcePool1;
        resourcePool1.UserResourcePoolSet.push(userResourcePool1);

        // Broadcast ?!
        rootScope.$broadcast('resourcePoolRateUpdated', { resourcePool: resourcePool1, value: userResourcePool1.ResourcePoolRate });
        expect(resourcePool1.currentUserResourcePoolRate()).toBe(30); // Default value

        // Manually update!
        resourcePool1.setResourcePoolRate();

        expect(resourcePool1.resourcePoolRateAverage()).toBe(60 / 3);
        expect(resourcePool1.resourcePoolRateCount()).toBe(3);

    });

    it('', function () {


    })

});
