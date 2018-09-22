import { ElementFieldDataType } from "./element-field";
import { TestHelpers } from "./test-helpers";

// TODO: Check all these tests below one more time

describe("main/core/entities/element-field", () => {

  it("currentUserRating", () => {

    // Case 1: Initial
    const decimalField = TestHelpers.createElementField(null, ElementFieldDataType.Decimal);

    expect(decimalField.currentUserRating()).toBe(50);

    // Case 2: Add user element field
    TestHelpers.createUserElementField(decimalField, 25);

    expect(decimalField.currentUserRating()).toBe(25);

    // TODO Update / remove cases
  });

  it("otherUsersRatingTotal & otherUsersRatingCount - Initial", () => {

    var field = TestHelpers.createElementField();

    expect(field.otherUsersRatingTotal).toBe(0);
    expect(field.otherUsersRatingCount).toBe(0);
  });

  it("otherUsersRatingTotal & otherUsersRatingCount - Without user rating", () => {

    var field = TestHelpers.createElementField(null, null, 25, 3);

    expect(field.otherUsersRatingTotal).toBe(25);
    expect(field.otherUsersRatingCount).toBe(3);
  });

  it("otherUsersRatingTotal & otherUsersRatingCount - With user rating", () => {

    var field = TestHelpers.createElementField(null, ElementFieldDataType.Decimal, 25, 3, 10);

    expect(field.otherUsersRatingTotal).toBe(15);
    expect(field.otherUsersRatingCount).toBe(2);
  });

  it("income", () => {

    // Case 1: Initial
    const decimalField1 = TestHelpers.createElementField(null, ElementFieldDataType.Decimal);
    decimalField1.Element.Project.initialValue = 50;
    decimalField1.setIncome();

    expect(decimalField1.income()).toBe(50);

    // Case 2: With ratings
    TestHelpers.createUserElementField(decimalField1, 25);

    expect(decimalField1.income()).toBe(50);

    // Case 3: Second rating field
    const decimalField2 = TestHelpers.createElementField(decimalField1.Element, ElementFieldDataType.Decimal);

    TestHelpers.createUserElementField(decimalField2, 75);

    expect(decimalField1.income()).toBe(50 * 0.25);
    expect(decimalField2.income()).toBe(50 * 0.75);

  });

  it("ratingTotal", () => {

    const decimalField = TestHelpers.createElementField(null, ElementFieldDataType.Decimal, 25);

    expect(decimalField.ratingTotal()).toBe(50 + 25);
  });

  it("ratingCount", () => {

    const decimalField = TestHelpers.createElementField(null, ElementFieldDataType.Decimal, null, 3);

    expect(decimalField.ratingCount()).toBe(3 + 1);
  });

  it("ratingAverage", () => {

    const decimalField = TestHelpers.createElementField(null, ElementFieldDataType.Decimal, 75, 3);

    expect(decimalField.ratingAverage()).toBe((75 + 50) / (3 + 1));
  });

  it("rating - Toggle RatingMode", () => {

    const decimalField = TestHelpers.createElementField(null, ElementFieldDataType.Decimal, 75, 3);

    expect(decimalField.rating()).toBe(decimalField.currentUserRating());

    // Toggle (switch to All Users')
    decimalField.Element.Project.toggleRatingMode();

    expect(decimalField.rating()).toBe(decimalField.ratingAverage());
  });

  it("ratingPercentage", () => {

    // Case 1: One rating field
    const decimalField1 = TestHelpers.createElementField(null, ElementFieldDataType.Decimal, null, null, 25);

    expect(decimalField1.ratingPercentage()).toBe(1);

    // Case 2: Two rating fields
    const decimalField2 = TestHelpers.createElementField(decimalField1.Element, ElementFieldDataType.Decimal, null, null, 75);

    expect(decimalField1.ratingPercentage()).toBe(0.25);
    expect(decimalField2.ratingPercentage()).toBe(0.75);
  });

  it("decimalValue", () => {

    // Case 1: Initial
    const decimalField = TestHelpers.createElementField(null, ElementFieldDataType.Decimal);

    expect(decimalField.decimalValue()).toBe(0);

    // Case 2: Add fields
    const item1 = TestHelpers.createElementItem(decimalField.Element);

    TestHelpers.createElementCell(decimalField, item1, null, null, 5);

    expect(decimalField.decimalValue()).toBe(5);

    // Case 3: Add the second item
    const item2 = TestHelpers.createElementItem(decimalField.Element);

    TestHelpers.createElementCell(decimalField, item2, null, null, 10);

    expect(decimalField.decimalValue()).toBe(15);

    // TODO Update / remove cases

  });
});
