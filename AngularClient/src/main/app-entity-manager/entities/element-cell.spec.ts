import { ElementFieldDataType } from "./enums";
import { TestHelpers } from "./test-helpers";

// TODO: Check all these tests below one more time

describe("main/app-entity-manager/entities/element-cell", () => {

    it("userCell - Initial", () => {

        var cell = TestHelpers.getElementCell();

        expect(cell.currentUserCell()).toBe(null);
    });

    it("userCell - With user cell", () => {

        var cell = TestHelpers.getElementCell();

        // Add user cell
        var userCell = TestHelpers.getUserElementCell(cell);

        // Assert
        expect(cell.currentUserCell()).toBe(userCell);

    });

    it("currentUserNumericValue - Initial", () => {

        var field = TestHelpers.getElementField();
        field.DataType = ElementFieldDataType.Decimal;

        var cell = TestHelpers.getElementCell(field);

        expect(cell.currentUserNumericValue()).toBe(50);
    });

    it("currentUserNumericValue - With user cell", () => {

        var field = TestHelpers.getElementField();
        field.DataType = ElementFieldDataType.Decimal;

        var cell = TestHelpers.getElementCell(field);

        // Add user cell
        var userCell = TestHelpers.getUserElementCell(cell);
        userCell.DecimalValue = 10;

        // Assert
        expect(cell.currentUserNumericValue()).toBe(10);
    });

    it("otherUsersNumericValueTotal - Initial", () => {

        var cell = TestHelpers.getElementCell();

        expect(cell.otherUsersNumericValueTotal()).toBe(0);
    });

    it("otherUsersNumericValueTotal - Without user rating", () => {

        var cell = TestHelpers.getElementCell();
        cell.NumericValueTotal = 25;

        expect(cell.otherUsersNumericValueTotal()).toBe(25);
    });

    it("otherUsersNumericValueTotal - With user rating", () => {

        var field = TestHelpers.getElementField();
        field.DataType = ElementFieldDataType.Decimal;

        var cell = TestHelpers.getElementCell(field);
        cell.NumericValueTotal = 25;

        var userCell = TestHelpers.getUserElementCell(cell);
        userCell.DecimalValue = 10;

        expect(cell.otherUsersNumericValueTotal()).toBe(15);
    });

    it("otherUsersNumericValueCount - Initial", () => {

        var cell = TestHelpers.getElementCell();

        expect(cell.otherUsersNumericValueCount()).toBe(0);
    });

    it("otherUsersNumericValueCount - Without user rating", () => {

        var cell = TestHelpers.getElementCell();
        cell.NumericValueCount = 3;

        expect(cell.otherUsersNumericValueCount()).toBe(3);
    });

    it("otherUsersNumericValueCount - With user rating", () => {

        var cell = TestHelpers.getElementCell();
        cell.NumericValueCount = 3;

        var userCell = TestHelpers.getUserElementCell(cell);
        userCell.DecimalValue = 10;

        expect(cell.otherUsersNumericValueCount()).toBe(2);
    });

    it("numericValueTotal - Initial", () => {

        var field = TestHelpers.getElementField();
        field.DataType = ElementFieldDataType.Decimal;

        var cell = TestHelpers.getElementCell(field);

        expect(cell.numericValueTotal()).toBe(50);
    });

    it("numericValueTotal - Without user rating", () => {

        var field = TestHelpers.getElementField();
        field.DataType = ElementFieldDataType.Decimal;

        var cell = TestHelpers.getElementCell(field);
        cell.NumericValueTotal = 25;

        expect(cell.numericValueTotal()).toBe(25 + 50);
    });

    it("numericValueTotal - Including user rating", () => {

        var field = TestHelpers.getElementField();
        field.DataType = ElementFieldDataType.Decimal;

        var cell = TestHelpers.getElementCell(field);
        cell.NumericValueTotal = 25;

        var userCell = TestHelpers.getUserElementCell(cell);
        userCell.DecimalValue = 10;

        expect(cell.numericValueTotal()).toBe(25);
    });

    it("numericValueTotal - Adding user rating", () => {

        var field = TestHelpers.getElementField();
        field.DataType = ElementFieldDataType.Decimal;

        var cell = TestHelpers.getElementCell(field);
        cell.NumericValueTotal = 25;

        // Since it needs to calculate the current value (without user cell), call it once
        // TODO This wouldn't be necessary if the server could calculate it and send?
        cell.numericValueTotal();

        // Act
        var userCell = TestHelpers.getUserElementCell(cell);
        userCell.DecimalValue = 10;

        // This has to be called manually in order to update the cached value
        // In the application, this is done by updateElementCellDecimalValue method under userService.js
        cell.setCurrentUserNumericValue();

        // Assert
        expect(cell.numericValueTotal()).toBe(25 + 10);
    });

    it("numericValueCount - Initial", () => {

        var cell = TestHelpers.getElementCell();

        expect(cell.numericValueCount()).toBe(1);
    });

    it("numericValueCount - Without user rating", () => {

        var cell = TestHelpers.getElementCell();
        cell.NumericValueCount = 3;

        expect(cell.numericValueCount()).toBe(3 + 1);
    });

    it("numericValueCount - Including user rating", () => {

        var cell = TestHelpers.getElementCell();
        cell.NumericValueCount = 3;

        var userCell = TestHelpers.getUserElementCell(cell);
        userCell.DecimalValue = 10;

        expect(cell.numericValueCount()).toBe(3);
    });

    it("numericValueCount - Adding user rating", () => {

        var cell = TestHelpers.getElementCell();
        cell.NumericValueCount = 3;

        // Since it needs to calculate the current value (without user cell), call it once
        // TODO This wouldn't be necessary if the server could calculate it and send?
        cell.numericValueCount();

        // Act
        var userCell = TestHelpers.getUserElementCell(cell);
        userCell.DecimalValue = 10;

        // Assert
        expect(cell.numericValueCount()).toBe(3 + 1);
    });

    it("numericValueAverage", () => {

        var field = TestHelpers.getElementField();
        field.DataType = ElementFieldDataType.Decimal;

        var cell = TestHelpers.getElementCell(field);
        cell.NumericValueTotal = 75;
        cell.NumericValueCount = 3;

        expect(cell.numericValueAverage()).toBe((75 + 50) / (3 + 1));
    });

    it("numericValue", () => {

        var field = TestHelpers.getElementField();
        field.DataType = ElementFieldDataType.Decimal;

        // Arrange & act - Case 1: RatingMode 1 (Default)
        var cell = TestHelpers.getElementCell(field);
        cell.NumericValueTotal = 75;
        cell.NumericValueCount = 3;

        // Assert
        expect(cell.numericValue()).toBe(cell.currentUserNumericValue());

        // Act -  Cast 2: RatingMode 2 & also cache case
        cell.ElementField.Element.ResourcePool.RatingMode = 2;

        // Assert
        expect(cell.numericValue()).toBe(cell.numericValueAverage());
    });

    it("numericValueMultiplied - Without multiplierCell", () => {

        var field = TestHelpers.getElementField();
        field.DataType = ElementFieldDataType.Decimal;

        var cell = TestHelpers.getElementCell(field);

        expect(cell.numericValueMultiplied()).toBe(50 * 1);
    });

    it("numericValueMultiplied - With multiplierCell", () => {

        var cell = TestHelpers.getElementCell(field);

        var field = cell.ElementField;
        field.DataType = ElementFieldDataType.Decimal;

        var item = cell.ElementItem;

        var multiplierField = TestHelpers.getElementField(item.Element);
        multiplierField.DataType = 12;

        var multiplierCell = TestHelpers.getElementCell(multiplierField, item);

        var userMultiplierCell = TestHelpers.getUserElementCell(multiplierCell);
        userMultiplierCell.DecimalValue = 1;

        expect(cell.numericValueMultiplied()).toBe(cell.numericValue() * item.multiplier());

        // Case 2: Cached value
        // TODO Actually this case belongs to ElementItemTests.js - setMultiplier() test?
        var userMultiplierCell = multiplierField.ElementCellSet[0].UserElementCellSet[0];
        userMultiplierCell.DecimalValue = 5;

        // TODO Manually update?!
        item.setMultiplier();
        cell.setNumericValueMultiplied();

        expect(cell.numericValueMultiplied()).toBe(cell.numericValue() * item.multiplier());
    });

    it("numericValueMultipliedPercentage - !IndexEnabled", () => {

        var cell = TestHelpers.getElementCell();

        expect(cell.numericValueMultipliedPercentage()).toBe(0);
    });

    it("numericValueMultipliedPercentage - IndexEnabled, One Item", () => {

        var cell = TestHelpers.getElementCell();

        var field = cell.ElementField;
        field.DataType = ElementFieldDataType.Decimal;
        field.IndexEnabled = true;

        expect(cell.numericValueMultipliedPercentage()).toBe(1);
    });

    it("numericValueMultipliedPercentage - IndexEnabled, Two Items", () => {

        var cell1 = TestHelpers.getElementCell();

        var field = cell1.ElementField;
        field.DataType = ElementFieldDataType.Decimal;
        field.IndexEnabled = true;

        var userCell1 = TestHelpers.getUserElementCell(cell1);
        userCell1.DecimalValue = 55;

        var item2 = TestHelpers.getElementItem(field.Element);
        var cell2 = TestHelpers.getElementCell(field, item2);
        var userCell2 = TestHelpers.getUserElementCell(cell2);
        userCell2.DecimalValue = 45;

        expect(cell1.numericValueMultipliedPercentage()).toBe(55 / (45 + 55));
        expect(cell2.numericValueMultipliedPercentage()).toBe(45 / (45 + 55));
    });

    it("aggressiveRating - !IndexEnabled", () => {

        var cell = TestHelpers.getElementCell()

        expect(cell.aggressiveRating()).toBe(0);
    });

    it("aggressiveRating - RatingSortType 1 (Def.), One Item", () => {

        var cell = TestHelpers.getElementCell();

        var field = cell.ElementField;
        field.DataType = ElementFieldDataType.Decimal;
        field.IndexEnabled = true;
        field.IndexSortType = 2;

        expect(cell.aggressiveRating()).toBe(1);
    });

    it("aggressiveRating - RatingSortType 1 (Def.), Two Items", () => {

        var cell1 = TestHelpers.getElementCell();

        var field = cell1.ElementField;
        field.DataType = ElementFieldDataType.Decimal;
        field.IndexEnabled = true;
        field.IndexSortType = 2;

        var userCell1 = TestHelpers.getUserElementCell(cell1);
        userCell1.DecimalValue = 55;

        var item2 = TestHelpers.getElementItem(field.Element);
        var cell2 = TestHelpers.getElementCell(field, item2);
        var userCell2 = TestHelpers.getUserElementCell(cell2);
        userCell2.DecimalValue = 45;

        expect(cell1.aggressiveRating()).toBe(1 - (cell1.numericValueMultiplied() / field.referenceRatingMultiplied()));
        expect(cell2.aggressiveRating()).toBe(1 - (cell2.numericValueMultiplied() / field.referenceRatingMultiplied()));
    });

    it("aggressiveRating - IndexSortType 1, One Item", () => {

        var cell = TestHelpers.getElementCell();

        var field = cell.ElementField;
        field.DataType = ElementFieldDataType.Decimal;
        field.IndexSortType = 1;
        field.IndexEnabled = true;

        expect(cell.aggressiveRating()).toBe(0);
    });

    it("aggressiveRating - IndexSortType 1, Two Items", () => {

        var cell1 = TestHelpers.getElementCell();

        var field = cell1.ElementField;
        field.DataType = ElementFieldDataType.Decimal;
        field.IndexSortType = 1;
        field.IndexEnabled = true;

        var userCell1 = TestHelpers.getUserElementCell(cell1);
        userCell1.DecimalValue = 55;

        var item2 = TestHelpers.getElementItem(field.Element);
        var cell2 = TestHelpers.getElementCell(field, item2);
        var userCell2 = TestHelpers.getUserElementCell(cell2);
        userCell2.DecimalValue = 45;

        expect(cell1.aggressiveRating()).toBe(1 - ((1 - cell1.numericValueMultipliedPercentage()) / field.referenceRatingMultiplied()));
        expect(cell2.aggressiveRating()).toBe(1 - ((1 - cell2.numericValueMultipliedPercentage()) / field.referenceRatingMultiplied()));
    });

    // TODO rating tests!

    it("ratingPercentage", () => {

        var cell1 = TestHelpers.getElementCell();

        var field = cell1.ElementField;
        field.DataType = ElementFieldDataType.Decimal;
        field.IndexEnabled = true;
        field.IndexCalculationType = 1;
        field.IndexSortType = 2;

        var userCell1 = TestHelpers.getUserElementCell(cell1);
        userCell1.DecimalValue = 55;

        var item2 = TestHelpers.getElementItem(field.Element);
        var cell2 = TestHelpers.getElementCell(field, item2);
        var userCell2 = TestHelpers.getUserElementCell(cell2);
        userCell2.DecimalValue = 45;

        expect(cell1.ratingPercentage()).toBe(cell1.rating() / field.rating());
        expect(cell2.ratingPercentage()).toBe(cell2.rating() / field.rating());
    });

    it("indexIncome", () => {

        var cell1 = TestHelpers.getElementCell();
        cell1.NumericValueTotal = 55;

        var field = cell1.ElementField;
        field.DataType = 11; // DirectIncome field type
        field.IndexEnabled = true;

        var item2 = TestHelpers.getElementItem(field.Element);
        var cell2 = TestHelpers.getElementCell(field, item2);
        cell2.NumericValueTotal = 45;

        expect(cell1.indexIncome()).toBe(field.indexIncome() * cell1.ratingPercentage());
        expect(cell2.indexIncome()).toBe(field.indexIncome() * cell2.ratingPercentage());
    });

});
