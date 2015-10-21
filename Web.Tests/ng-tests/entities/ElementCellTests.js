/// <reference path="Commons.js" />

describe('ElementCell', function () {

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

    function getSampleResourcePool(addMultiplierField) {
        addMultiplierField = typeof addMultiplierField === 'undefined' ? false : addMultiplierField;

        // ResourcePool
        var resourcePool = new ResourcePool();

        // Element
        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];
        resourcePool.MainElement = element;

        // Item
        var item1 = new ElementItem();
        item1.Element = element;
        element.ElementItemSet = [item1];

        // Decimal field
        var decimalField = new ElementField();
        decimalField.Element = element;
        decimalField.ElementFieldType = 4;
        element.ElementFieldSet = [decimalField];

        // Decimal cell
        var decimalCell = new ElementCell();
        decimalCell.ElementField = decimalField;
        decimalCell.ElementItem = item1;
        decimalField.ElementCellSet = [decimalCell];
        item1.ElementCellSet = [decimalCell];

        // Multiplier field & cell & userCell?
        if (addMultiplierField) {
            var multiplierField = new ElementField();
            multiplierField.Element = element;
            multiplierField.ElementFieldType = 12;
            element.ElementFieldSet.push(multiplierField);

            var multiplierCell = new ElementCell();
            multiplierCell.ElementField = multiplierField;
            multiplierCell.ElementItem = item1;
            multiplierField.ElementCellSet = [multiplierCell];
            item1.ElementCellSet.push(multiplierCell);

            var userMultiplierCell = new UserElementCell();
            userMultiplierCell.ElementCell = multiplierCell;
            multiplierCell.UserElementCellSet = [userMultiplierCell];
            multiplierCell.CurrentUserCell = userMultiplierCell;
        }

        // Return
        return resourcePool;
    }

    function addUserCell(cell, rating) {

        var userCell = new UserElementCell();
        userCell.ElementCell = cell;
        userCell.DecimalValue = rating;
        cell.UserElementCellSet = [userCell];

        // TODO Manually update?!
        cell.CurrentUserCell = userCell;
    }

    // TODO removeUserCell function and related tests?

    it('userCell - Initial', function () {

        var resourcePool = getSampleResourcePool();
        var cell = resourcePool.MainElement.ElementFieldSet[0].ElementCellSet[0];

        expect(cell.CurrentUserCell).toBe(null);
    });

    it('userCell - With user cell', function () {

        var resourcePool = getSampleResourcePool();
        var cell = resourcePool.MainElement.ElementFieldSet[0].ElementCellSet[0];

        // Add user cell
        addUserCell(cell, 10);
        var userCell = cell.UserElementCellSet[0];

        // Assert
        expect(cell.CurrentUserCell).toBe(userCell);

    });

    it('currentUserNumericValue - Initial', function () {

        var resourcePool = getSampleResourcePool();
        var cell = resourcePool.MainElement.ElementFieldSet[0].ElementCellSet[0];

        expect(cell.CurrentUserNumericValue).toBe(50);
    });

    it('currentUserNumericValue - With user cell', function () {

        var resourcePool = getSampleResourcePool();
        var cell = resourcePool.MainElement.ElementFieldSet[0].ElementCellSet[0];

        // Add user cell
        addUserCell(cell, 10);
        var userCell = cell.UserElementCellSet[0];

        // Assert
        expect(cell.CurrentUserNumericValue).toBe(10);
    });

    it('otherUsersNumericValueTotal - Initial', function () {

        var resourcePool = getSampleResourcePool();
        var cell = resourcePool.MainElement.ElementFieldSet[0].ElementCellSet[0];

        expect(cell.otherUsersNumericValueTotal()).toBe(0);
    });

    it('otherUsersNumericValueTotal - Without user rating', function () {

        var resourcePool = getSampleResourcePool();
        var cell = resourcePool.MainElement.ElementFieldSet[0].ElementCellSet[0];
        cell.NumericValueTotal = 25;

        expect(cell.otherUsersNumericValueTotal()).toBe(25);
    });

    it('otherUsersNumericValueTotal - With user rating', function () {

        var resourcePool = getSampleResourcePool();
        var cell = resourcePool.MainElement.ElementFieldSet[0].ElementCellSet[0];
        cell.NumericValueTotal = 25;
        addUserCell(cell, 10);

        expect(cell.otherUsersNumericValueTotal()).toBe(15);
    });

    it('otherUsersNumericValueCount - Initial', function () {

        var resourcePool = getSampleResourcePool();
        var cell = resourcePool.MainElement.ElementFieldSet[0].ElementCellSet[0];

        expect(cell.otherUsersNumericValueCount()).toBe(0);
    });

    it('otherUsersNumericValueCount - Without user rating', function () {

        var resourcePool = getSampleResourcePool();
        var cell = resourcePool.MainElement.ElementFieldSet[0].ElementCellSet[0];
        cell.NumericValueCount = 3;

        expect(cell.otherUsersNumericValueCount()).toBe(3);
    });

    it('otherUsersNumericValueCount - With user rating', function () {

        var resourcePool = getSampleResourcePool();
        var cell = resourcePool.MainElement.ElementFieldSet[0].ElementCellSet[0];
        cell.NumericValueCount = 3;
        addUserCell(cell, 10);

        expect(cell.otherUsersNumericValueCount()).toBe(2);
    });

    it('numericValueTotal - Initial', function () {

        var resourcePool = getSampleResourcePool();
        var cell = resourcePool.MainElement.ElementFieldSet[0].ElementCellSet[0];

        expect(cell.numericValueTotal()).toBe(50);
    });

    it('numericValueTotal - Without user rating', function () {

        var resourcePool = getSampleResourcePool();
        var cell = resourcePool.MainElement.ElementFieldSet[0].ElementCellSet[0];
        cell.NumericValueTotal = 25;

        expect(cell.numericValueTotal()).toBe(25 + 50);
    });

    it('numericValueTotal - Including user rating', function () {

        var resourcePool = getSampleResourcePool();
        var cell = resourcePool.MainElement.ElementFieldSet[0].ElementCellSet[0];
        cell.NumericValueTotal = 25;
        addUserCell(cell, 10);

        expect(cell.numericValueTotal()).toBe(25);
    });

    it('numericValueTotal - Adding user rating', function () {

        var resourcePool = getSampleResourcePool();
        var cell = resourcePool.MainElement.ElementFieldSet[0].ElementCellSet[0];
        cell.NumericValueTotal = 25;

        // Since it needs to calculate the current value (without user cell), call it once
        // TODO This wouldn't be necessary if the server could calculate it and send?
        cell.numericValueTotal();

        // Act
        addUserCell(cell, 10);

        // Assert
        expect(cell.numericValueTotal()).toBe(25 + 10);
    });

    it('numericValueCount - Initial', function () {

        var resourcePool = getSampleResourcePool();
        var cell = resourcePool.MainElement.ElementFieldSet[0].ElementCellSet[0];

        expect(cell.numericValueCount()).toBe(1);
    });

    it('numericValueCount - Without user rating', function () {

        var resourcePool = getSampleResourcePool();
        var cell = resourcePool.MainElement.ElementFieldSet[0].ElementCellSet[0];
        cell.NumericValueCount = 3;

        expect(cell.numericValueCount()).toBe(3 + 1);
    });

    it('numericValueCount - Including user rating', function () {

        var resourcePool = getSampleResourcePool();
        var cell = resourcePool.MainElement.ElementFieldSet[0].ElementCellSet[0];
        cell.NumericValueCount = 3;
        addUserCell(cell, 10);

        expect(cell.numericValueCount()).toBe(3);
    });

    it('numericValueCount - Adding user rating', function () {

        var resourcePool = getSampleResourcePool();
        var cell = resourcePool.MainElement.ElementFieldSet[0].ElementCellSet[0];
        cell.NumericValueCount = 3;

        // Since it needs to calculate the current value (without user cell), call it once
        // TODO This wouldn't be necessary if the server could calculate it and send?
        cell.numericValueCount();

        // Act
        addUserCell(cell, 10);

        // Assert
        expect(cell.numericValueCount()).toBe(3 + 1);
    });

    it('numericValueAverage', function () {

        var resourcePool = getSampleResourcePool();
        var cell = resourcePool.MainElement.ElementFieldSet[0].ElementCellSet[0];
        cell.NumericValueTotal = 75;
        cell.NumericValueCount = 3;

        expect(cell.numericValueAverage()).toBe((75 + 50) / (3 + 1));
    });

    it('numericValue - RatingMode 1 (Default)', function () {

        // Arrange & act - Case 1: RatingMode 1 (Default)
        var resourcePool = getSampleResourcePool();
        var cell = resourcePool.MainElement.ElementFieldSet[0].ElementCellSet[0];
        cell.NumericValueTotal = 75;
        cell.NumericValueCount = 3;

        // Assert
        expect(cell.numericValue()).toBe(cell.CurrentUserNumericValue);

        // Act -  Cast 2: RatingMode 2 & also cache case
        resourcePool.RatingMode = 2;

        // Assert
        expect(cell.numericValue()).toBe(cell.numericValueAverage());
    });

    it('numericValueMultiplied - !IndexEnabled', function () {

        var resourcePool = getSampleResourcePool();
        var cell = resourcePool.MainElement.ElementFieldSet[0].ElementCellSet[0];

        expect(cell.numericValueMultiplied()).toBe(0);
    });

    it('numericValueMultiplied - IndexEnabled, without multiplierCell', function () {

        var resourcePool = getSampleResourcePool();
        var field = resourcePool.MainElement.ElementFieldSet[0];
        field.IndexEnabled = true;
        var cell = field.ElementCellSet[0];

        expect(cell.numericValueMultiplied()).toBe(50);
    });

    it('numericValueMultiplied - IndexEnabled, with multiplierCell', function () {

        var resourcePool = getSampleResourcePool(true);
        var decimalField = resourcePool.MainElement.ElementFieldSet[0];
        decimalField.IndexEnabled = true;
        var decimalCell = decimalField.ElementCellSet[0];
        var multiplierField = resourcePool.MainElement.ElementFieldSet[1];
        var multiplierCell = multiplierField.ElementCellSet[0];
        var userMultiplierCell = multiplierCell.UserElementCellSet[0];
        userMultiplierCell.DecimalValue = 5;

        expect(decimalCell.numericValueMultiplied()).toBe(250);
    });

    it('aggressiveRating', function () {

        // Case 1: Initial
        var resourcePool = new ResourcePool();

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];
        resourcePool.MainElement = element;

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
        resourcePool.MainElement = element;

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
        resourcePool.MainElement = element;

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
        directIncomeField.setIndexIncome();

        // Assert
        expect(directIncomeCell.indexIncome()).toBe(15);

        // TODO Update / remove cases
        // TODO Multiple items?
        // TODO field.IndexRatingSortType = 2 case?

    });

});
