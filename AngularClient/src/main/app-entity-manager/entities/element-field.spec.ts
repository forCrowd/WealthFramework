import { ElementFieldDataType } from "./element-field";
import { TestHelpers } from "./test-helpers";

// TODO: Check all these tests below one more time

describe("main/app-entity-manager/entities/element-field", () => {

    it("currentUserIndexRating", () => {

        // Case 1: Initial
        const decimalField = TestHelpers.createElementField(null, ElementFieldDataType.Decimal);

        expect(decimalField.currentUserIndexRating()).toBe(50);

        // Case 2: Add user element field
        TestHelpers.createUserElementField(decimalField, 25);

        expect(decimalField.currentUserIndexRating()).toBe(25);

        // TODO Update / remove cases
    });

    it("otherUsersIndexRatingTotal & otherUsersIndexRatingCount - Initial", () => {

        var field = TestHelpers.createElementField();

        expect(field.otherUsersIndexRatingTotal).toBe(0);
        expect(field.otherUsersIndexRatingCount).toBe(0);
    });

    it("otherUsersIndexRatingTotal & otherUsersIndexRatingCount - Without user rating", () => {

        var field = TestHelpers.createElementField(null, null, 25, 3);

        expect(field.otherUsersIndexRatingTotal).toBe(25);
        expect(field.otherUsersIndexRatingCount).toBe(3);
    });

    it("otherUsersIndexRatingTotal & otherUsersIndexRatingCount - With user rating", () => {

        var field = TestHelpers.createElementField(null, ElementFieldDataType.Decimal, 25, 3, 10);

        expect(field.otherUsersIndexRatingTotal).toBe(15);
        expect(field.otherUsersIndexRatingCount).toBe(2);
    });

    it("income", () => {

        // Case 1: Initial
        const decimalField1 = TestHelpers.createElementField(null, ElementFieldDataType.Decimal);
        decimalField1.Element.ResourcePool.InitialValue = 50;

        expect(decimalField1.income()).toBe(50);

        // Case 2: With ratings
        TestHelpers.createUserElementField(decimalField1, 25);

        expect(decimalField1.income()).toBe(50);

        // Case 3: Second index
        const decimalField2 = TestHelpers.createElementField(decimalField1.Element, ElementFieldDataType.Decimal);

        TestHelpers.createUserElementField(decimalField2, 75);

        expect(decimalField1.income()).toBe(50 * 0.25);
        expect(decimalField2.income()).toBe(50 * 0.75);

    });

    it("indexRatingTotal", () => {

        const decimalField = TestHelpers.createElementField(null, ElementFieldDataType.Decimal, 25);

        expect(decimalField.indexRatingTotal()).toBe(50 + 25);
    });

    it("indexRatingCount", () => {

        const decimalField = TestHelpers.createElementField(null, ElementFieldDataType.Decimal, null, 3);

        expect(decimalField.indexRatingCount()).toBe(3 + 1);
    });

    it("indexRatingAverage", () => {

        const decimalField = TestHelpers.createElementField(null, ElementFieldDataType.Decimal, 75 , 3);

        expect(decimalField.indexRatingAverage()).toBe((75 + 50) / (3 + 1));
    });

    it("indexRating - Toggle RatingMode", () => {

        const decimalField = TestHelpers.createElementField(null, ElementFieldDataType.Decimal, 75, 3);

        expect(decimalField.indexRating()).toBe(decimalField.currentUserIndexRating());

        // Toggle (switch to All Users')
        decimalField.Element.ResourcePool.toggleRatingMode();

        expect(decimalField.indexRating()).toBe(decimalField.indexRatingAverage());
    });

    it("indexRatingPercentage", () => {

        // Case 1: One index
        const decimalField1 = TestHelpers.createElementField(null, ElementFieldDataType.Decimal, null, null, 25);

        expect(decimalField1.indexRatingPercentage()).toBe(1);

        // Case 2: Two indexes
        const decimalField2 = TestHelpers.createElementField(decimalField1.Element, ElementFieldDataType.Decimal, null, null, 75);

        expect(decimalField1.indexRatingPercentage()).toBe(0.25);
        expect(decimalField2.indexRatingPercentage()).toBe(0.75);
    });

    it("numericValue", () => {

        // Case 1: Initial
        const decimalField = TestHelpers.createElementField(null, ElementFieldDataType.Decimal);

        expect(decimalField.numericValue()).toBe(0);

        // Case 2: Add fields
        const item1 = TestHelpers.createElementItem(decimalField.Element);

        TestHelpers.createElementCell(decimalField, item1, null, null, 5);

        expect(decimalField.numericValue()).toBe(5);

        // Case 3: Add the second item
        const item2 = TestHelpers.createElementItem(decimalField.Element);

        TestHelpers.createElementCell(decimalField, item2, null, null, 10);

        expect(decimalField.numericValue()).toBe(15);

        // TODO Update / remove cases

    });
});
