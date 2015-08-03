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

    // TODO !

    it('ElementCell', function () {

        var resourcePool1 = new ResourcePool();
        resourcePool1.ResourcePoolRateTotal = 10;
        resourcePool1.ResourcePoolRateCount = 1;
        resourcePool1.UseFixedResourcePoolRate = true;
        resourcePool1.RatingMode = 1; // Only my ratings
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
