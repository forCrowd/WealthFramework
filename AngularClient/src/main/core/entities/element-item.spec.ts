import { ElementFieldDataType } from "@forcrowd/backbone-client-core";

import { Element } from "./element";
import { Project } from "./project";
import { TestHelpers } from "./test-helpers";

// TODO: Check all these tests below one more time

describe("main/core/entities/element-item", () => {

  it("ratingCells", () => {

    // Item
    var item1 = TestHelpers.createElementItem();

    // Should have no elements
    expect(item1.ratingCells().length).toBe(0);

    // Field 1
    var field1 = TestHelpers.createElementField(item1.Element as Element);
    field1.RatingEnabled = false;

    // Cell 1
    TestHelpers.createElementCell(field1, item1);

    // Still...
    expect(item1.ratingCells().length).toBe(0);

    // Field 2
    var field2 = TestHelpers.createElementField(item1.Element as Element, ElementFieldDataType.Decimal);

    // Cell 2
    TestHelpers.createElementCell(field2, item1);

    // And now 1 item
    expect(item1.ratingCells().length).toBe(1);
  });

  it("income", () => {

    // Item
    var item1 = TestHelpers.createElementItem();

    // Initial value
    (item1.Element.Project as Project).initialValue = 165;

    // Decimal cell
    TestHelpers.createElementCell(null, item1);

    // TODO Manually update?!
    (item1.Element as Element).setRating();

    // Assert
    expect(item1.income()).toBe(165);

  });

  it("incomeStatus", () => {

    // Item
    var item1 = TestHelpers.createElementItem();

    // Decimal field
    var decimalField = TestHelpers.createElementField(item1.Element as Element, ElementFieldDataType.Decimal, 100, 1);

    // Decimal cell
    TestHelpers.createElementCell(decimalField, item1, 50);

    // Assert
    expect(item1.incomeStatus()).toBe("average");

    // TODO Try this with a second item?

  });

});
