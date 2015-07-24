/// <reference path="Commons.js" />

describe('ng-tests ResourcePool', function () {

    var $rootScope, ResourcePool, Element, ElementField, ElementItem, ElementCell;

    beforeEach(module('main'));

    beforeEach(function () {
        inject(function ($injector) {

            $rootScope = $injector.get('$rootScope');
            ResourcePool = $injector.get('ResourcePool');
            Element = $injector.get('Element');
            ElementField = $injector.get('ElementField');
            ElementItem = $injector.get('ElementItem');
            ElementCell = $injector.get('ElementCell');

            registerPrototypes($injector);

        });
    });

    //displayRatingMode
    //toggleRatingMode
    //ratingModeText
    //userResourcePool
    //currentUserResourcePoolRate
    //otherUsersResourcePoolRate
    //otherUsersResourcePoolRateCount
    //otherUsersResourcePoolRateTotal
    //resourcePoolRateAverage
    //resourcePoolRateCount
    //resourcePoolRate
    //setResourcePoolRate
    //resourcePoolRatePercentage

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

        // TODO Manually update?!
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

        var element1 = new Element();
        element1.ResourcePool = resourcePool1;
        resourcePool1.ElementSet.push(element1);
        resourcePool1.MainElement = element1;

        // Fields
        var field1 = new ElementField();
        field1.Element = element1;
        field1.ElementFieldType = 4;
        field1.IndexEnabled = true;
        field1.IndexRating = 130;
        field1.IndexRatingCount = 2;
        element1.ElementFieldSet.push(field1);

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
        field1.setIndexRating(); // TODO Manually update?!

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
        field1.setIndexRating(); // TODO Manually update?!

        expect(field1.indexRatingAverage()).toBe(55);
        expect(field1.indexRatingCount()).toBe(3);
        expect(field1.indexRating()).toBe(55);
        expect(field1.indexRatingPercentage()).toBe(1);
        expect(field1.indexIncome()).toBe(500);
    });

    it('ElementField - two indexes', function () {

        var resourcePool1 = new ResourcePool();
        resourcePool1.ResourcePoolRate = 15;
        resourcePool1.ResourcePoolRateCount = 1;
        resourcePool1.UseFixedResourcePoolRate = true;
        resourcePool1.ratingMode = 1; // Only my ratings
        resourcePool1.InitialValue = 500;

        var element1 = new Element();
        element1.ResourcePool = resourcePool1;
        resourcePool1.ElementSet.push(element1);
        resourcePool1.MainElement = element1;

        // Fields
        var field1 = new ElementField();
        field1.Element = element1;
        field1.ElementFieldType = 4;
        field1.IndexEnabled = true;
        field1.IndexRating = 130;
        field1.IndexRatingCount = 2;
        element1.ElementFieldSet.push(field1);

        var field2 = new ElementField();
        field2.Element = element1;
        field2.ElementFieldType = 4;
        field2.IndexEnabled = true;
        field2.IndexRating = 70;
        field2.IndexRatingCount = 2;
        element1.ElementFieldSet.push(field2);

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
        field1.setIndexRating(); // TODO Manually update?!
        field2.setIndexRating(); // TODO Manually update?!

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
        field1.setIndexRating(); // TODO Manually update?!
        field2.setIndexRating(); // TODO Manually update?!

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

    });

    it('ElementCell', function () {

        var resourcePool1 = new ResourcePool();
        resourcePool1.ResourcePoolRate = 10;
        resourcePool1.ResourcePoolRateCount = 1;
        resourcePool1.UseFixedResourcePoolRate = true;
        resourcePool1.ratingMode = 1; // Only my ratings
        resourcePool1.InitialValue = 0;

        var element1 = new Element();
        element1.ResourcePool = resourcePool1;
        resourcePool1.ElementSet.push(element1);
        resourcePool1.MainElement = element1;

        // Fields
        var field1 = new ElementField();
        field1.Element = element1;
        field1.ElementFieldType = 4;
        field1.IndexEnabled = true;
        field1.IndexRating = 100;
        field1.IndexRatingCount = 1;
        field1.UseFixedValue = false;
        element1.ElementFieldSet.push(field1);

        // Item
        var item1 = new ElementItem();
        item1.Element = element1;
        element1.ElementItemSet.push(item1);

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

    });

});
