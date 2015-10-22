/// <reference path="Commons.js" />

describe('ng Cell', function () {

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

    function createResourcePool(addMultiplierField) {

        addMultiplierField = typeof addMultiplierField === 'undefined' ? false : addMultiplierField;

        // ResourcePool
        var resourcePool = new ResourcePool();

        // Element
        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];
        resourcePool.MainElement = element;

        // Decimal field
        var decimalField = new ElementField();
        decimalField.Element = element;
        decimalField.ElementFieldType = 4;
        element.ElementFieldSet = [decimalField];

        // Item
        var item = createItem(element);

        // Decimal cell
        createCell(decimalField, item);

        // Multiplier field & cell & userCell?
        if (addMultiplierField) {
            var multiplierField = new ElementField();
            multiplierField.Element = element;
            multiplierField.ElementFieldType = 12;
            element.ElementFieldSet.push(multiplierField);

            var multiplierCell = new ElementCell();
            multiplierCell.ElementField = multiplierField;
            multiplierCell.ElementItem = item;
            multiplierField.ElementCellSet = [multiplierCell];
            item.ElementCellSet.push(multiplierCell);

            var userMultiplierCell = new UserElementCell();
            userMultiplierCell.ElementCell = multiplierCell;
            userMultiplierCell.DecimalValue = 1;
            multiplierCell.UserElementCellSet = [userMultiplierCell];
            multiplierCell.CurrentUserCell = userMultiplierCell;
        }

        // Return
        return resourcePool;
    }

    function createItem(element) {

        var item = new ElementItem();
        item.Element = element;

        if (element.ElementItemSet.length === 0) {
            element.ElementItemSet = [item];
        } else {
            element.ElementItemSet.push(item);
        }

        return item;
    }

    function createCell(field, item) {

        var cell = new ElementCell();
        cell.ElementField = field;
        cell.ElementItem = item;

        if (field.ElementCellSet.length === 0) {
            field.ElementCellSet = [cell];
        } else {
            field.ElementCellSet.push(cell);
        }

        if (item.ElementCellSet.length === 0) {
            item.ElementCellSet = [cell];
        } else {
            item.ElementCellSet.push(cell);
        }

        return cell;
    }

    function createUserCell(cell, rating) {

        var userCell = new UserElementCell();
        userCell.ElementCell = cell;
        userCell.DecimalValue = rating;
        cell.UserElementCellSet = [userCell];

        // TODO Manually update?!
        cell.CurrentUserCell = userCell;
    }

    // TODO removeUserCell function and related tests?

    it('userCell - Initial', function () {

        var resourcePool = createResourcePool();
        var cell = resourcePool.MainElement.ElementFieldSet[0].ElementCellSet[0];

        expect(cell.CurrentUserCell).toBe(null);
    });

    it('userCell - With user cell', function () {

        var resourcePool = createResourcePool();
        var cell = resourcePool.MainElement.ElementFieldSet[0].ElementCellSet[0];

        // Add user cell
        createUserCell(cell, 10);
        var userCell = cell.UserElementCellSet[0];

        // Assert
        expect(cell.CurrentUserCell).toBe(userCell);

    });

    it('currentUserNumericValue - Initial', function () {

        var resourcePool = createResourcePool();
        var cell = resourcePool.MainElement.ElementFieldSet[0].ElementCellSet[0];

        expect(cell.CurrentUserNumericValue).toBe(50);
    });

    it('currentUserNumericValue - With user cell', function () {

        var resourcePool = createResourcePool();
        var cell = resourcePool.MainElement.ElementFieldSet[0].ElementCellSet[0];

        // Add user cell
        createUserCell(cell, 10);
        var userCell = cell.UserElementCellSet[0];

        // Assert
        expect(cell.CurrentUserNumericValue).toBe(10);
    });

    it('otherUsersNumericValueTotal - Initial', function () {

        var resourcePool = createResourcePool();
        var cell = resourcePool.MainElement.ElementFieldSet[0].ElementCellSet[0];

        expect(cell.otherUsersNumericValueTotal()).toBe(0);
    });

    it('otherUsersNumericValueTotal - Without user rating', function () {

        var resourcePool = createResourcePool();
        var cell = resourcePool.MainElement.ElementFieldSet[0].ElementCellSet[0];
        cell.NumericValueTotal = 25;

        expect(cell.otherUsersNumericValueTotal()).toBe(25);
    });

    it('otherUsersNumericValueTotal - With user rating', function () {

        var resourcePool = createResourcePool();
        var cell = resourcePool.MainElement.ElementFieldSet[0].ElementCellSet[0];
        cell.NumericValueTotal = 25;
        createUserCell(cell, 10);

        expect(cell.otherUsersNumericValueTotal()).toBe(15);
    });

    it('otherUsersNumericValueCount - Initial', function () {

        var resourcePool = createResourcePool();
        var cell = resourcePool.MainElement.ElementFieldSet[0].ElementCellSet[0];

        expect(cell.otherUsersNumericValueCount()).toBe(0);
    });

    it('otherUsersNumericValueCount - Without user rating', function () {

        var resourcePool = createResourcePool();
        var cell = resourcePool.MainElement.ElementFieldSet[0].ElementCellSet[0];
        cell.NumericValueCount = 3;

        expect(cell.otherUsersNumericValueCount()).toBe(3);
    });

    it('otherUsersNumericValueCount - With user rating', function () {

        var resourcePool = createResourcePool();
        var cell = resourcePool.MainElement.ElementFieldSet[0].ElementCellSet[0];
        cell.NumericValueCount = 3;
        createUserCell(cell, 10);

        expect(cell.otherUsersNumericValueCount()).toBe(2);
    });

    it('numericValueTotal - Initial', function () {

        var resourcePool = createResourcePool();
        var cell = resourcePool.MainElement.ElementFieldSet[0].ElementCellSet[0];

        expect(cell.numericValueTotal()).toBe(50);
    });

    it('numericValueTotal - Without user rating', function () {

        var resourcePool = createResourcePool();
        var cell = resourcePool.MainElement.ElementFieldSet[0].ElementCellSet[0];
        cell.NumericValueTotal = 25;

        expect(cell.numericValueTotal()).toBe(25 + 50);
    });

    it('numericValueTotal - Including user rating', function () {

        var resourcePool = createResourcePool();
        var cell = resourcePool.MainElement.ElementFieldSet[0].ElementCellSet[0];
        cell.NumericValueTotal = 25;
        createUserCell(cell, 10);

        expect(cell.numericValueTotal()).toBe(25);
    });

    it('numericValueTotal - Adding user rating', function () {

        var resourcePool = createResourcePool();
        var cell = resourcePool.MainElement.ElementFieldSet[0].ElementCellSet[0];
        cell.NumericValueTotal = 25;

        // Since it needs to calculate the current value (without user cell), call it once
        // TODO This wouldn't be necessary if the server could calculate it and send?
        cell.numericValueTotal();

        // Act
        createUserCell(cell, 10);

        // Assert
        expect(cell.numericValueTotal()).toBe(25 + 10);
    });

    it('numericValueCount - Initial', function () {

        var resourcePool = createResourcePool();
        var cell = resourcePool.MainElement.ElementFieldSet[0].ElementCellSet[0];

        expect(cell.numericValueCount()).toBe(1);
    });

    it('numericValueCount - Without user rating', function () {

        var resourcePool = createResourcePool();
        var cell = resourcePool.MainElement.ElementFieldSet[0].ElementCellSet[0];
        cell.NumericValueCount = 3;

        expect(cell.numericValueCount()).toBe(3 + 1);
    });

    it('numericValueCount - Including user rating', function () {

        var resourcePool = createResourcePool();
        var cell = resourcePool.MainElement.ElementFieldSet[0].ElementCellSet[0];
        cell.NumericValueCount = 3;
        createUserCell(cell, 10);

        expect(cell.numericValueCount()).toBe(3);
    });

    it('numericValueCount - Adding user rating', function () {

        var resourcePool = createResourcePool();
        var cell = resourcePool.MainElement.ElementFieldSet[0].ElementCellSet[0];
        cell.NumericValueCount = 3;

        // Since it needs to calculate the current value (without user cell), call it once
        // TODO This wouldn't be necessary if the server could calculate it and send?
        cell.numericValueCount();

        // Act
        createUserCell(cell, 10);

        // Assert
        expect(cell.numericValueCount()).toBe(3 + 1);
    });

    it('numericValueAverage', function () {

        var resourcePool = createResourcePool();
        var cell = resourcePool.MainElement.ElementFieldSet[0].ElementCellSet[0];
        cell.NumericValueTotal = 75;
        cell.NumericValueCount = 3;

        expect(cell.numericValueAverage()).toBe((75 + 50) / (3 + 1));
    });

    it('numericValue', function () {

        // Arrange & act - Case 1: RatingMode 1 (Default)
        var resourcePool = createResourcePool();
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

    it('numericValueMultiplied - Without multiplierCell', function () {

        var resourcePool = createResourcePool();
        var field = resourcePool.MainElement.ElementFieldSet[0];
        var cell = field.ElementCellSet[0];

        expect(cell.numericValueMultiplied()).toBe(50 * 1);
    });

    it('numericValueMultiplied - With multiplierCell', function () {

        var resourcePool = createResourcePool(true);
        var decimalField = resourcePool.MainElement.ElementFieldSet[0];
        var decimalCell = decimalField.ElementCellSet[0];

        expect(decimalCell.numericValueMultiplied()).toBe(50 * 1); // This time 1 is coming from userCell

        // Case 2: Cached value
        // TODO Actually this case belongs to ElementItemTests.js - setMultiplier() test?
        var userMultiplierCell = resourcePool.MainElement.ElementFieldSet[1].ElementCellSet[0].UserElementCellSet[0];
        userMultiplierCell.DecimalValue = 5;

        // TODO Manually update?!
        var item = resourcePool.MainElement.ElementItemSet[0];
        item.setMultiplier();

        expect(decimalCell.numericValueMultiplied()).toBe(50 * 5);
    });

    it('passiveRatingPercentage - !IndexEnabled', function () {

        var resourcePool = createResourcePool();
        var field = resourcePool.MainElement.ElementFieldSet[0];
        var cell = field.ElementCellSet[0];

        expect(cell.passiveRatingPercentage()).toBe(0);
    });

    it('passiveRatingPercentage - IndexEnabled, One Item', function () {

        var resourcePool = createResourcePool();
        var field = resourcePool.MainElement.ElementFieldSet[0];
        field.IndexEnabled = true;
        var cell = field.ElementCellSet[0];

        expect(cell.passiveRatingPercentage()).toBe(1);
    });

    it('passiveRatingPercentage - IndexEnabled, Two Items', function () {

        var resourcePool = createResourcePool();
        var element = resourcePool.MainElement;

        var field = element.ElementFieldSet[0];
        field.IndexEnabled = true;

        var cell1 = field.ElementCellSet[0];
        createUserCell(cell1, 55);

        var item2 = createItem(element);
        var cell2 = createCell(field, item2);
        createUserCell(cell2, 45);

        expect(cell1.passiveRatingPercentage()).toBe(1 - (55 / (45 + 55)));
        expect(cell2.passiveRatingPercentage()).toBe(1 - (45 / (45 + 55)));
    });

    it('aggressiveRating - !IndexEnabled', function () {

        var resourcePool = createResourcePool();
        var field = resourcePool.MainElement.ElementFieldSet[0];
        var cell = field.ElementCellSet[0];

        expect(cell.aggressiveRating()).toBe(0);
    });

    it('aggressiveRating - RatingSortType 1 (Def.), One Item', function () {

        var resourcePool = createResourcePool();
        var field = resourcePool.MainElement.ElementFieldSet[0];
        field.IndexEnabled = true;
        var cell = field.ElementCellSet[0];

        expect(cell.aggressiveRating()).toBe(1);
    });

    it('aggressiveRating - RatingSortType 1 (Def.), Two Items', function () {

        var resourcePool = createResourcePool();
        var element = resourcePool.MainElement;

        var field = element.ElementFieldSet[0];
        field.IndexEnabled = true;

        var cell1 = field.ElementCellSet[0];
        createUserCell(cell1, 55);

        var item2 = createItem(element);
        var cell2 = createCell(field, item2);
        createUserCell(cell2, 45);

        expect(cell1.aggressiveRating()).toBe(1 - (cell1.numericValueMultiplied() / field.referenceRatingMultiplied()));
        expect(cell2.aggressiveRating()).toBe(1 - (cell2.numericValueMultiplied() / field.referenceRatingMultiplied()));
    });

    it('aggressiveRating - RatingSortType 2, One Item', function () {

        var resourcePool = createResourcePool();
        var field = resourcePool.MainElement.ElementFieldSet[0];
        field.IndexRatingSortType = 2;
        field.IndexEnabled = true;
        var cell = field.ElementCellSet[0];

        expect(cell.aggressiveRating()).toBe(1);
    });

    it('aggressiveRating - RatingSortType 2 (Def.), Two Items', function () {

        var resourcePool = createResourcePool();
        var element = resourcePool.MainElement;

        var field = element.ElementFieldSet[0];
        field.IndexRatingSortType = 2;
        field.IndexEnabled = true;

        var cell1 = field.ElementCellSet[0];
        createUserCell(cell1, 55);

        var item2 = createItem(element);
        var cell2 = createCell(field, item2);
        createUserCell(cell2, 45);

        expect(cell1.aggressiveRating()).toBe(1 - (cell1.passiveRatingPercentage() / field.referenceRatingMultiplied()));
        expect(cell2.aggressiveRating()).toBe(1 - (cell2.passiveRatingPercentage() / field.referenceRatingMultiplied()));
    });

    it('aggressiveRatingPercentage', function () {

        var resourcePool = createResourcePool();
        var element = resourcePool.MainElement;

        var field = element.ElementFieldSet[0];
        field.IndexEnabled = true;

        var cell1 = field.ElementCellSet[0];
        createUserCell(cell1, 55);

        var item2 = createItem(element);
        var cell2 = createCell(field, item2);
        createUserCell(cell2, 45);

        expect(cell1.aggressiveRatingPercentage()).toBe(cell1.aggressiveRating() / field.aggressiveRating());
        expect(cell2.aggressiveRatingPercentage()).toBe(cell2.aggressiveRating() / field.aggressiveRating());
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
