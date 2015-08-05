/// <reference path="Commons.js" />

describe('ng-tests ElementField', function () {

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

    it('numericValueMultiplied', function () {

        // Case 1: Initial
        var resourcePool = new ResourcePool();

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];

        var decimalField = new ElementField();
        decimalField.Element = element;
        decimalField.ElementFieldType = 11;
        decimalField.IndexEnabled = true;
        element.ElementFieldSet = [decimalField];

        expect(decimalField.numericValueMultiplied()).toBe(0);

        // Case 2: Add the multiplier field and the first item
        var multiplierField = new ElementField();
        multiplierField.Element = element;
        multiplierField.ElementFieldType = 12;
        element.ElementFieldSet.push(multiplierField);

        var item1 = new ElementItem();
        item1.Element = element;
        element.ElementItemSet = [item1];

        var decimalCell1 = new ElementCell();
        decimalCell1.ElementField = decimalField;
        decimalCell1.ElementItem = item1;
        decimalCell1.NumericValue = 50;
        decimalField.ElementCellSet = [decimalCell1];
        item1.ElementCellSet = [decimalCell1];

        var multiplierCell1 = new ElementCell();
        multiplierCell1.ElementField = multiplierField;
        multiplierCell1.ElementItem = item1;
        multiplierField.ElementCellSet = [multiplierCell1];
        item1.ElementCellSet.push(multiplierCell1);

        var userMultiplierCell1 = new UserElementCell();
        userMultiplierCell1.ElementCell = multiplierCell1;
        userMultiplierCell1.DecimalValue = 5;
        multiplierCell1.UserElementCellSet = [userMultiplierCell1];

        expect(decimalField.numericValueMultiplied()).toBe(250);

        // Case 3: Add the second item
        var item2 = new ElementItem();
        item2.Element = element;
        element.ElementItemSet = [item2];

        var decimalCell2 = new ElementCell();
        decimalCell2.ElementField = decimalField;
        decimalCell2.ElementItem = item2;
        decimalCell2.NumericValue = 150;
        decimalField.ElementCellSet.push(decimalCell2);
        item2.ElementCellSet = [decimalCell2];

        var multiplierCell2 = new ElementCell();
        multiplierCell2.ElementField = multiplierField;
        multiplierCell2.ElementItem = item2;
        multiplierField.ElementCellSet.push(multiplierCell2);
        item2.ElementCellSet.push(multiplierCell2);

        var userMultiplierCell2 = new UserElementCell();
        userMultiplierCell2.ElementCell = multiplierCell2;
        userMultiplierCell2.DecimalValue = 15;
        multiplierCell2.UserElementCellSet = [userMultiplierCell2];

        expect(decimalField.numericValueMultiplied()).toBe(2500);

        // TODO Update / remove cases

    });

    it('passiveRatingPercentage', function () {

        // Case 1: Initial
        var resourcePool = new ResourcePool();

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];

        var decimalField = new ElementField();
        decimalField.Element = element;
        decimalField.ElementFieldType = 11;
        decimalField.IndexEnabled = true;
        element.ElementFieldSet = [decimalField];

        expect(decimalField.passiveRatingPercentage()).toBe(0);

        // Case 2: Add the multiplier field and the first item
        var multiplierField = new ElementField();
        multiplierField.Element = element;
        multiplierField.ElementFieldType = 12;
        element.ElementFieldSet.push(multiplierField);

        var item1 = new ElementItem();
        item1.Element = element;
        element.ElementItemSet = [item1];

        var decimalCell1 = new ElementCell();
        decimalCell1.ElementField = decimalField;
        decimalCell1.ElementItem = item1;
        decimalCell1.NumericValue = 50;
        decimalField.ElementCellSet = [decimalCell1];
        item1.ElementCellSet = [decimalCell1];

        var multiplierCell1 = new ElementCell();
        multiplierCell1.ElementField = multiplierField;
        multiplierCell1.ElementItem = item1;
        multiplierField.ElementCellSet = [multiplierCell1];
        item1.ElementCellSet.push(multiplierCell1);

        var userMultiplierCell1 = new UserElementCell();
        userMultiplierCell1.ElementCell = multiplierCell1;
        userMultiplierCell1.DecimalValue = 5;
        multiplierCell1.UserElementCellSet = [userMultiplierCell1];

        expect(decimalField.passiveRatingPercentage()).toBe(1);

        // Case 3: Add the second item
        var item2 = new ElementItem();
        item2.Element = element;
        element.ElementItemSet = [item2];

        var decimalCell2 = new ElementCell();
        decimalCell2.ElementField = decimalField;
        decimalCell2.ElementItem = item2;
        decimalCell2.NumericValue = 150;
        decimalField.ElementCellSet.push(decimalCell2);
        item2.ElementCellSet = [decimalCell2];

        var multiplierCell2 = new ElementCell();
        multiplierCell2.ElementField = multiplierField;
        multiplierCell2.ElementItem = item2;
        multiplierField.ElementCellSet.push(multiplierCell2);
        item2.ElementCellSet.push(multiplierCell2);

        var userMultiplierCell2 = new UserElementCell();
        userMultiplierCell2.ElementCell = multiplierCell2;
        userMultiplierCell2.DecimalValue = 15;
        multiplierCell2.UserElementCellSet = [userMultiplierCell2];

        // TODO Will always be 100%?
        expect(decimalField.passiveRatingPercentage()).toBe(1);

        // TODO Update / remove cases

    });

    it('referenceRatingMultiplied', function () {

        // Case 1: Initial
        var resourcePool = new ResourcePool();

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];

        var decimalField = new ElementField();
        decimalField.Element = element;
        decimalField.ElementFieldType = 11;
        decimalField.IndexEnabled = true;
        element.ElementFieldSet = [decimalField];

        expect(decimalField.referenceRatingMultiplied()).toBe(0);

        // Case 2: Add the multiplier field and the first item
        var multiplierField = new ElementField();
        multiplierField.Element = element;
        multiplierField.ElementFieldType = 12;
        element.ElementFieldSet.push(multiplierField);

        var item1 = new ElementItem();
        item1.Element = element;
        element.ElementItemSet = [item1];

        var decimalCell1 = new ElementCell();
        decimalCell1.ElementField = decimalField;
        decimalCell1.ElementItem = item1;
        decimalCell1.NumericValue = 50;
        decimalField.ElementCellSet = [decimalCell1];
        item1.ElementCellSet = [decimalCell1];

        var multiplierCell1 = new ElementCell();
        multiplierCell1.ElementField = multiplierField;
        multiplierCell1.ElementItem = item1;
        multiplierField.ElementCellSet = [multiplierCell1];
        item1.ElementCellSet.push(multiplierCell1);

        var userMultiplierCell1 = new UserElementCell();
        userMultiplierCell1.ElementCell = multiplierCell1;
        userMultiplierCell1.DecimalValue = 5;
        multiplierCell1.UserElementCellSet = [userMultiplierCell1];

        expect(decimalField.referenceRatingMultiplied()).toBe(250);

        // Case 3: Add the second item
        var item2 = new ElementItem();
        item2.Element = element;
        element.ElementItemSet = [item2];

        var decimalCell2 = new ElementCell();
        decimalCell2.ElementField = decimalField;
        decimalCell2.ElementItem = item2;
        decimalCell2.NumericValue = 150;
        decimalField.ElementCellSet.push(decimalCell2);
        item2.ElementCellSet = [decimalCell2];

        var multiplierCell2 = new ElementCell();
        multiplierCell2.ElementField = multiplierField;
        multiplierCell2.ElementItem = item2;
        multiplierField.ElementCellSet.push(multiplierCell2);
        item2.ElementCellSet.push(multiplierCell2);

        var userMultiplierCell2 = new UserElementCell();
        userMultiplierCell2.ElementCell = multiplierCell2;
        userMultiplierCell2.DecimalValue = 15;
        multiplierCell2.UserElementCellSet = [userMultiplierCell2];

        expect(decimalField.referenceRatingMultiplied()).toBe(2250);

        // TODO Update / remove cases
        // TODO field.IndexRatingSortType = 2 case?

    });

    it('aggressiveRating', function () {

        // Case 1: Initial
        var resourcePool = new ResourcePool();

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];

        var decimalField = new ElementField();
        decimalField.Element = element;
        decimalField.ElementFieldType = 11;
        decimalField.IndexEnabled = true;
        element.ElementFieldSet = [decimalField];

        expect(decimalField.aggressiveRating()).toBe(0);

        // Case 2: Add the multiplier field and the first item
        var multiplierField = new ElementField();
        multiplierField.Element = element;
        multiplierField.ElementFieldType = 12;
        element.ElementFieldSet.push(multiplierField);

        var item1 = new ElementItem();
        item1.Element = element;
        element.ElementItemSet = [item1];

        var decimalCell1 = new ElementCell();
        decimalCell1.ElementField = decimalField;
        decimalCell1.ElementItem = item1;
        decimalCell1.NumericValue = 50;
        decimalField.ElementCellSet = [decimalCell1];
        item1.ElementCellSet = [decimalCell1];

        var multiplierCell1 = new ElementCell();
        multiplierCell1.ElementField = multiplierField;
        multiplierCell1.ElementItem = item1;
        multiplierField.ElementCellSet = [multiplierCell1];
        item1.ElementCellSet.push(multiplierCell1);

        var userMultiplierCell1 = new UserElementCell();
        userMultiplierCell1.ElementCell = multiplierCell1;
        userMultiplierCell1.DecimalValue = 5;
        multiplierCell1.UserElementCellSet = [userMultiplierCell1];

        expect(decimalField.aggressiveRating()).toBe(1);

        // Case 3: Add the second item
        var item2 = new ElementItem();
        item2.Element = element;
        element.ElementItemSet = [item2];

        var decimalCell2 = new ElementCell();
        decimalCell2.ElementField = decimalField;
        decimalCell2.ElementItem = item2;
        decimalCell2.NumericValue = 150;
        decimalField.ElementCellSet.push(decimalCell2);
        item2.ElementCellSet = [decimalCell2];

        var multiplierCell2 = new ElementCell();
        multiplierCell2.ElementField = multiplierField;
        multiplierCell2.ElementItem = item2;
        multiplierField.ElementCellSet.push(multiplierCell2);
        item2.ElementCellSet.push(multiplierCell2);

        var userMultiplierCell2 = new UserElementCell();
        userMultiplierCell2.ElementCell = multiplierCell2;
        userMultiplierCell2.DecimalValue = 15;
        multiplierCell2.UserElementCellSet = [userMultiplierCell2];

        expect(decimalField.aggressiveRating()).toBe(1 - (250 / 2250) + 1 - (2250 / 2250));

        // TODO Update / remove cases
        // TODO field.IndexRatingSortType = 2 case?

    });

    it('userElementField', function () {

        // Case 1: Initial
        var resourcePool = new ResourcePool();

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];

        var decimalField = new ElementField();
        decimalField.Element = element;
        decimalField.ElementFieldType = 4;
        element.ElementFieldSet = [decimalField];

        expect(decimalField.userElementField()).toBe(null);

        // Case 2: Add user element field
        var userDecimalField = new UserElementField();
        userDecimalField.ElementField = decimalField;
        decimalField.UserElementFieldSet = [userDecimalField];

        expect(decimalField.userElementField()).toBe(userDecimalField);

        // TODO Update / remove cases

    });

    it('currentUserIndexRating', function () {

        // Case 1: Initial
        var resourcePool = new ResourcePool();

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];

        var decimalField = new ElementField();
        decimalField.Element = element;
        decimalField.ElementFieldType = 4;
        element.ElementFieldSet = [decimalField];

        expect(decimalField.currentUserIndexRating()).toBe(50);

        // Case 2: Add user element field
        var userDecimalField = new UserElementField();
        userDecimalField.ElementField = decimalField;
        userDecimalField.Rating = 25;
        decimalField.UserElementFieldSet = [userDecimalField];

        // TODO Manually update?!
        decimalField.setCurrentUserIndexRating();

        expect(decimalField.currentUserIndexRating()).toBe(25);

        // TODO Update / remove cases

    });

    it('otherUsersIndexRatingTotal', function () {

        // Case 1: Initial
        var resourcePool = new ResourcePool();

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];

        var decimalField = new ElementField();
        decimalField.Element = element;
        decimalField.ElementFieldType = 4;
        element.ElementFieldSet = [decimalField];

        expect(decimalField.otherUsersIndexRatingTotal()).toBe(0);

        // Case 2: Without user rating
        decimalField.IndexRating = 25;

        // TODO Manually update?!
        decimalField.setOtherUsersIndexRatingTotal();

        expect(decimalField.otherUsersIndexRatingTotal()).toBe(25);

        // Case 3: With user rating
        var userDecimalField = new UserElementField();
        userDecimalField.ElementField = decimalField;
        userDecimalField.Rating = 10;
        decimalField.UserElementFieldSet = [userDecimalField];

        // TODO Manually update?!
        decimalField.setOtherUsersIndexRatingTotal();

        expect(decimalField.otherUsersIndexRatingTotal()).toBe(15);

        // TODO Update / remove cases

    });

    it('otherUsersIndexRatingCount', function () {

        // Case 1: Initial
        var resourcePool = new ResourcePool();

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];

        var decimalField = new ElementField();
        decimalField.Element = element;
        decimalField.ElementFieldType = 4;
        element.ElementFieldSet = [decimalField];

        expect(decimalField.otherUsersIndexRatingCount()).toBe(0);

        // Case 2: Without user rating
        decimalField.IndexRatingCount = 3;

        // TODO Manually update?!
        decimalField.setOtherUsersIndexRatingCount();

        expect(decimalField.otherUsersIndexRatingCount()).toBe(3);

        // Case 3: With user rating
        var userDecimalField = new UserElementField();
        userDecimalField.ElementField = decimalField;
        userDecimalField.Rating = 10;
        decimalField.UserElementFieldSet = [userDecimalField];

        // TODO Manually update?!
        decimalField.setOtherUsersIndexRatingCount();

        expect(decimalField.otherUsersIndexRatingCount()).toBe(2);

        // TODO Update / remove cases

    });

    it('indexRatingTotal', function () {

        // Case 1: Initial
        var resourcePool = new ResourcePool();

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];

        var decimalField = new ElementField();
        decimalField.Element = element;
        decimalField.ElementFieldType = 4;
        element.ElementFieldSet = [decimalField];

        expect(decimalField.indexRatingTotal()).toBe(50);

        // Case 2: Without user rating
        decimalField.IndexRating = 25;

        // TODO Manually update?!
        decimalField.setOtherUsersIndexRatingTotal();

        expect(decimalField.indexRatingTotal()).toBe(75);

        // Case 3: With user rating
        var userDecimalField = new UserElementField();
        userDecimalField.ElementField = decimalField;
        userDecimalField.Rating = 10;
        decimalField.UserElementFieldSet = [userDecimalField];

        // TODO Manually update?!
        decimalField.setCurrentUserIndexRating();

        expect(decimalField.indexRatingTotal()).toBe(35);

        // TODO Update / remove cases

    });

    it('indexRatingCount', function () {

        // Case 1: Initial
        var resourcePool = new ResourcePool();

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];

        var decimalField = new ElementField();
        decimalField.Element = element;
        decimalField.ElementFieldType = 4;
        element.ElementFieldSet = [decimalField];

        expect(decimalField.indexRatingCount()).toBe(1);

        // Case 2: Without user rating
        decimalField.IndexRatingCount = 3;

        // TODO Manually update?!
        decimalField.setOtherUsersIndexRatingCount();

        expect(decimalField.indexRatingCount()).toBe(4);

        // Case 3: With user rating
        var userDecimalField = new UserElementField();
        userDecimalField.ElementField = decimalField;
        userDecimalField.Rating = 10;
        decimalField.UserElementFieldSet = [userDecimalField];

        expect(decimalField.indexRatingCount()).toBe(4);

        // TODO Update / remove cases

    });

    it('indexRatingAverage', function () {

        // Case 1: Initial
        var resourcePool = new ResourcePool();

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];

        var decimalField = new ElementField();
        decimalField.Element = element;
        decimalField.ElementFieldType = 4;
        element.ElementFieldSet = [decimalField];

        expect(decimalField.indexRatingAverage()).toBe(50);

        // Case 2: Without user rating
        decimalField.IndexRating = 75;
        decimalField.IndexRatingCount = 3;

        // TODO Manually update?!
        decimalField.setOtherUsersIndexRatingTotal();
        decimalField.setOtherUsersIndexRatingCount();

        expect(decimalField.indexRatingAverage()).toBe(125 / 4);

        // Case 3: With user rating
        var userDecimalField = new UserElementField();
        userDecimalField.ElementField = decimalField;
        userDecimalField.Rating = 10;
        decimalField.UserElementFieldSet = [userDecimalField];

        // TODO Manually update?!
        decimalField.setCurrentUserIndexRating();

        expect(decimalField.indexRatingAverage()).toBe(85 / 4);

        // TODO Update / remove cases

    });

    it('indexRating - RatingMode 1', function () {

        // Case 1: Initial
        var resourcePool = new ResourcePool();
        resourcePool.RatingMode = 1;

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];

        var decimalField = new ElementField();
        decimalField.Element = element;
        decimalField.ElementFieldType = 4;
        element.ElementFieldSet = [decimalField];

        expect(decimalField.indexRating()).toBe(50);

        // Case 2: Without user rating
        decimalField.IndexRating = 75;
        decimalField.IndexRatingCount = 3;

        // TODO Manually update?!
        decimalField.setOtherUsersIndexRatingTotal();
        decimalField.setOtherUsersIndexRatingCount();

        expect(decimalField.indexRating()).toBe(50);

        // Case 3: With user rating
        var userDecimalField = new UserElementField();
        userDecimalField.ElementField = decimalField;
        userDecimalField.Rating = 10;
        decimalField.UserElementFieldSet = [userDecimalField];

        // TODO Manually update?!
        decimalField.setCurrentUserIndexRating();
        decimalField.setIndexRating();

        expect(decimalField.indexRating()).toBe(10);

        // TODO Update / remove cases

    });

    it('indexRating - RatingMode 2', function () {

        // Case 1: Initial
        var resourcePool = new ResourcePool();
        resourcePool.RatingMode = 2;

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];

        var decimalField = new ElementField();
        decimalField.Element = element;
        decimalField.ElementFieldType = 4;
        element.ElementFieldSet = [decimalField];

        expect(decimalField.indexRating()).toBe(50);

        // Case 2: Without user rating
        decimalField.IndexRating = 75;
        decimalField.IndexRatingCount = 3;

        // TODO Manually update?!
        decimalField.setOtherUsersIndexRatingTotal();
        decimalField.setOtherUsersIndexRatingCount();
        decimalField.setIndexRating();

        expect(decimalField.indexRating()).toBe(125 / 4);

        // Case 3: With user rating
        var userDecimalField = new UserElementField();
        userDecimalField.ElementField = decimalField;
        userDecimalField.Rating = 10;
        decimalField.UserElementFieldSet = [userDecimalField];

        // TODO Manually update?!
        decimalField.setCurrentUserIndexRating();
        decimalField.setIndexRating();

        expect(decimalField.indexRating()).toBe(85 / 4);

        // TODO Update / remove cases

    });

    it('indexRatingPercentage', function () {

        // Case 1: Initial
        var resourcePool = new ResourcePool();

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];
        resourcePool.MainElement = element;

        var decimalField1 = new ElementField();
        decimalField1.Element = element;
        decimalField1.ElementFieldType = 4;
        decimalField1.IndexEnabled = true;
        element.ElementFieldSet = [decimalField1];

        expect(decimalField1.indexRatingPercentage()).toBe(1);

        // Case 2: With ratings
        var userDecimalField1 = new UserElementField();
        userDecimalField1.ElementField = decimalField1;
        userDecimalField1.Rating = 25;
        decimalField1.UserElementFieldSet = [userDecimalField1];

        // TODO Manually update?!
        decimalField1.setCurrentUserIndexRating();
        decimalField1.setIndexRating();

        expect(decimalField1.indexRatingPercentage()).toBe(1);

        // Case 3: Second index
        var decimalField2 = new ElementField();
        decimalField2.Element = element;
        decimalField2.ElementFieldType = 4;
        decimalField2.IndexEnabled = true;
        element.ElementFieldSet.push(decimalField2);

        var userDecimalField2 = new UserElementField();
        userDecimalField2.ElementField = decimalField2;
        userDecimalField2.Rating = 75;
        decimalField2.UserElementFieldSet = [userDecimalField2];

        // TODO Manually update?!
        element.setElementFieldIndexSet();

        expect(decimalField1.indexRatingPercentage()).toBe(0.25);
        expect(decimalField2.indexRatingPercentage()).toBe(0.75);

        // TODO Update / remove cases

    });

    it('indexIncome', function () {

        // TODO !

        // Case 1: Initial
        var resourcePool = new ResourcePool();

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];
        resourcePool.MainElement = element;

        var decimalField1 = new ElementField();
        decimalField1.Element = element;
        decimalField1.ElementFieldType = 4;
        decimalField1.IndexEnabled = true;
        element.ElementFieldSet = [decimalField1];

        expect(decimalField1.indexIncome()).toBe(0);

        // Case 2: With ratings
        var userDecimalField1 = new UserElementField();
        userDecimalField1.ElementField = decimalField1;
        userDecimalField1.Rating = 25;
        decimalField1.UserElementFieldSet = [userDecimalField1];

        // TODO Manually update?!
        decimalField1.setCurrentUserIndexRating();
        decimalField1.setIndexRating();

        expect(decimalField1.indexRatingPercentage()).toBe(1);

        // Case 3: Second index
        var decimalField2 = new ElementField();
        decimalField2.Element = element;
        decimalField2.ElementFieldType = 4;
        decimalField2.IndexEnabled = true;
        element.ElementFieldSet.push(decimalField2);

        var userDecimalField2 = new UserElementField();
        userDecimalField2.ElementField = decimalField2;
        userDecimalField2.Rating = 75;
        decimalField2.UserElementFieldSet = [userDecimalField2];

        // TODO Manually update?!
        element.setElementFieldIndexSet();

        expect(decimalField1.indexRatingPercentage()).toBe(0.25);
        expect(decimalField2.indexRatingPercentage()).toBe(0.75);


        // Case 1: Initial
        var resourcePool = new ResourcePool();

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];
        resourcePool.MainElement = element;

        expect(element.totalResourcePoolAmount()).toBe(0);

        // Case 2: Add the fields, first item and the cell
        var item1 = new ElementItem();
        item1.Element = element;
        element.ElementItemSet = [item1];

        // DirectIncome field
        var directIncomeField = new ElementField();
        directIncomeField.Element = element;
        directIncomeField.ElementFieldType = 11;
        element.ElementFieldSet = [directIncomeField];

        var multiplierField = new ElementField();
        multiplierField.Element = element;
        multiplierField.ElementFieldType = 12;
        element.ElementFieldSet.push(multiplierField);

        // DirectIncome cell
        var directIncomeCell = new ElementCell();
        directIncomeCell.ElementField = directIncomeField;
        directIncomeCell.ElementItem = item1;
        directIncomeCell.NumericValue = 50;
        directIncomeField.ElementCellSet = [directIncomeCell];
        item1.ElementCellSet = [directIncomeCell];

        var multiplierCell1 = new ElementCell();
        multiplierCell1.ElementField = multiplierField;
        multiplierCell1.ElementItem = item1;
        multiplierField.ElementCellSet = [multiplierCell1];
        item1.ElementCellSet.push(multiplierCell1);

        var userMultiplierCell1 = new UserElementCell();
        userMultiplierCell1.ElementCell = multiplierCell1;
        userMultiplierCell1.DecimalValue = 5;
        multiplierCell1.UserElementCellSet = [userMultiplierCell1];

        expect(element.totalResourcePoolAmount()).toBe(25);

        // Case 3: Add the second item
        var item2 = new ElementItem();
        item2.Element = element;
        element.ElementItemSet.push(item2);

        var directIncomeCell2 = new ElementCell();
        directIncomeCell2.ElementField = directIncomeField;
        directIncomeCell2.ElementItem = item2;
        directIncomeCell2.NumericValue = 150;
        directIncomeField.ElementCellSet.push(directIncomeCell2);
        item2.ElementCellSet = [directIncomeCell2];

        var multiplierCell2 = new ElementCell();
        multiplierCell2.ElementField = multiplierField;
        multiplierCell2.ElementItem = item2;
        multiplierField.ElementCellSet = [multiplierCell2];
        item2.ElementCellSet.push(multiplierCell2);

        var userMultiplierCell2 = new UserElementCell();
        userMultiplierCell2.ElementCell = multiplierCell2;
        userMultiplierCell2.DecimalValue = 15;
        multiplierCell2.UserElementCellSet = [userMultiplierCell2];

        expect(element.totalResourcePoolAmount()).toBe(250);

        // TODO Update / remove

    });
    
    // Old test, review!
    it('ElementField - single', function () {

        var resourcePool1 = new ResourcePool();
        resourcePool1.ResourcePoolRateTotal = 15;
        resourcePool1.ResourcePoolRateCount = 1;
        resourcePool1.UseFixedResourcePoolRate = true;
        resourcePool1.RatingMode = 1; // Only my ratings
        resourcePool1.InitialValue = 500;

        var element1 = new Element();
        element1.ResourcePool = resourcePool1;
        resourcePool1.ElementSet = [element1];
        resourcePool1.MainElement = element1;

        // Fields
        var field1 = new ElementField();
        field1.Element = element1;
        field1.ElementFieldType = 4;
        field1.IndexEnabled = true;
        field1.IndexRating = 130;
        field1.IndexRatingCount = 2;
        element1.ElementFieldSet = [field1];

        expect(field1.currentUserIndexRating()).toBe(50); // No user element field, default value
        expect(field1.otherUsersIndexRatingTotal()).toBe(130);
        expect(field1.otherUsersIndexRatingCount()).toBe(2);
        expect(field1.indexRatingAverage()).toBe(60);
        expect(field1.indexRatingCount()).toBe(3);
        expect(field1.indexRating()).toBe(50);
        expect(field1.indexRatingPercentage()).toBe(1);
        expect(field1.indexIncome()).toBe(500);

        // With all ratings
        resourcePool1.RatingMode = 2;
        field1.setIndexRating(); // TODO Manually update?!

        expect(field1.indexRatingAverage()).toBe(60);
        expect(field1.indexRatingCount()).toBe(3);
        expect(field1.indexRating()).toBe(60);
        expect(field1.indexRatingPercentage()).toBe(1);
        expect(field1.indexIncome()).toBe(500);

        // With user element field & only my ratings
        resourcePool1.RatingMode = 1;

        var userElementField1 = new UserElementField();
        userElementField1.ElementField = field1;
        userElementField1.Rating = 35;
        field1.UserElementFieldSet = [userElementField1];

        // Broadcast ?!
        $rootScope.$broadcast('elementFieldIndexRatingUpdated', { elementField: field1, value: userElementField1.Rating });
        expect(field1.currentUserIndexRating()).toBe(35);
        expect(field1.indexRatingAverage()).toBe(55);
        expect(field1.indexRatingCount()).toBe(3);
        expect(field1.indexRating()).toBe(35);
        expect(field1.indexRatingPercentage()).toBe(1);
        expect(field1.indexIncome()).toBe(500);

        // With all ratings
        resourcePool1.RatingMode = 2;
        field1.setIndexRating(); // TODO Manually update?!

        expect(field1.indexRatingAverage()).toBe(55);
        expect(field1.indexRatingCount()).toBe(3);
        expect(field1.indexRating()).toBe(55);
        expect(field1.indexRatingPercentage()).toBe(1);
        expect(field1.indexIncome()).toBe(500);
    });

    // Old test, review!
    it('ElementField - two indexes', function () {

        var resourcePool1 = new ResourcePool();
        resourcePool1.ResourcePoolRateTotal = 15;
        resourcePool1.ResourcePoolRateCount = 1;
        resourcePool1.UseFixedResourcePoolRate = true;
        resourcePool1.RatingMode = 1; // Only my ratings
        resourcePool1.InitialValue = 500;

        var element1 = new Element();
        element1.ResourcePool = resourcePool1;
        resourcePool1.ElementSet = [element1];
        resourcePool1.MainElement = element1;

        // Fields
        var field1 = new ElementField();
        field1.Element = element1;
        field1.ElementFieldType = 4;
        field1.IndexEnabled = true;
        field1.IndexRating = 130;
        field1.IndexRatingCount = 2;
        element1.ElementFieldSet = [field1];

        var field2 = new ElementField();
        field2.Element = element1;
        field2.ElementFieldType = 4;
        field2.IndexEnabled = true;
        field2.IndexRating = 70;
        field2.IndexRatingCount = 2;
        element1.ElementFieldSet.push(field2);

        expect(field1.otherUsersIndexRatingTotal()).toBe(130);
        expect(field1.otherUsersIndexRatingCount()).toBe(2);
        expect(field1.currentUserIndexRating()).toBe(50); // No user element field, default value
        expect(field1.indexRatingAverage()).toBe(60);
        expect(field1.indexRatingCount()).toBe(3);
        expect(field1.indexRating()).toBe(50);
        expect(field1.indexRatingPercentage()).toBe(0.5);
        expect(field1.indexIncome()).toBe(250);

        expect(field2.otherUsersIndexRatingTotal()).toBe(70);
        expect(field2.otherUsersIndexRatingCount()).toBe(2);
        expect(field2.currentUserIndexRating()).toBe(50); // No user element field, default value
        expect(field2.indexRatingAverage()).toBe(40);
        expect(field2.indexRatingCount()).toBe(3);
        expect(field2.indexRating()).toBe(50);
        expect(field2.indexRatingPercentage()).toBe(0.5);
        expect(field2.indexIncome()).toBe(250);

        // With all ratings
        resourcePool1.RatingMode = 2;
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
        resourcePool1.RatingMode = 1;

        var userElementField1 = new UserElementField();
        userElementField1.ElementField = field1;
        userElementField1.Rating = 35;
        field1.UserElementFieldSet = [userElementField1];
        // Broadcast ?!
        $rootScope.$broadcast('elementFieldIndexRatingUpdated', { elementField: field1, value: userElementField1.Rating });

        var userElementField2 = new UserElementField();
        userElementField2.ElementField = field2;
        userElementField2.Rating = 65;
        field2.UserElementFieldSet = [userElementField2];
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
        resourcePool1.RatingMode = 2;
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

});
