import { Element } from "./element";
import { ElementField } from "./element-field";
import { Project, RatingMode } from "./project";
import { TestHelpers } from "./test-helpers";

// TODO: Check all these tests below one more time

describe("main/core/entities/element-cell", () => {

  it("currentUserDecimalValue - Initial", () => {

    var cell = TestHelpers.createElementCell();

    expect(cell.currentUserDecimalValue()).toBe(50);
  });

  it("currentUserDecimalValue - With user cell", () => {

    var cell = TestHelpers.createElementCell(null, null, null, null, 10);

    expect(cell.currentUserDecimalValue()).toBe(10);
  });

  it("otherUsersDecimalValueTotal & otherUsersDecimalValueCount - Initial", () => {

    var cell = TestHelpers.createElementCell();

    expect(cell.otherUsersDecimalValueTotal).toBe(0);
    expect(cell.otherUsersDecimalValueCount).toBe(0);
  });

  it("otherUsersDecimalValueTotal & otherUsersDecimalValueCount  - Without user rating", () => {

    var cell = TestHelpers.createElementCell(null, null, 25, 3);

    expect(cell.otherUsersDecimalValueTotal).toBe(25);
    expect(cell.otherUsersDecimalValueCount).toBe(3);
  });

  it("otherUsersDecimalValueTotal & otherUsersDecimalValueCount  - With user rating", () => {

    var cell = TestHelpers.createElementCell(null, null, 25, 3, 10);

    expect(cell.otherUsersDecimalValueTotal).toBe(15);
    expect(cell.otherUsersDecimalValueCount).toBe(2);
  });

  it("income", () => {

    var cell1 = TestHelpers.createElementCell(null, null, null, null, 55);

    var field = cell1.ElementField;

    var item2 = TestHelpers.createElementItem(field.Element as Element);
    var cell2 = TestHelpers.createElementCell(field as ElementField, item2, null, null, 45);

    expect(cell1.income()).toBe((field as ElementField).income() * cell1.decimalValuePercentage());
    expect(cell2.income()).toBe((field as ElementField).income() * cell2.decimalValuePercentage());
  });

  it("decimalValueTotal - Initial", () => {

    var cell = TestHelpers.createElementCell();

    expect(cell.decimalValueTotal()).toBe(50);
  });

  it("decimalValueTotal - Without user rating", () => {

    var cell = TestHelpers.createElementCell(null, null, 25);

    expect(cell.decimalValueTotal()).toBe(25 + 50);
  });

  it("decimalValueTotal - Including user rating", () => {

    var cell = TestHelpers.createElementCell(null, null, 25, null, 10);

    expect(cell.decimalValueTotal()).toBe(25);
  });

  it("decimalValueTotal - Adding user rating", () => {

    var cell = TestHelpers.createElementCell(null, null, 25);

    var userCell = TestHelpers.createUserElementCell(cell, 10);

    expect(cell.decimalValueTotal()).toBe(25 + 10);
  });

  it("decimalValueCount - Initial", () => {

    var cell = TestHelpers.createElementCell();

    expect(cell.decimalValueCount()).toBe(1);
  });

  it("decimalValueCount - Without user rating", () => {

    var cell = TestHelpers.createElementCell(null, null, null, 3);

    expect(cell.decimalValueCount()).toBe(3 + 1);
  });

  it("decimalValueCount - Including user rating", () => {

    var cell = TestHelpers.createElementCell(null, null, null, 3, 10);

    expect(cell.decimalValueCount()).toBe(3);
  });

  it("decimalValueCount - Adding user rating", () => {

    var cell = TestHelpers.createElementCell(null, null, null, 3);

    var userCell = TestHelpers.createUserElementCell(cell, 10);

    expect(cell.decimalValueCount()).toBe(3 + 1);
  });

  it("decimalValueAverage", () => {

    var cell = TestHelpers.createElementCell(null, null, 75, 3);

    expect(cell.decimalValueAverage()).toBe((75 + 50) / (3 + 1));
  });

  it("decimalValue", () => {

    // Arrange & act - Case 1: 'Current User' (Default)
    var cell = TestHelpers.createElementCell(null, null, 75, 3);

    // Assert
    expect(cell.decimalValue()).toBe(cell.currentUserDecimalValue());

    // Act -  Cast 2: RatingMode 'All Users' & also cache case
    (cell.ElementField.Element.Project as Project).RatingMode = RatingMode.AllUsers;

    // Assert
    expect(cell.decimalValue()).toBe(cell.decimalValueAverage());
  });

  it("decimalValuePercentage - One Item", () => {

    var cell = TestHelpers.createElementCell();

    expect(cell.decimalValuePercentage()).toBe(1);
  });

  it("decimalValuePercentage - Two Items", () => {

    var cell1 = TestHelpers.createElementCell(null, null, null, null, 55);

    var field = cell1.ElementField;

    var item2 = TestHelpers.createElementItem(field.Element as Element);
    var cell2 = TestHelpers.createElementCell(field as ElementField, item2, null, null, 45);

    expect(cell1.decimalValuePercentage()).toBe(55 / (45 + 55));
    expect(cell2.decimalValuePercentage()).toBe(45 / (45 + 55));
  });
});
