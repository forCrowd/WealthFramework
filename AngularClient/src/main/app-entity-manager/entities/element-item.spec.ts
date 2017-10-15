import { ElementFieldDataType } from "./element-field";
import { TestHelpers } from "./test-helpers";

// TODO: Check all these tests below one more time

describe("main/app-entity-manager/entities/element-item", () => {

    it("elementCellIndexSet", () => {

        // Item
        var item1 = TestHelpers.createElementItem();

        // Should have no elements
        expect(item1.elementCellIndexSet().length).toBe(0);

        // Field 1
        var field1 = TestHelpers.createElementField(item1.Element);
        field1.IndexEnabled = false;

        // Cell 1
        TestHelpers.createElementCell(field1, item1);

        // Still...
        expect(item1.elementCellIndexSet().length).toBe(0);

        // Field 2
        var field2 = TestHelpers.createElementField(item1.Element, ElementFieldDataType.Decimal);

        // Cell 2
        TestHelpers.createElementCell(field2, item1);

        // And now 1 item
        expect(item1.elementCellIndexSet().length).toBe(1);
    });

    it("income", () => {

        // Item
        var item1 = TestHelpers.createElementItem();

        // Initial value
        item1.Element.ResourcePool.InitialValue = 165;

        // Decimal cell
        TestHelpers.createElementCell(null, item1);

        // TODO Manually update?!
        item1.Element.setIndexRating();

        // Assert
        expect(item1.income()).toBe(165);

    });

    it("incomeStatus", () => {

        // Item
        var item1 = TestHelpers.createElementItem();

        // Decimal field
        var decimalField = TestHelpers.createElementField(item1.Element, ElementFieldDataType.Decimal, 100, 1);

        // Decimal cell
        TestHelpers.createElementCell(decimalField, item1, 50);

        // Assert
        expect(item1.incomeStatus()).toBe("average");

        // TODO Try this with a second item?

    });

});
