import { ElementFieldDataType } from "./element-field";
import { RatingMode } from "./resource-pool";
import { TestHelpers } from "./test-helpers";

// TODO: Check all these tests below one more time

describe("main/app-entity-manager/entities/element-cell", () => {

    it("currentUserNumericValue - Initial", () => {

        var cell = TestHelpers.createElementCell();

        expect(cell.currentUserNumericValue()).toBe(50);
    });

    it("currentUserNumericValue - With user cell", () => {

        var cell = TestHelpers.createElementCell(null, null, null, null, 10);

        expect(cell.currentUserNumericValue()).toBe(10);
    });

    it("otherUsersNumericValueTotal & otherUsersNumericValueCount - Initial", () => {

        var cell = TestHelpers.createElementCell();

        expect(cell.otherUsersNumericValueTotal).toBe(0);
        expect(cell.otherUsersNumericValueCount).toBe(0);
    });

    it("otherUsersNumericValueTotal & otherUsersNumericValueCount  - Without user rating", () => {

        var cell = TestHelpers.createElementCell(null, null, 25, 3);

        expect(cell.otherUsersNumericValueTotal).toBe(25);
        expect(cell.otherUsersNumericValueCount).toBe(3);
    });

    it("otherUsersNumericValueTotal & otherUsersNumericValueCount  - With user rating", () => {

        var cell = TestHelpers.createElementCell(null, null, 25, 3, 10);

        expect(cell.otherUsersNumericValueTotal).toBe(15);
        expect(cell.otherUsersNumericValueCount).toBe(2);
    });

    it("income", () => {

        var cell1 = TestHelpers.createElementCell(null, null, null, null, 55);

        var field = cell1.ElementField;

        var item2 = TestHelpers.createElementItem(field.Element);
        var cell2 = TestHelpers.createElementCell(field, item2, null, null, 45);

        expect(cell1.income()).toBe(field.income() * cell1.numericValuePercentage());
        expect(cell2.income()).toBe(field.income() * cell2.numericValuePercentage());
    });

    it("numericValueTotal - Initial", () => {

        var cell = TestHelpers.createElementCell();

        expect(cell.numericValueTotal()).toBe(50);
    });

    it("numericValueTotal - Without user rating", () => {

        var cell = TestHelpers.createElementCell(null, null, 25);

        expect(cell.numericValueTotal()).toBe(25 + 50);
    });

    it("numericValueTotal - Including user rating", () => {

        var cell = TestHelpers.createElementCell(null, null, 25, null, 10);

        expect(cell.numericValueTotal()).toBe(25);
    });

    it("numericValueTotal - Adding user rating", () => {

        var cell = TestHelpers.createElementCell(null, null, 25);

        var userCell = TestHelpers.createUserElementCell(cell, 10);

        expect(cell.numericValueTotal()).toBe(25 + 10);
    });

    it("numericValueCount - Initial", () => {

        var cell = TestHelpers.createElementCell();

        expect(cell.numericValueCount()).toBe(1);
    });

    it("numericValueCount - Without user rating", () => {

        var cell = TestHelpers.createElementCell(null, null, null, 3);

        expect(cell.numericValueCount()).toBe(3 + 1);
    });

    it("numericValueCount - Including user rating", () => {

        var cell = TestHelpers.createElementCell(null, null, null, 3, 10);

        expect(cell.numericValueCount()).toBe(3);
    });

    it("numericValueCount - Adding user rating", () => {

        var cell = TestHelpers.createElementCell(null, null, null, 3);

        var userCell = TestHelpers.createUserElementCell(cell, 10);

        expect(cell.numericValueCount()).toBe(3 + 1);
    });

    it("numericValueAverage", () => {

        var cell = TestHelpers.createElementCell(null, null, 75, 3);

        expect(cell.numericValueAverage()).toBe((75 + 50) / (3 + 1));
    });

    it("numericValue", () => {

        // Arrange & act - Case 1: 'Current User' (Default)
        var cell = TestHelpers.createElementCell(null, null, 75, 3);

        // Assert
        expect(cell.numericValue()).toBe(cell.currentUserNumericValue());

        // Act -  Cast 2: RatingMode 'All Users' & also cache case
        cell.ElementField.Element.ResourcePool.RatingMode = RatingMode.AllUsers;

        // Assert
        expect(cell.numericValue()).toBe(cell.numericValueAverage());
    });

    it("numericValuePercentage - One Item", () => {

        var cell = TestHelpers.createElementCell();

        expect(cell.numericValuePercentage()).toBe(1);
    });

    it("numericValuePercentage - Two Items", () => {

        var cell1 = TestHelpers.createElementCell(null, null, null, null, 55);

        var field = cell1.ElementField;

        var item2 = TestHelpers.createElementItem(field.Element);
        var cell2 = TestHelpers.createElementCell(field, item2, null, null, 45);

        expect(cell1.numericValuePercentage()).toBe(55 / (45 + 55));
        expect(cell2.numericValuePercentage()).toBe(45 / (45 + 55));
    });
});
