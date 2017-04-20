import { ElementFieldDataType } from "./enums";
import { TestHelpers } from "./test-helpers";

// TODO: Check all these tests below one more time

describe("main/app-entity-manager/entities/element-field", () => {

    it('userElementField', function () {

        // Case 1: Initial
        var decimalField = TestHelpers.getElementField();
        decimalField.DataType = ElementFieldDataType.Decimal;

        expect(decimalField.currentUserElementField()).toBe(null);

        // Case 2: Add user element field
        var userDecimalField = TestHelpers.getUserElementField(decimalField);

        expect(decimalField.currentUserElementField()).toBe(userDecimalField);

        // TODO Update / remove cases

    });

    it('currentUserIndexRating', function () {

        // Case 1: Initial
        var decimalField = TestHelpers.getElementField();
        decimalField.DataType = ElementFieldDataType.Decimal;

        expect(decimalField.currentUserIndexRating()).toBe(50);

        // Case 2: Add user element field
        var userDecimalField = TestHelpers.getUserElementField(decimalField);
        userDecimalField.Rating = 25;

        // TODO Manually update?!
        decimalField.setCurrentUserIndexRating();

        expect(decimalField.currentUserIndexRating()).toBe(25);

        // TODO Update / remove cases

    });

    it('otherUsersIndexRatingTotal', function () {

        // Case 1: Initial
        var decimalField = TestHelpers.getElementField();
        decimalField.DataType = ElementFieldDataType.Decimal;

        expect(decimalField.otherUsersIndexRatingTotal()).toBe(0);

        // Case 2: Without user rating
        decimalField.IndexRatingTotal = 25;

        // TODO Manually update?!
        decimalField.setOtherUsersIndexRatingTotal();

        expect(decimalField.otherUsersIndexRatingTotal()).toBe(25);

        // Case 3: With user rating
        var userDecimalField = TestHelpers.getUserElementField(decimalField);
        userDecimalField.Rating = 10;

        // TODO Manually update?!
        decimalField.setOtherUsersIndexRatingTotal();

        expect(decimalField.otherUsersIndexRatingTotal()).toBe(15);

        // TODO Update / remove cases

    });

    it('otherUsersIndexRatingCount', function () {

        // Case 1: Initial
        var decimalField = TestHelpers.getElementField();
        decimalField.DataType = ElementFieldDataType.Decimal;

        expect(decimalField.otherUsersIndexRatingCount()).toBe(0);

        // Case 2: Without user rating
        decimalField.IndexRatingCount = 3;

        // TODO Manually update?!
        decimalField.setOtherUsersIndexRatingCount();

        expect(decimalField.otherUsersIndexRatingCount()).toBe(3);

        // Case 3: With user rating
        var userDecimalField = TestHelpers.getUserElementField(decimalField);
        userDecimalField.Rating = 10;

        // TODO Manually update?!
        decimalField.setOtherUsersIndexRatingCount();

        expect(decimalField.otherUsersIndexRatingCount()).toBe(2);

        // TODO Update / remove cases

    });

    it('indexRatingTotal', function () {

        // Case 1: Initial
        var decimalField = TestHelpers.getElementField();
        decimalField.DataType = ElementFieldDataType.Decimal;

        expect(decimalField.indexRatingTotal()).toBe(50);

        // Case 2: Without user rating
        decimalField.IndexRatingTotal = 25;

        // TODO Manually update?!
        decimalField.setOtherUsersIndexRatingTotal();

        expect(decimalField.indexRatingTotal()).toBe(75);

        // Case 3: With user rating
        var userDecimalField = TestHelpers.getUserElementField(decimalField);
        userDecimalField.Rating = 10;

        // TODO Manually update?!
        decimalField.setCurrentUserIndexRating();

        expect(decimalField.indexRatingTotal()).toBe(35);

        // TODO Update / remove cases

    });

    it('indexRatingCount', function () {

        // Case 1: Initial
        var decimalField = TestHelpers.getElementField();
        decimalField.DataType = ElementFieldDataType.Decimal;

        expect(decimalField.indexRatingCount()).toBe(1);

        // Case 2: Without user rating
        decimalField.IndexRatingCount = 3;

        // TODO Manually update?!
        decimalField.setOtherUsersIndexRatingCount();

        expect(decimalField.indexRatingCount()).toBe(4);

        // Case 3: With user rating
        var userDecimalField = TestHelpers.getUserElementField(decimalField);
        userDecimalField.Rating = 10;

        expect(decimalField.indexRatingCount()).toBe(4);

        // TODO Update / remove cases

    });

    it('indexRatingAverage', function () {

        // Case 1: Initial
        var decimalField = TestHelpers.getElementField();
        decimalField.DataType = ElementFieldDataType.Decimal;

        expect(decimalField.indexRatingAverage()).toBe(50);

        // Case 2: Without user rating
        decimalField.IndexRatingTotal = 75;
        decimalField.IndexRatingCount = 3;

        // TODO Manually update?!
        decimalField.setOtherUsersIndexRatingTotal();
        decimalField.setOtherUsersIndexRatingCount();

        expect(decimalField.indexRatingAverage()).toBe(125 / 4);

        // Case 3: With user rating
        var userDecimalField = TestHelpers.getUserElementField(decimalField);
        userDecimalField.Rating = 10;

        // TODO Manually update?!
        decimalField.setCurrentUserIndexRating();

        expect(decimalField.indexRatingAverage()).toBe(85 / 4);

        // TODO Update / remove cases

    });

    it('indexRating - RatingMode 1', function () {

        // Case 1: Initial
        var decimalField = TestHelpers.getElementField();
        decimalField.Element.ResourcePool.RatingMode = 1;
        decimalField.DataType = ElementFieldDataType.Decimal;

        expect(decimalField.indexRating()).toBe(50);

        // Case 2: Without user rating
        decimalField.IndexRatingTotal = 75;
        decimalField.IndexRatingCount = 3;

        // TODO Manually update?!
        decimalField.setOtherUsersIndexRatingTotal();
        decimalField.setOtherUsersIndexRatingCount();

        expect(decimalField.indexRating()).toBe(50);

        // Case 3: With user rating
        var userDecimalField = TestHelpers.getUserElementField(decimalField);
        userDecimalField.Rating = 10;

        // TODO Manually update?!
        decimalField.setCurrentUserIndexRating();
        decimalField.setIndexRating();

        expect(decimalField.indexRating()).toBe(10);

        // TODO Update / remove cases

    });

    it('indexRating - RatingMode 2', function () {

        // Case 1: Initial

        var decimalField = TestHelpers.getElementField();
        decimalField.Element.ResourcePool.RatingMode = 2;
        decimalField.DataType = ElementFieldDataType.Decimal;

        expect(decimalField.indexRating()).toBe(50);

        // Case 2: Without user rating
        decimalField.IndexRatingTotal = 75;
        decimalField.IndexRatingCount = 3;

        // TODO Manually update?!
        decimalField.setOtherUsersIndexRatingTotal();
        decimalField.setOtherUsersIndexRatingCount();
        decimalField.setIndexRating();

        expect(decimalField.indexRating()).toBe(125 / 4);

        // Case 3: With user rating
        var userDecimalField = TestHelpers.getUserElementField(decimalField);
        userDecimalField.Rating = 10;

        // TODO Manually update?!
        decimalField.setCurrentUserIndexRating();
        decimalField.setIndexRating();

        expect(decimalField.indexRating()).toBe(85 / 4);

        // TODO Update / remove cases

    });

    it('indexRatingPercentage', function () {

        // Case 1: Initial
        var decimalField1 = TestHelpers.getElementField();
        decimalField1.DataType = ElementFieldDataType.Decimal;
        decimalField1.IndexEnabled = true;

        expect(decimalField1.indexRatingPercentage()).toBe(1);

        // Case 2: With ratings
        var userDecimalField1 = TestHelpers.getUserElementField(decimalField1);
        userDecimalField1.Rating = 25;

        // TODO Manually update?!
        decimalField1.setCurrentUserIndexRating();
        decimalField1.setIndexRating();

        expect(decimalField1.indexRatingPercentage()).toBe(1);

        // Case 3: Second index
        var decimalField2 = TestHelpers.getElementField(decimalField1.Element);
        decimalField2.DataType = ElementFieldDataType.Decimal;
        decimalField2.IndexEnabled = true;

        var userDecimalField2 = TestHelpers.getUserElementField(decimalField2);
        userDecimalField2.Rating = 75;

        // TODO Manually update?!
        decimalField1.Element.setElementFieldIndexSet();
        decimalField2.setIndexRating();

        expect(decimalField1.indexRatingPercentage()).toBe(0.25);
        expect(decimalField2.indexRatingPercentage()).toBe(0.75);

        // TODO Update / remove cases

    });

    it('numericValueMultiplied', function () {

        // Case 1: Initial
        var decimalField = TestHelpers.getElementField();
        decimalField.DataType = 11;
        decimalField.IndexEnabled = true;

        expect(decimalField.numericValueMultiplied()).toBe(0);

        // Case 2: Add the multiplier field and the first item
        var multiplierField = TestHelpers.getElementField();
        multiplierField.DataType = 12;

        var item1 = TestHelpers.getElementItem(decimalField.Element);

        var decimalCell1 = TestHelpers.getElementCell(decimalField, item1);
        decimalCell1.NumericValueTotal = 50;

        var multiplierCell1 = TestHelpers.getElementCell(multiplierField, item1);

        var userMultiplierCell1 = TestHelpers.getUserElementCell(multiplierCell1);
        userMultiplierCell1.DecimalValue = 5;

        // TODO Manually update?!
        decimalField.setNumericValueMultiplied();

        expect(decimalField.numericValueMultiplied()).toBe(250);

        // Case 3: Add the second item
        var item2 = TestHelpers.getElementItem(decimalField.Element);

        var decimalCell2 = TestHelpers.getElementCell(decimalField, item2);
        decimalCell2.NumericValueTotal = 150;

        var multiplierCell2 = TestHelpers.getElementCell(multiplierField, item2);

        var userMultiplierCell2 = TestHelpers.getUserElementCell(multiplierCell2);
        userMultiplierCell2.DecimalValue = 15;

        // TODO Manually update?!
        decimalField.setNumericValueMultiplied();

        expect(decimalField.numericValueMultiplied()).toBe(2500);

        // TODO Update / remove cases

    });

    it('referenceRatingMultiplied', function () {

        // Case 1: Initial
        var decimalField = TestHelpers.getElementField();
        decimalField.DataType = 11;
        decimalField.IndexEnabled = true;
        decimalField.IndexSortType = 2;

        expect(decimalField.referenceRatingMultiplied()).toBe(0);

        // Case 2: Add the multiplier field and the first item
        var multiplierField = TestHelpers.getElementField();
        multiplierField.DataType = 12;

        var item1 = TestHelpers.getElementItem(decimalField.Element);

        var decimalCell1 = TestHelpers.getElementCell(decimalField, item1);
        decimalCell1.NumericValueTotal = 50;

        var multiplierCell1 = TestHelpers.getElementCell(multiplierField, item1);

        var userMultiplierCell1 = TestHelpers.getUserElementCell(multiplierCell1);
        userMultiplierCell1.DecimalValue = 5;

        decimalCell1.setNumericValueMultiplied();
        expect(decimalField.referenceRatingMultiplied()).toBe(250);

        // Case 3: Add the second item
        var item2 = TestHelpers.getElementItem(decimalField.Element);

        var decimalCell2 = TestHelpers.getElementCell(decimalField, item2);
        decimalCell2.NumericValueTotal = 150;

        var multiplierCell2 = TestHelpers.getElementCell(multiplierField, item2);

        var userMultiplierCell2 = TestHelpers.getUserElementCell(multiplierCell2);
        userMultiplierCell2.DecimalValue = 15;

        decimalCell1.setNumericValueMultiplied();
        decimalCell2.setNumericValueMultiplied();
        expect(decimalField.referenceRatingMultiplied()).toBe(2250);

        // TODO Update / remove cases
        // TODO field.IndexSortType = 1 case?

    });

    it('indexIncome', function () {

        // Case 1: Initial

        var decimalField1 = TestHelpers.getElementField();
        decimalField1.Element.ResourcePool.InitialValue = 50;
        decimalField1.DataType = ElementFieldDataType.Decimal;
        decimalField1.IndexEnabled = true;

        expect(decimalField1.indexIncome()).toBe(50);

        // Case 2: With ratings
        var userDecimalField1 = TestHelpers.getUserElementField(decimalField1);
        userDecimalField1.Rating = 25;

        // TODO Manually update?!
        decimalField1.setCurrentUserIndexRating();
        decimalField1.setIndexRating();

        expect(decimalField1.indexIncome()).toBe(50);

        // Case 3: Second index
        var decimalField2 = TestHelpers.getElementField(decimalField1.Element);
        decimalField2.DataType = ElementFieldDataType.Decimal;
        decimalField2.IndexEnabled = true;

        var userDecimalField2 = TestHelpers.getUserElementField(decimalField2);
        userDecimalField2.Rating = 75;

        // TODO Manually update?!
        decimalField1.Element.setElementFieldIndexSet();
        decimalField2.setIndexRating();

        expect(decimalField1.indexIncome()).toBe(50 * 0.25);
        expect(decimalField2.indexIncome()).toBe(50 * 0.75);

    });

});
