/// <reference path="Commons.js" />

describe('ng-tests ElementCell', function () {

    var ResourcePool, Element, ElementField, ElementItem, ElementCell;

    beforeEach(module('main'));

    beforeEach(function () {
        inject(function ($injector) {

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

        expect(cell1.CurrentUserCell).toBe(null);

        // Case 2: Add user cell
        var userCell1 = new UserElementCell();
        userCell1.ElementCell = cell1;
        cell1.UserElementCellSet = [userCell1];
        cell1.CurrentUserCell = userCell1;

        expect(cell1.CurrentUserCell).toBe(userCell1);

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

        expect(cell1.CurrentUserNumericValue).toBe(50);

        // Case 2: Add user cell
        var userCell1 = new UserElementCell();
        userCell1.ElementCell = cell1;
        userCell1.DecimalValue = 25;
        cell1.UserElementCellSet = [userCell1];
        cell1.CurrentUserCell = userCell1;

        expect(cell1.CurrentUserNumericValue).toBe(25);

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
        cell1.NumericValueTotal = 25;

        // TODO Manually update?!
        cell1.setOtherUsersNumericValueTotal();

        expect(cell1.otherUsersNumericValueTotal()).toBe(25);

        // Case 3: With user rating
        var userCell1 = new UserElementCell();
        userCell1.ElementCell = cell1;
        userCell1.DecimalValue = 10;
        cell1.UserElementCellSet = [userCell1];
        cell1.CurrentUserCell = userCell1;

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
        cell1.CurrentUserCell = userCell1;

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
        cell1.NumericValueTotal = 25;

        // TODO Manually update?!
        cell1.setOtherUsersNumericValueTotal();

        expect(cell1.numericValueTotal()).toBe(75);

        // Case 3: With user rating
        var userCell1 = new UserElementCell();
        userCell1.ElementCell = cell1;
        userCell1.DecimalValue = 10;
        cell1.UserElementCellSet = [userCell1];
        cell1.CurrentUserCell = userCell1;

        // TODO Manually update?!
        cell1.CurrentUserCell = userCell1;
        //cell1.setCurrentUserNumericValue();

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
        cell1.CurrentUserCell = userCell1;

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
        cell1.NumericValueTotal = 75;
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
        cell1.CurrentUserCell = userCell1;

        // TODO Manually update?!
        cell1.CurrentUserCell = userCell1;
        //cell1.setCurrentUserNumericValue();

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
        cell1.NumericValueTotal = 75;
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
        cell1.CurrentUserCell = userCell1;

        // TODO Manually update?!
        cell1.CurrentUserCell = userCell1;
        //cell1.setCurrentUserNumericValue();
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
        cell1.NumericValueTotal = 75;
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
        cell1.CurrentUserCell = userCell1;

        // TODO Manually update?!
        cell1.CurrentUserCell = userCell1;
        //cell1.setCurrentUserNumericValue();
        cell1.setNumericValue();

        expect(cell1.numericValue()).toBe(85 / 4);

        // TODO Update / remove cases

    });

    it('numericValueMultiplied', function () {

        // Case 1: Initial
        var resourcePool = new ResourcePool();

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];

        var decimalField = new ElementField();
        decimalField.Element = element;
        decimalField.ElementFieldType = 4;
        decimalField.IndexEnabled = true;
        element.ElementFieldSet = [decimalField];

        var item1 = new ElementItem();
        item1.Element = element;
        element.ElementItemSet = [item1];

        var decimalCell1 = new ElementCell();
        decimalCell1.ElementField = decimalField;
        decimalCell1.ElementItem = item1;
        decimalCell1.NumericValueTotal = 50;
        decimalField.ElementCellSet = [decimalCell1];
        item1.ElementCellSet = [decimalCell1];

        expect(decimalCell1.numericValueMultiplied()).toBe(50);

        // Case 2: Add the multiplier field and the first item
        var multiplierField = new ElementField();
        multiplierField.Element = element;
        multiplierField.ElementFieldType = 12;
        element.ElementFieldSet.push(multiplierField);

        var multiplierCell1 = new ElementCell();
        multiplierCell1.ElementField = multiplierField;
        multiplierCell1.ElementItem = item1;
        multiplierField.ElementCellSet = [multiplierCell1];
        item1.ElementCellSet.push(multiplierCell1);

        var userMultiplierCell1 = new UserElementCell();
        userMultiplierCell1.ElementCell = multiplierCell1;
        userMultiplierCell1.DecimalValue = 5;
        multiplierCell1.UserElementCellSet = [userMultiplierCell1];
        multiplierCell1.CurrentUserCell = userMultiplierCell1;

        // TODO Manually update?!
        item1.setMultiplier();
        decimalCell1.setNumericValueMultiplied();

        expect(decimalCell1.numericValueMultiplied()).toBe(250);

        // TODO Update / remove cases

    });

    it('aggressiveRating', function () {

        // Case 1: Initial
        var resourcePool = new ResourcePool();

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];

        var decimalField = new ElementField();
        decimalField.Element = element;
        decimalField.ElementFieldType = 4;
        decimalField.IndexEnabled = true;
        element.ElementFieldSet = [decimalField];

        var item1 = new ElementItem();
        item1.Element = element;
        element.ElementItemSet = [item1];

        var decimalCell1 = new ElementCell();
        decimalCell1.ElementField = decimalField;
        decimalCell1.ElementItem = item1;
        decimalCell1.NumericValueTotal = 50;
        decimalField.ElementCellSet = [decimalCell1];
        item1.ElementCellSet = [decimalCell1];

        expect(decimalCell1.aggressiveRating()).toBe(1);

        // Case 2: Add the multiplier field and the first item
        var multiplierField = new ElementField();
        multiplierField.Element = element;
        multiplierField.ElementFieldType = 12;
        element.ElementFieldSet.push(multiplierField);

        var multiplierCell1 = new ElementCell();
        multiplierCell1.ElementField = multiplierField;
        multiplierCell1.ElementItem = item1;
        multiplierField.ElementCellSet = [multiplierCell1];
        item1.ElementCellSet.push(multiplierCell1);

        var userMultiplierCell1 = new UserElementCell();
        userMultiplierCell1.ElementCell = multiplierCell1;
        userMultiplierCell1.DecimalValue = 5;
        multiplierCell1.UserElementCellSet = [userMultiplierCell1];
        multiplierCell1.CurrentUserCell = userMultiplierCell1;

        // TODO Manually update?!
        item1.setMultiplier();
        decimalCell1.setNumericValueMultiplied();

        expect(decimalCell1.aggressiveRating()).toBe(1);

        // TODO Update / remove cases
        // TODO Multiple items?
        // TODO field.IndexRatingSortType = 2 case?

    });

    it('aggressiveRatingPercentage', function () {

        // Case 1: Initial
        var resourcePool = new ResourcePool();

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];

        var decimalField = new ElementField();
        decimalField.Element = element;
        decimalField.ElementFieldType = 4;
        decimalField.IndexEnabled = true;
        element.ElementFieldSet = [decimalField];

        var item1 = new ElementItem();
        item1.Element = element;
        element.ElementItemSet = [item1];

        var decimalCell1 = new ElementCell();
        decimalCell1.ElementField = decimalField;
        decimalCell1.ElementItem = item1;
        decimalCell1.NumericValueTotal = 50;
        decimalField.ElementCellSet = [decimalCell1];
        item1.ElementCellSet = [decimalCell1];

        expect(decimalCell1.aggressiveRatingPercentage()).toBe(1);

        // Case 2: Add the multiplier field and the first item
        var multiplierField = new ElementField();
        multiplierField.Element = element;
        multiplierField.ElementFieldType = 12;
        element.ElementFieldSet.push(multiplierField);

        var multiplierCell1 = new ElementCell();
        multiplierCell1.ElementField = multiplierField;
        multiplierCell1.ElementItem = item1;
        multiplierField.ElementCellSet = [multiplierCell1];
        item1.ElementCellSet.push(multiplierCell1);

        var userMultiplierCell1 = new UserElementCell();
        userMultiplierCell1.ElementCell = multiplierCell1;
        userMultiplierCell1.DecimalValue = 5;
        multiplierCell1.UserElementCellSet = [userMultiplierCell1];
        multiplierCell1.CurrentUserCell = userMultiplierCell1;

        // TODO Manually update?!
        item1.setMultiplier();
        decimalCell1.setNumericValueMultiplied();

        expect(decimalCell1.aggressiveRatingPercentage()).toBe(1);

        // TODO Update / remove cases
        // TODO Multiple items?
        // TODO field.IndexRatingSortType = 2 case?

    });

    it('passiveRatingPercentage', function () {

        // Case 1: Initial
        var resourcePool = new ResourcePool();

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];

        var decimalField = new ElementField();
        decimalField.Element = element;
        decimalField.ElementFieldType = 4;
        decimalField.IndexEnabled = true;
        element.ElementFieldSet = [decimalField];

        var item1 = new ElementItem();
        item1.Element = element;
        element.ElementItemSet = [item1];

        var decimalCell1 = new ElementCell();
        decimalCell1.ElementField = decimalField;
        decimalCell1.ElementItem = item1;
        decimalCell1.NumericValueTotal = 50;
        decimalField.ElementCellSet = [decimalCell1];
        item1.ElementCellSet = [decimalCell1];

        expect(decimalCell1.passiveRatingPercentage()).toBe(1);

        // Case 2: Add the multiplier field and the first item
        var multiplierField = new ElementField();
        multiplierField.Element = element;
        multiplierField.ElementFieldType = 12;
        element.ElementFieldSet.push(multiplierField);

        var multiplierCell1 = new ElementCell();
        multiplierCell1.ElementField = multiplierField;
        multiplierCell1.ElementItem = item1;
        multiplierField.ElementCellSet = [multiplierCell1];
        item1.ElementCellSet.push(multiplierCell1);

        var userMultiplierCell1 = new UserElementCell();
        userMultiplierCell1.ElementCell = multiplierCell1;
        userMultiplierCell1.DecimalValue = 5;
        multiplierCell1.UserElementCellSet = [userMultiplierCell1];
        multiplierCell1.CurrentUserCell = userMultiplierCell1;

        // TODO Manually update?!
        item1.setMultiplier();
        decimalCell1.setNumericValueMultiplied();

        expect(decimalCell1.passiveRatingPercentage()).toBe(1);

        // TODO Update / remove cases
        // TODO Multiple items?
        // TODO field.IndexRatingSortType = 2 case?

    });

    it('indexIncome', function () {

        // Case 1: Initial
        var resourcePool = new ResourcePool();

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];
        resourcePool.MainElement = element;

        var item1 = new ElementItem();
        item1.Element = element;
        element.ElementItemSet = [item1];

        var directIncomeField = new ElementField();
        directIncomeField.Element = element;
        directIncomeField.ElementFieldType = 11;
        directIncomeField.IndexEnabled = true;
        element.ElementFieldSet = [directIncomeField];

        var directIncomeCell = new ElementCell();
        directIncomeCell.ElementField = directIncomeField;
        directIncomeCell.ElementItem = item1;
        directIncomeCell.NumericValueTotal = 50;
        directIncomeField.ElementCellSet = [directIncomeCell];
        item1.ElementCellSet = [directIncomeCell];

        expect(directIncomeCell.indexIncome()).toBe(5);

        // Case 2: Add the multiplier field

        // Multiplier field
        var multiplierField = new ElementField();
        multiplierField.Element = element;
        multiplierField.ElementFieldType = 12;
        element.ElementFieldSet.push(multiplierField);

        // Multiplier cell
        var multiplierCell = new ElementCell();
        multiplierCell.ElementField = multiplierField;
        multiplierCell.ElementItem = item1;
        multiplierField.ElementCellSet = [multiplierCell];
        item1.ElementCellSet.push(multiplierCell);

        // User multiplier cell
        userMultiplierCell1 = new UserElementCell();
        userMultiplierCell1.ElementCell = multiplierCell;
        userMultiplierCell1.DecimalValue = 3;
        multiplierCell.UserElementCellSet = [userMultiplierCell1];
        multiplierCell.CurrentUserCell = userMultiplierCell1;

        // TODO Manually update?!
        item1.setMultiplier();

        // Assert
        expect(directIncomeCell.indexIncome()).toBe(15);

        // TODO Update / remove cases
        // TODO Multiple items?
        // TODO field.IndexRatingSortType = 2 case?

    });

});
