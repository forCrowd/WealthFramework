/// <reference path="Commons.js" />

describe('ng-tests ElementCell', function () {

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

    it('userCell', function () {

        // Case 1: Initial
        var resourcePool = new ResourcePool();

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];
        resourcePool.MainElement = element;

        // Item
        var item1 = new ElementItem();
        item1.Element = element;
        element.ElementItemSet = [item1];

        // Field 1
        var field1 = new ElementField();
        field1.Element = element;
        field1.ElementFieldType = 4;
        element.ElementFieldSet = [field1];

        // Cell 1
        var cell1 = new ElementCell();
        cell1.ElementField = field1;
        cell1.ElementItem = item1;
        field1.ElementCellSet = [cell1];
        item1.ElementCellSet = [cell1];

        expect(cell1.userCell()).toBe(null);

        // Case 2: Add user cell
        var userCell1 = new UserElementCell();
        userCell1.ElementCell = cell1;
        cell1.UserElementCellSet = [userCell1];

        expect(cell1.userCell()).toBe(userCell1);

    });

    it('currentUserNumericValue', function () {

        // Case 1: Initial
        var resourcePool = new ResourcePool();

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];
        resourcePool.MainElement = element;

        // Item
        var item1 = new ElementItem();
        item1.Element = element;
        element.ElementItemSet = [item1];

        // Field 1
        var field1 = new ElementField();
        field1.Element = element;
        field1.ElementFieldType = 4;
        element.ElementFieldSet = [field1];

        // Cell 1
        var cell1 = new ElementCell();
        cell1.ElementField = field1;
        cell1.ElementItem = item1;
        field1.ElementCellSet = [cell1];
        item1.ElementCellSet = [cell1];

        expect(cell1.currentUserNumericValue()).toBe(50);

        // Case 2: Add user cell
        var userCell1 = new UserElementCell();
        userCell1.ElementCell = cell1;
        userCell1.DecimalValue = 25;
        cell1.UserElementCellSet = [userCell1];

        // TODO Manually update?!
        cell1.setCurrentUserNumericValue();

        expect(cell1.currentUserNumericValue()).toBe(25);

        // TODO Remove case!
        // TODO With other field types

    });

    it('otherUsersNumericValueTotal', function () {

        // Case 1: Initial
        var resourcePool = new ResourcePool();

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];
        resourcePool.MainElement = element;

        // Item
        var item1 = new ElementItem();
        item1.Element = element;
        element.ElementItemSet = [item1];

        // Field 1
        var field1 = new ElementField();
        field1.Element = element;
        field1.ElementFieldType = 4;
        element.ElementFieldSet = [field1];

        // Cell 1
        var cell1 = new ElementCell();
        cell1.ElementField = field1;
        cell1.ElementItem = item1;
        field1.ElementCellSet = [cell1];
        item1.ElementCellSet = [cell1];

        expect(cell1.otherUsersNumericValueTotal()).toBe(0);

        // Case 2: Without user rating
        cell1.NumericValue = 25;

        // TODO Manually update?!
        cell1.setOtherUsersNumericValueTotal();

        expect(cell1.otherUsersNumericValueTotal()).toBe(25);

        // Case 3: With user rating
        var userCell1 = new UserElementCell();
        userCell1.ElementCell = cell1;
        userCell1.DecimalValue = 10;
        cell1.UserElementCellSet = [userCell1];

        // TODO Manually update?!
        cell1.setOtherUsersNumericValueTotal();

        expect(cell1.otherUsersNumericValueTotal()).toBe(15);

        // TODO Update / remove cases
        // TODO With other field types

    });

    it('otherUsersNumericValueCount', function () {

        // Case 1: Initial
        var resourcePool = new ResourcePool();

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];
        resourcePool.MainElement = element;

        // Field 1
        var field1 = new ElementField();
        field1.Element = element;
        field1.ElementFieldType = 4;
        element.ElementFieldSet = [field1];

        // Item
        var item1 = new ElementItem();
        item1.Element = element;
        element.ElementItemSet = [item1];

        // Cell 1
        var cell1 = new ElementCell();
        cell1.ElementField = field1;
        cell1.ElementItem = item1;
        field1.ElementCellSet = [cell1];
        item1.ElementCellSet = [cell1];

        expect(cell1.otherUsersNumericValueCount()).toBe(0);

        // Case 2: Without user rating
        cell1.NumericValueCount = 3;

        // TODO Manually update?!
        cell1.setOtherUsersNumericValueCount();

        expect(cell1.otherUsersNumericValueCount()).toBe(3);

        // Case 3: With user rating
        var userCell1 = new UserElementCell();
        userCell1.ElementCell = cell1;
        userCell1.DecimalValue = 10;
        cell1.UserElementCellSet = [userCell1];

        // TODO Manually update?!
        cell1.setOtherUsersNumericValueCount();

        expect(cell1.otherUsersNumericValueCount()).toBe(2);

        // TODO Update / remove cases
        // TODO With other field types

    });

    it('numericValueTotal', function () {

        // Case 1: Initial
        var resourcePool = new ResourcePool();

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];

        // Field 1
        var field1 = new ElementField();
        field1.Element = element;
        field1.ElementFieldType = 4;
        element.ElementFieldSet = [field1];

        // Item
        var item1 = new ElementItem();
        item1.Element = element;
        element.ElementItemSet = [item1];

        // Cell 1
        var cell1 = new ElementCell();
        cell1.ElementField = field1;
        cell1.ElementItem = item1;
        field1.ElementCellSet = [cell1];
        item1.ElementCellSet = [cell1];

        expect(cell1.numericValueTotal()).toBe(50);

        // Case 2: Without user rating
        cell1.NumericValue = 25;

        // TODO Manually update?!
        cell1.setOtherUsersNumericValueTotal();

        expect(cell1.numericValueTotal()).toBe(75);

        // Case 3: With user rating
        var userCell1 = new UserElementCell();
        userCell1.ElementCell = cell1;
        userCell1.DecimalValue = 10;
        cell1.UserElementCellSet = [userCell1];

        // TODO Manually update?!
        cell1.setCurrentUserNumericValue();

        expect(cell1.numericValueTotal()).toBe(35);

        // TODO Update / remove cases
        // TODO With other field types

    });

    it('numericValueCount', function () {

        // Case 1: Initial
        var resourcePool = new ResourcePool();

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];

        // Field 1
        var field1 = new ElementField();
        field1.Element = element;
        field1.ElementFieldType = 4;
        element.ElementFieldSet = [field1];

        // Item
        var item1 = new ElementItem();
        item1.Element = element;
        element.ElementItemSet = [item1];

        // Cell 1
        var cell1 = new ElementCell();
        cell1.ElementField = field1;
        cell1.ElementItem = item1;
        field1.ElementCellSet = [cell1];
        item1.ElementCellSet = [cell1];

        expect(cell1.numericValueCount()).toBe(1);

        // Case 2: Without user rating
        cell1.NumericValueCount = 3;

        // TODO Manually update?!
        cell1.setOtherUsersNumericValueCount();

        expect(cell1.numericValueCount()).toBe(4);

        // Case 3: With user rating
        var userCell1 = new UserElementCell();
        userCell1.ElementCell = cell1;
        userCell1.DecimalValue = 10;
        cell1.UserElementCellSet = [userCell1];

        expect(cell1.numericValueCount()).toBe(4);

        // TODO Update / remove cases

    });

    it('numericValueAverage', function () {

        // Case 1: Initial
        var resourcePool = new ResourcePool();

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];

        // Field 1
        var field1 = new ElementField();
        field1.Element = element;
        field1.ElementFieldType = 4;
        element.ElementFieldSet = [field1];

        // Item
        var item1 = new ElementItem();
        item1.Element = element;
        element.ElementItemSet = [item1];

        // Cell 1
        var cell1 = new ElementCell();
        cell1.ElementField = field1;
        cell1.ElementItem = item1;
        field1.ElementCellSet = [cell1];
        item1.ElementCellSet = [cell1];

        expect(cell1.numericValueAverage()).toBe(50);

        // Case 2: Without user rating
        cell1.NumericValue = 75;
        cell1.NumericValueCount = 3;

        // TODO Manually update?!
        cell1.setOtherUsersNumericValueTotal();
        cell1.setOtherUsersNumericValueCount();

        expect(cell1.numericValueAverage()).toBe(125 / 4);

        // Case 3: With user rating
        var userCell1 = new UserElementCell();
        userCell1.ElementCell = cell1;
        userCell1.DecimalValue = 10;
        cell1.UserElementCellSet = [userCell1];

        // TODO Manually update?!
        cell1.setCurrentUserNumericValue();

        expect(cell1.numericValueAverage()).toBe(85  / 4);

        // TODO Update / remove cases

    });

    it('numericValue - RatingMode 1', function () {

        // Case 1: Initial
        var resourcePool = new ResourcePool();
        resourcePool.RatingMode = 1;

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];

        // Field 1
        var field1 = new ElementField();
        field1.Element = element;
        field1.ElementFieldType = 4;
        element.ElementFieldSet = [field1];

        // Item
        var item1 = new ElementItem();
        item1.Element = element;
        element.ElementItemSet = [item1];

        // Cell 1
        var cell1 = new ElementCell();
        cell1.ElementField = field1;
        cell1.ElementItem = item1;
        field1.ElementCellSet = [cell1];
        item1.ElementCellSet = [cell1];

        expect(cell1.numericValue()).toBe(50);

        // Case 2: Without user rating
        cell1.NumericValue = 75;
        cell1.NumericValueCount = 3;

        // TODO Manually update?!
        cell1.setOtherUsersNumericValueTotal();
        cell1.setOtherUsersNumericValueCount();
        cell1.setNumericValue();

        expect(cell1.numericValue()).toBe(50);

        // Case 3: With user rating
        var userCell1 = new UserElementCell();
        userCell1.ElementCell = cell1;
        userCell1.DecimalValue = 10;
        cell1.UserElementCellSet = [userCell1];

        // TODO Manually update?!
        cell1.setCurrentUserNumericValue();
        cell1.setNumericValue();

        expect(cell1.numericValue()).toBe(10);

        // TODO Update / remove cases

    });

    it('numericValue - RatingMode 2', function () {

        // Case 1: Initial
        var resourcePool = new ResourcePool();
        resourcePool.RatingMode = 2;

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];

        // Field 1
        var field1 = new ElementField();
        field1.Element = element;
        field1.ElementFieldType = 4;
        element.ElementFieldSet = [field1];

        // Item
        var item1 = new ElementItem();
        item1.Element = element;
        element.ElementItemSet = [item1];

        // Cell 1
        var cell1 = new ElementCell();
        cell1.ElementField = field1;
        cell1.ElementItem = item1;
        field1.ElementCellSet = [cell1];
        item1.ElementCellSet = [cell1];

        expect(cell1.numericValue()).toBe(50);

        // Case 2: Without user rating
        cell1.NumericValue = 75;
        cell1.NumericValueCount = 3;

        // TODO Manually update?!
        cell1.setOtherUsersNumericValueTotal();
        cell1.setOtherUsersNumericValueCount();
        cell1.setNumericValue();

        expect(cell1.numericValue()).toBe(125 / 4);

        // Case 3: With user rating
        var userCell1 = new UserElementCell();
        userCell1.ElementCell = cell1;
        userCell1.DecimalValue = 10;
        cell1.UserElementCellSet = [userCell1];

        // TODO Manually update?!
        cell1.setCurrentUserNumericValue();
        cell1.setNumericValue();

        expect(cell1.numericValue()).toBe(85 / 4);

        // TODO Update / remove cases

    });

    it('numericValueMultiplied', function () {

    });

    it('aggressiveRating', function () {

    });

    it('aggressiveRatingPercentage', function () {

    });

    it('passiveRatingPercentage', function () {

    });

    it('indexIncome', function () {

    });

    // Old one
    it('old', function () {

        var resourcePool1 = new ResourcePool();
        resourcePool1.ResourcePoolRateTotal = 10;
        resourcePool1.ResourcePoolRateCount = 1;
        resourcePool1.UseFixedResourcePoolRate = true;
        resourcePool1.RatingMode = 1; // Only my ratings
        resourcePool1.InitialValue = 0;

        var element1 = new Element();
        element1.ResourcePool = resourcePool1;
        resourcePool1.ElementSet = [element1];
        resourcePool1.MainElement = element1;

        // Fields
        var field1 = new ElementField();
        field1.Element = element1;
        field1.ElementFieldType = 4;
        field1.IndexEnabled = true;
        field1.IndexRating = 100;
        field1.IndexRatingCount = 1;
        field1.UseFixedValue = false;
        element1.ElementFieldSet = [field1];

        // Item
        var item1 = new ElementItem();
        item1.Element = element1;
        element1.ElementItemSet = [item1];

        // Cell
        var cell1 = new ElementCell();
        cell1.ElementField = field1;
        cell1.ElementItem = item1;
        cell1.NumericValue = 150;
        cell1.NumericValueCount = 2;
        field1.ElementCellSet = [cell1];
        item1.ElementCellSet = [cell1];

        expect(cell1.otherUsersNumericValueTotal()).toBe(150);
        expect(cell1.otherUsersNumericValueCount()).toBe(2);
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
