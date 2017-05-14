import { TestHelpers } from "./test-helpers";

// TODO: Check all these tests below one more time

describe("main/app-entity-manager/entities/element-item", () => {

    it("elementCellIndexSet", () => {

        // Item
        var item1 = TestHelpers.getElementItem();

        // Should have no elements
        expect(item1.elementCellIndexSet().length === 0).toBe(true);

        // Field 1
        var field1 = TestHelpers.getElementField(item1.Element);
        field1.IndexEnabled = false;

        // Cell 1
        var cell1 = TestHelpers.getElementCell(field1, item1);

        // Still...
        expect(item1.elementCellIndexSet().length === 0).toBe(true);

        // Field 2
        var field2 = TestHelpers.getElementField(item1.Element);
        field2.DataType = 4;
        field2.IndexEnabled = true;

        // Cell 2
        var cell2 = TestHelpers.getElementCell(field2, item1);

        // TODO Manually update?!
        item1.setElementCellIndexSet();

        // And now 1 item
        expect(item1.elementCellIndexSet().length === 1).toBe(true);
    });

    it("directIncome", () => {

        // Item
        var item1 = TestHelpers.getElementItem();

        // Should have 0 value
        expect(item1.directIncome()).toBe(0);

        // DirectIncome field
        var directIncomeField = TestHelpers.getElementField(item1.Element);
        directIncomeField.DataType = 11;

        // DirectIncome cell
        var directIncomeCell = TestHelpers.getElementCell(directIncomeField, item1);
        directIncomeCell.NumericValueTotal = 50;

        // TODO Manually update?!
        item1.setDirectIncome();

        expect(item1.directIncome()).toBe(50);

        // TODO Remove case!
    });

    it("multiplierCell & multiplier", () => {

        // Item
        var item1 = TestHelpers.getElementItem();

        // Should have "1" as the default value
        expect(item1.multiplier()).toBe(1);

        // Multiplier field
        var multiplierField = TestHelpers.getElementField(item1.Element);
        multiplierField.DataType = 12;

        // Multiplier cell
        var multiplierCell = TestHelpers.getElementCell(multiplierField, item1);
        // multiplierCell.NumericValueTotal = 50;

        // TODO Manually update?!
        item1.setMultiplier();

        // Now should have "0" as the default value
        expect(item1.multiplier()).toBe(0);

        // User multiplier cell
        var userCell = TestHelpers.getUserElementCell(multiplierCell);
        userCell.DecimalValue = 2;

        // TODO Manually update?!
        item1.setMultiplier();

        // Now should "2" as the default value
        expect(item1.multiplier()).toBe(2);

        // TODO Remove case!

    });

    it("totalDirectIncome", () => {

        // Item
        var item1 = TestHelpers.getElementItem();

        // DirectIncome field
        var directIncomeField = TestHelpers.getElementField(item1.Element);
        directIncomeField.DataType = 11;

        // DirectIncome cell
        var directIncomeCell = TestHelpers.getElementCell(directIncomeField, item1);
        directIncomeCell.NumericValueTotal = 25;

        // Multiplier field
        var multiplierField = TestHelpers.getElementField(item1.Element);
        multiplierField.DataType = 12;

        // Multiplier cell
        var multiplierCell = TestHelpers.getElementCell(multiplierField, item1);

        // User multiplier cell
        var userCell = TestHelpers.getUserElementCell(multiplierCell);
        userCell.DecimalValue = 3;

        // Assert
        expect(item1.totalDirectIncome()).toBe(75);

    });

    it("resourcePoolAmount", () => {

        // Item
        var item1 = TestHelpers.getElementItem();

        // DirectIncome field
        var directIncomeField = TestHelpers.getElementField(item1.Element);
        directIncomeField.DataType = 11;

        // DirectIncome cell
        var directIncomeCell = TestHelpers.getElementCell(directIncomeField, item1);
        directIncomeCell.NumericValueTotal = 50;

        // Assert
        expect(item1.resourcePoolAmount()).toBe(5);

    });

    it("totalResourcePoolAmount", () => {

        // Item
        var item1 = TestHelpers.getElementItem();

        // DirectIncome field
        var directIncomeField = TestHelpers.getElementField(item1.Element);
        directIncomeField.DataType = 11;

        // DirectIncome cell
        var directIncomeCell = TestHelpers.getElementCell(directIncomeField, item1);
        directIncomeCell.NumericValueTotal = 50;

        // Multiplier field
        var multiplierField = TestHelpers.getElementField(item1.Element);
        multiplierField.DataType = 12;

        // Multiplier cell
        var multiplierCell = TestHelpers.getElementCell(multiplierField, item1);

        // User multiplier cell
        var userCell = TestHelpers.getUserElementCell(multiplierCell);
        userCell.DecimalValue = 3;

        // Assert
        expect(item1.totalResourcePoolAmount()).toBe(15);

    });

    it("directIncomeIncludingResourcePoolAmount", () => {

        // Item
        var item1 = TestHelpers.getElementItem();

        // DirectIncome field
        var directIncomeField = TestHelpers.getElementField(item1.Element);
        directIncomeField.DataType = 11;

        // DirectIncome cell
        var directIncomeCell = TestHelpers.getElementCell(directIncomeField, item1);
        directIncomeCell.NumericValueTotal = 50;

        // Assert
        expect(item1.directIncomeIncludingResourcePoolAmount()).toBe(55);

    });

    it("totalDirectIncomeIncludingResourcePoolAmount", () => {

        // Item
        var item1 = TestHelpers.getElementItem();

        // DirectIncome field
        var directIncomeField = TestHelpers.getElementField(item1.Element);
        directIncomeField.DataType = 11;

        // DirectIncome cell
        var directIncomeCell = TestHelpers.getElementCell(directIncomeField, item1);
        directIncomeCell.NumericValueTotal = 50;

        // Multiplier field
        var multiplierField = TestHelpers.getElementField(item1.Element);
        multiplierField.DataType = 12;

        // Multiplier cell
        var multiplierCell = TestHelpers.getElementCell(multiplierField, item1);

        // User multiplier cell
        var userCell = TestHelpers.getUserElementCell(multiplierCell);
        userCell.DecimalValue = 3;

        // Assert
        expect(item1.totalDirectIncomeIncludingResourcePoolAmount()).toBe(165);

    });

    it("totalResourcePoolIncome", () => {

        // Case 1: Initial
        var item1 = TestHelpers.getElementItem();

        expect(item1.totalResourcePoolIncome()).toBe(0);

        // Case 2: Add the fields and cells
        var directIncomeField = TestHelpers.getElementField(item1.Element);
        directIncomeField.DataType = 11;
        directIncomeField.IndexEnabled = true;
        directIncomeField.IndexRatingTotal = 100;
        directIncomeField.IndexRatingCount = 1;

        // Multiplier field
        var multiplierField = TestHelpers.getElementField(item1.Element);
        multiplierField.DataType = 12;

        // DirectIncome cell
        var directIncomeCell = TestHelpers.getElementCell(directIncomeField, item1);
        directIncomeCell.NumericValueTotal = 50;

        // Multiplier cell
        var multiplierCell = TestHelpers.getElementCell(multiplierField, item1);

        // User multiplier cell
        var userMultiplierCell1 = TestHelpers.getUserElementCell(multiplierCell);
        userMultiplierCell1.DecimalValue = 3;

        // Assert
        expect(item1.totalResourcePoolIncome()).toBe(15);

    });

    it("totalIncome", () => {

        // Item
        var item1 = TestHelpers.getElementItem();

        // DirectIncome field
        var directIncomeField = TestHelpers.getElementField(item1.Element);
        directIncomeField.DataType = 11;
        directIncomeField.IndexEnabled = true;
        directIncomeField.IndexRatingTotal = 100;
        directIncomeField.IndexRatingCount = 1;

        // DirectIncome cell
        var directIncomeCell = TestHelpers.getElementCell(directIncomeField, item1);
        directIncomeCell.NumericValueTotal = 50;

        // Multiplier field
        var multiplierField = TestHelpers.getElementField(item1.Element);
        multiplierField.DataType = 12;

        // Multiplier cell
        var multiplierCell = TestHelpers.getElementCell(multiplierField, item1);

        // User multiplier cell
        var userCell = TestHelpers.getUserElementCell(multiplierCell);
        userCell.DecimalValue = 3;

        // Assert
        expect(item1.totalIncome()).toBe(165);

    });

    it("incomeStatus", () => {

        // Item
        var item1 = TestHelpers.getElementItem();

        // DirectIncome field
        var directIncomeField = TestHelpers.getElementField(item1.Element);
        directIncomeField.DataType = 11;
        directIncomeField.IndexEnabled = true;
        directIncomeField.IndexRatingTotal = 100;
        directIncomeField.IndexRatingCount = 1;

        // DirectIncome cell
        var directIncomeCell = TestHelpers.getElementCell(directIncomeField, item1);
        directIncomeCell.NumericValueTotal = 50;

        // Multiplier field
        var multiplierField = TestHelpers.getElementField(item1.Element);
        multiplierField.DataType = 12;

        // Multiplier cell
        var multiplierCell = TestHelpers.getElementCell(multiplierField, item1);

        // User multiplier cell
        var userCell = TestHelpers.getUserElementCell(multiplierCell);
        userCell.DecimalValue = 3;

        // Assert
        expect(item1.incomeStatus()).toBe('average');

        // TODO Try this with a second item?

    });

});
