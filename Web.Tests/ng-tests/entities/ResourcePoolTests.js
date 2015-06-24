/// <reference path="../../../Web/Scripts/angular.js" />
/// <reference path="../../../Web/Scripts/angular-route.js" />
/// <reference path="../../../Web/Scripts/angular-sanitize.js" />
/// <reference path="../../../Web/Scripts/angular-mocks.js" />
/// <reference path="../../../Web/Scripts/breeze.debug.js" />
/// <reference path="../../../Web/Scripts/breeze.bridge.angular.js" />
/// <reference path="../../../Web/Scripts/toastr.js" />
/// <reference path="../../../Web/App/external/highcharts.js" />
/// <reference path="../../../Web/App/external/highcharts-ng.js" />
/// <reference path="../../../Web/App/external/ui-bootstrap-tpls-0.13.0.min.js" />
/// <reference path="../../../Web/App/main.js" />
/// <reference path="../../../Web/App/logger.js" />
/// <reference path="../../../Web/App/entities/Element.js" />
/// <reference path="../../../Web/App/entities/ElementCell.js" />
/// <reference path="../../../Web/App/entities/ElementField.js" />
/// <reference path="../../../Web/App/entities/ElementItem.js" />
/// <reference path="../../../Web/App/entities/ResourcePool.js" />
/// <reference path="../../../Web/App/entities/UserElementCell.js" />

describe('ng-tests ResourcePool', function () {

    var ResourcePool, $rootScope;
    beforeEach(module('main'));
    beforeEach(function () {
        inject(function ($injector) {

            $rootScope = $injector.get('$rootScope');

            ResourcePool = $injector.get('ResourcePool');
            ResourcePool.prototype.ElementSet = [];
            ResourcePool.prototype.UserResourcePoolSet = [];

            Element = $injector.get('Element');
            ElementField = $injector.get('ElementField');
            ElementItem = $injector.get('ElementItem');
            ElementCell = $injector.get('ElementCell');
        });
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

    it('Sanity checks', function () {

        expect(0).toBe(0);

        var number = 1000000000000000000000000000000000;
        var total = number * number;
        expect(total).toBe(total);

        var resourcePool1 = new ResourcePool();
        var element1 = new Element();
        var elementField1 = new ElementField();
        var elementItem1 = new ElementItem();
        var elementCell1 = new ElementCell();

        expect(resourcePool1).toBeDefined();
        expect(element1).toBeDefined();
        expect(elementField1).toBeDefined();
        expect(elementItem1).toBeDefined();
        expect(elementCell1).toBeDefined();

    });

    it('resourcePoolRate - userResourcePool()', function () {

        var resourcePool1 = new ResourcePool();

        var userResourcePool1 = new UserResourcePool();
        userResourcePool1.ResourcePoolRate = 30;

        userResourcePool1.ResourcePool = resourcePool1;
        resourcePool1.UserResourcePoolSet.push(userResourcePool1);

        expect(resourcePool1.userResourcePool()).not.toBe(null);
        expect(resourcePool1.userResourcePool().ResourcePoolRate).toBe(30);

    });

    it('resourcePoolRate - otherUsers w/o userResourcePool', function () {

        var resourcePool1 = new ResourcePool();
        resourcePool1.ResourcePoolRate = 15;
        resourcePool1.ResourcePoolRateCount = 2;

        expect(resourcePool1.otherUsersResourcePoolRate()).toBe(15);
        expect(resourcePool1.otherUsersResourcePoolRateCount()).toBe(2);
        expect(resourcePool1.otherUsersResourcePoolRateTotal()).toBe(30);

    });

    it('resourcePoolRate - otherUsers w userResourcePool', function () {

        var resourcePool1 = new ResourcePool();
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

    it('resourcePoolRate - only my ratings', function () {

        var resourcePool1 = new ResourcePool();
        resourcePool1.ratingMode = 1; // Only my ratings

        var userResourcePool1 = new UserResourcePool();
        userResourcePool1.ResourcePoolRate = 10;

        userResourcePool1.ResourcePool = resourcePool1;
        resourcePool1.UserResourcePoolSet.push(userResourcePool1);

        expect(resourcePool1.resourcePoolRate()).toBe(10);
    });

    it('resourcePoolRate - all ratings w/o userResourcePool', function () {

        var resourcePool1 = new ResourcePool();
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

    it('resourcePoolRate - all ratings w userResourcePool', function () {

        var resourcePool1 = new ResourcePool();
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

    it('resourcePoolRate - all ratings w late userResourcePool', function () {

        var resourcePool1 = new ResourcePool();
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
        $rootScope.$broadcast('resourcePoolRateUpdated', { resourcePool: resourcePool1, value: userResourcePool1.ResourcePoolRate });
        expect(resourcePool1.currentUserResourcePoolRate()).toBe(30); // Default value

        // Manually update!
        resourcePool1.setResourcePoolRate();

        expect(resourcePool1.resourcePoolRateAverage()).toBe(60 / 3);
        expect(resourcePool1.resourcePoolRateCount()).toBe(3);

    });

    /*
    * element field tests
    * element cell tests
    * initial value?
    * index sort type
    */

});
