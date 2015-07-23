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
            ResourcePool.prototype.MainElement = null;
            ResourcePool.prototype.ElementSet = [];
            ResourcePool.prototype.UserResourcePoolSet = [];

            Element = $injector.get('Element');
            Element.prototype.ResourcePool = null;
            Element.prototype.ElementFieldSet = [];
            Element.prototype.ElementItemSet = [];

            ElementField = $injector.get('ElementField');
            ElementField.prototype.Element = null;
            ElementField.prototype.ElementCellSet = [];
            ElementField.prototype.UserElementFieldSet = [];

            ElementItem = $injector.get('ElementItem');
            ElementItem.prototype.Element = null;
            ElementItem.prototype.ElementCellSet = [];
            ElementItem.prototype.ParentCellSet = [];

            ElementCell = $injector.get('ElementCell');
            ElementCell.prototype.ElementField = null;
            ElementCell.prototype.ElementItem = null;
            ElementCell.prototype.UserElementCellSet = [];

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

    function UserElementField() {
        var self = this;
        self.Element = null;
        self.Rating = 0;
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

        // Just experimental
        var number = 1000000000000000000000000000000000;
        var total = number * number;
        expect(total).toBe(total);

        // Entities
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
        resourcePool1.ResourcePoolRate = 30;
        resourcePool1.ResourcePoolRateCount = 2;

        expect(resourcePool1.otherUsersResourcePoolRate()).toBe(15);
        expect(resourcePool1.otherUsersResourcePoolRateCount()).toBe(2);
        expect(resourcePool1.otherUsersResourcePoolRateTotal()).toBe(30);

    });

    it('resourcePoolRate - otherUsers w userResourcePool', function () {

        var resourcePool1 = new ResourcePool();
        resourcePool1.ResourcePoolRate = 60;
        resourcePool1.ResourcePoolRateCount = 3;

        var userResourcePool1 = new UserResourcePool();
        userResourcePool1.ResourcePool = resourcePool1;
        userResourcePool1.ResourcePoolRate = 30;
        resourcePool1.UserResourcePoolSet.push(userResourcePool1);

        expect(resourcePool1.otherUsersResourcePoolRate()).toBe(15);
        expect(resourcePool1.otherUsersResourcePoolRateCount()).toBe(2);
        expect(resourcePool1.otherUsersResourcePoolRateTotal()).toBe(30);

    });

    it('resourcePoolRate - only my ratings', function () {

        var resourcePool1 = new ResourcePool();
        resourcePool1.ratingMode = 1; // Only my ratings

        var userResourcePool1 = new UserResourcePool();
        userResourcePool1.ResourcePool = resourcePool1;
        userResourcePool1.ResourcePoolRate = 10;
        resourcePool1.UserResourcePoolSet.push(userResourcePool1);

        expect(resourcePool1.resourcePoolRate()).toBe(10);
    });

    it('resourcePoolRate - all ratings w/o userResourcePool', function () {

        var resourcePool1 = new ResourcePool();
        resourcePool1.ResourcePoolRate = 30;
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
        resourcePool1.ResourcePoolRate = 60;
        resourcePool1.ResourcePoolRateCount = 3;
        resourcePool1.UseFixedResourcePoolRate = false;
        resourcePool1.ratingMode = 2; // All ratings

        var userResourcePool1 = new UserResourcePool();
        userResourcePool1.ResourcePool = resourcePool1;
        userResourcePool1.ResourcePoolRate = 30;
        resourcePool1.UserResourcePoolSet.push(userResourcePool1);

        expect(resourcePool1.resourcePoolRate()).toBe(20);
        expect(resourcePool1.resourcePoolRateCount()).toBe(3);

    });

    it('resourcePoolRate - all ratings w late userResourcePool', function () {

        var resourcePool1 = new ResourcePool();
        resourcePool1.ResourcePoolRate = 30;
        resourcePool1.ResourcePoolRateCount = 2;
        resourcePool1.UseFixedResourcePoolRate = false;
        resourcePool1.ratingMode = 2; // All ratings

        expect(resourcePool1.currentUserResourcePoolRate()).toBe(10); // Default value

        expect(resourcePool1.resourcePoolRateAverage()).toBe(40 / 3);
        expect(resourcePool1.resourcePoolRateCount()).toBe(3);

        var userResourcePool1 = new UserResourcePool();
        userResourcePool1.ResourcePool = resourcePool1;
        userResourcePool1.ResourcePoolRate = 30;
        resourcePool1.UserResourcePoolSet.push(userResourcePool1);

        // Broadcast ?!
        $rootScope.$broadcast('resourcePoolRateUpdated', { resourcePool: resourcePool1, value: userResourcePool1.ResourcePoolRate });
        expect(resourcePool1.currentUserResourcePoolRate()).toBe(30); // Default value

        // Manually update!
        resourcePool1.setResourcePoolRate();

        expect(resourcePool1.resourcePoolRateAverage()).toBe(60 / 3);
        expect(resourcePool1.resourcePoolRateCount()).toBe(3);

    });

    it('ElementField - single', function () {

        var resourcePool1 = new ResourcePool();
        resourcePool1.ResourcePoolRate = 15;
        resourcePool1.ResourcePoolRateCount = 1;
        resourcePool1.UseFixedResourcePoolRate = true;
        resourcePool1.ratingMode = 1; // Only my ratings
        resourcePool1.InitialValue = 500;

        var organization = new Element();
        organization.ResourcePool = resourcePool1;
        resourcePool1.ElementSet.push(organization);
        resourcePool1.MainElement = organization;

        // Fields
        var field1 = new ElementField();
        field1.Element = organization;
        field1.ElementFieldType = 4;
        field1.IndexEnabled = true;
        field1.IndexRating = 130;
        field1.IndexRatingCount = 2;
        organization.ElementFieldSet.push(field1);

        expect(field1.otherUsersIndexRating()).toBe(65);
        expect(field1.otherUsersIndexRatingCount()).toBe(2);
        expect(field1.otherUsersIndexRatingTotal()).toBe(130);
        expect(field1.currentUserIndexRating()).toBe(50); // No user element field, default value
        expect(field1.indexRatingAverage()).toBe(60);
        expect(field1.indexRatingCount()).toBe(3);
        expect(field1.indexRating()).toBe(50);
        expect(field1.indexRatingPercentage()).toBe(1);
        expect(field1.indexIncome()).toBe(500);

        // With all ratings
        resourcePool1.ratingMode = 2;
        field1.setIndexRating(); // Manually update

        expect(field1.indexRatingAverage()).toBe(60);
        expect(field1.indexRatingCount()).toBe(3);
        expect(field1.indexRating()).toBe(60);
        expect(field1.indexRatingPercentage()).toBe(1);
        expect(field1.indexIncome()).toBe(500);

        // With user element field & only my ratings
        resourcePool1.ratingMode = 1;

        var userElementField1 = new UserElementField();
        userElementField1.ElementField = field1;
        userElementField1.Rating = 35;
        field1.UserElementFieldSet.push(userElementField1);

        // Broadcast ?!
        $rootScope.$broadcast('elementFieldIndexRatingUpdated', { elementField: field1, value: userElementField1.Rating });
        expect(field1.currentUserIndexRating()).toBe(35);
        expect(field1.indexRatingAverage()).toBe(55);
        expect(field1.indexRatingCount()).toBe(3);
        expect(field1.indexRating()).toBe(35);
        expect(field1.indexRatingPercentage()).toBe(1);
        expect(field1.indexIncome()).toBe(500);

        // With all ratings
        resourcePool1.ratingMode = 2;
        field1.setIndexRating(); // Manually update

        expect(field1.indexRatingAverage()).toBe(55);
        expect(field1.indexRatingCount()).toBe(3);
        expect(field1.indexRating()).toBe(55);
        expect(field1.indexRatingPercentage()).toBe(1);
        expect(field1.indexIncome()).toBe(500);
    })

    it('ElementField - two indexes', function () {

        var resourcePool1 = new ResourcePool();
        resourcePool1.ResourcePoolRate = 15;
        resourcePool1.ResourcePoolRateCount = 1;
        resourcePool1.UseFixedResourcePoolRate = true;
        resourcePool1.ratingMode = 1; // Only my ratings
        resourcePool1.InitialValue = 500;

        var organization = new Element();
        organization.ResourcePool = resourcePool1;
        resourcePool1.ElementSet.push(organization);
        resourcePool1.MainElement = organization;

        // Fields
        var field1 = new ElementField();
        field1.Element = organization;
        field1.ElementFieldType = 4;
        field1.IndexEnabled = true;
        field1.IndexRating = 130;
        field1.IndexRatingCount = 2;
        organization.ElementFieldSet.push(field1);

        var field2 = new ElementField();
        field2.Element = organization;
        field2.ElementFieldType = 4;
        field2.IndexEnabled = true;
        field2.IndexRating = 70;
        field2.IndexRatingCount = 2;
        organization.ElementFieldSet.push(field2);

        expect(field1.otherUsersIndexRating()).toBe(65);
        expect(field1.otherUsersIndexRatingCount()).toBe(2);
        expect(field1.otherUsersIndexRatingTotal()).toBe(130);
        expect(field1.currentUserIndexRating()).toBe(50); // No user element field, default value
        expect(field1.indexRatingAverage()).toBe(60);
        expect(field1.indexRatingCount()).toBe(3);
        expect(field1.indexRating()).toBe(50);
        expect(field1.indexRatingPercentage()).toBe(0.5);
        expect(field1.indexIncome()).toBe(250);

        expect(field2.otherUsersIndexRating()).toBe(35);
        expect(field2.otherUsersIndexRatingCount()).toBe(2);
        expect(field2.otherUsersIndexRatingTotal()).toBe(70);
        expect(field2.currentUserIndexRating()).toBe(50); // No user element field, default value
        expect(field2.indexRatingAverage()).toBe(40);
        expect(field2.indexRatingCount()).toBe(3);
        expect(field2.indexRating()).toBe(50);
        expect(field2.indexRatingPercentage()).toBe(0.5);
        expect(field2.indexIncome()).toBe(250);

        // With all ratings
        resourcePool1.ratingMode = 2;
        field1.setIndexRating(); // Manually update
        field2.setIndexRating(); // Manually update

        expect(field1.indexRatingAverage()).toBe(60);
        expect(field1.indexRatingCount()).toBe(3);
        expect(field1.indexRating()).toBe(60);
        expect(field1.indexRatingPercentage()).toBe(0.6);
        expect(field1.indexIncome()).toBe(300);

        expect(field2.indexRatingAverage()).toBe(40);
        expect(field2.indexRatingCount()).toBe(3);
        expect(field2.indexRating()).toBe(40);
        expect(field2.indexRatingPercentage()).toBe(0.4);
        expect(field2.indexIncome()).toBe(200);

        // With user element field & only my ratings
        resourcePool1.ratingMode = 1;

        var userElementField1 = new UserElementField();
        userElementField1.ElementField = field1;
        userElementField1.Rating = 35;
        field1.UserElementFieldSet.push(userElementField1);
        // Broadcast ?!
        $rootScope.$broadcast('elementFieldIndexRatingUpdated', { elementField: field1, value: userElementField1.Rating });

        var userElementField2 = new UserElementField();
        userElementField2.ElementField = field2;
        userElementField2.Rating = 65;
        field2.UserElementFieldSet.push(userElementField2);
        // Broadcast ?!
        $rootScope.$broadcast('elementFieldIndexRatingUpdated', { elementField: field2, value: userElementField2.Rating });

        expect(field1.currentUserIndexRating()).toBe(35);
        expect(field1.indexRatingAverage()).toBe(55);
        expect(field1.indexRatingCount()).toBe(3);
        expect(field1.indexRating()).toBe(35);
        expect(field1.indexRatingPercentage()).toBe(0.35);
        expect(field1.indexIncome()).toBe(175);

        expect(field2.currentUserIndexRating()).toBe(65);
        expect(field2.indexRatingAverage()).toBe(45);
        expect(field2.indexRatingCount()).toBe(3);
        expect(field2.indexRating()).toBe(65);
        expect(field2.indexRatingPercentage()).toBe(0.65);
        expect(field2.indexIncome()).toBe(325);

        // With all ratings
        resourcePool1.ratingMode = 2;
        field1.setIndexRating(); // Manually update
        field2.setIndexRating(); // Manually update

        expect(field1.indexRatingAverage()).toBe(55);
        expect(field1.indexRatingCount()).toBe(3);
        expect(field1.indexRating()).toBe(55);
        expect(field1.indexRatingPercentage()).toBe(0.55);
        expect(field1.indexIncome()).toBe(275);

        expect(field2.indexRatingAverage()).toBe(45);
        expect(field2.indexRatingCount()).toBe(3);
        expect(field2.indexRating()).toBe(45);
        expect(field2.indexRatingPercentage()).toBe(0.45);
        expect(field2.indexIncome()).toBe(225);

    })

    it('ElementItem - elementCellIndexSet', function () {

        var resourcePool1 = new ResourcePool();

        var element1 = new Element();
        element1.ResourcePool = resourcePool1;
        resourcePool1.ElementSet.push(element1);
        resourcePool1.MainElement = element1;

        // Item
        var item1 = new ElementItem();
        item1.Element = element1;

        // Should have no elements
        expect(item1.elementCellIndexSet().length === 0);

        // Field 1
        var field1 = new ElementField();
        field1.Element = element1;
        field1.IndexEnabled = false;
        element1.ElementFieldSet.push(field1);

        // Cell 1
        var cell1 = new ElementCell();
        cell1.ElementField = field1;
        cell1.ElementItem = item1;
        field1.ElementCellSet.push(cell1);
        item1.ElementCellSet.push(cell1);

        // Still...
        expect(item1.elementCellIndexSet().length === 0);

        // Field 2
        var field2 = new ElementField();
        field2.Element = element1;
        field2.ElementFieldType = 4;
        field2.IndexEnabled = true;
        element1.ElementFieldSet.push(field2);

        // Cell 2
        var cell2 = new ElementCell();
        cell2.ElementField = field2;
        cell2.ElementItem = item1;
        field2.ElementCellSet.push(cell2);
        item1.ElementCellSet.push(cell2);

        // And now 1 item
        expect(item1.elementCellIndexSet().length === 1);
    })

    it('ElementCell - directIncomeCell & directIncome', function () {

        var resourcePool1 = new ResourcePool();

        var element1 = new Element();
        element1.ResourcePool = resourcePool1;
        resourcePool1.ElementSet.push(element1);
        resourcePool1.MainElement = element1;

        // Item
        var item1 = new ElementItem();
        item1.Element = element1;

        // Should have no directIncomeCell() and 0 value
        expect(item1.directIncomeCell()).toBe(null);
        expect(item1.directIncome()).toBe(0);

        // DirectIncome field
        var directIncomeField = new ElementField();
        directIncomeField.Element = element1;
        directIncomeField.ElementFieldType = 11;
        element1.ElementFieldSet.push(directIncomeField);

        // DirectIncome cell
        var directIncomeCell = new ElementCell();
        directIncomeCell.ElementField = directIncomeField;
        directIncomeCell.ElementItem = item1;
        directIncomeCell.NumericValue = 50;
        directIncomeField.ElementCellSet.push(directIncomeCell);
        item1.ElementCellSet.push(directIncomeCell);

        // Now
        expect(item1.directIncomeCell()).not.toBe(null);
        expect(item1.directIncome()).toBe(50);

        // TODO Remove!
    })

    it('ElementCell', function () {

        var resourcePool1 = new ResourcePool();
        resourcePool1.ResourcePoolRate = 10;
        resourcePool1.ResourcePoolRateCount = 1;
        resourcePool1.UseFixedResourcePoolRate = true;
        resourcePool1.ratingMode = 1; // Only my ratings
        resourcePool1.InitialValue = 0;

        var organization = new Element();
        organization.ResourcePool = resourcePool1;
        resourcePool1.ElementSet.push(organization);
        resourcePool1.MainElement = organization;

        // Fields
        var field1 = new ElementField();
        field1.Element = organization;
        field1.ElementFieldType = 4;
        field1.IndexEnabled = true;
        field1.IndexRating = 100;
        field1.IndexRatingCount = 1;
        field1.UseFixedValue = false;
        organization.ElementFieldSet.push(field1);

        // Item
        var item1 = new ElementItem();
        item1.Element = organization;
        
        // Cell
        var cell1 = new ElementCell();
        cell1.ElementField = field1;
        cell1.ElementItem = item1;
        cell1.NumericValue = 150;
        cell1.NumericValueCount = 2;
        field1.ElementCellSet.push(cell1);
        item1.ElementCellSet.push(cell1);

        expect(cell1.otherUsersNumericValue()).toBe(75);
        expect(cell1.otherUsersNumericValueCount()).toBe(2);
        expect(cell1.otherUsersNumericValueTotal()).toBe(150);
        expect(cell1.userCell()).toBe(null);
        expect(cell1.currentUserNumericValue()).toBe(50); // No user element cell, default value
        expect(cell1.numericValueAverage()).toBe(200 / 3);
        expect(cell1.numericValueCount()).toBe(3);
        expect(cell1.numericValue()).toBe(50);
        expect(cell1.numericValueMultiplied()).toBe(50); // No multiplier cell defined, then multiplier value is 1

        //expect(field1.indexRatingPercentage()).toBe(1);
        //expect(field1.indexIncome()).toBe(500);

    })

    /*
    * element cell tests
    * initial value?
    * index sort type
    */

});
