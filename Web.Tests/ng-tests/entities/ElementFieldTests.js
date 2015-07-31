/// <reference path="Commons.js" />

describe('ng-tests ElementField', function () {

    var $rootScope, ResourcePool, Element, ElementField, ElementItem, ElementCell;

    beforeEach(module('main'));

    beforeEach(function () {
        inject(function ($injector) {

            $rootScope = $injector.get('$rootScope');
            ResourcePool = $injector.get('ResourcePool');
            Element = $injector.get('Element');
            ElementField = $injector.get('ElementField');
            ElementItem = $injector.get('ElementItem');
            ElementCell = $injector.get('ElementCell');

            registerPrototypes($injector);

        });
    });

    // TODO !

    it('ElementField - single', function () {

        var resourcePool1 = new ResourcePool();
        resourcePool1.ResourcePoolRateTotal = 15;
        resourcePool1.ResourcePoolRateCount = 1;
        resourcePool1.UseFixedResourcePoolRate = true;
        resourcePool1.ratingMode = 1; // Only my ratings
        resourcePool1.InitialValue = 500;

        var element1 = new Element();
        element1.ResourcePool = resourcePool1;
        resourcePool1.ElementSet.push(element1);
        resourcePool1.MainElement = element1;

        // Fields
        var field1 = new ElementField();
        field1.Element = element1;
        field1.ElementFieldType = 4;
        field1.IndexEnabled = true;
        field1.IndexRating = 130;
        field1.IndexRatingCount = 2;
        element1.ElementFieldSet.push(field1);

        expect(field1.otherUsersIndexRating()).toBe(65);
        expect(field1.otherUsersIndexRatingCount()).toBe(2);
        expect(field1.otherUsersIndexRatingTotal()).toBe(130);
        expect(field1.currentUserIndexRating()).toBe(50); // No user element field, default value
        expect(field1.indexRatingAverage()).toBe(60);
        expect(field1.indexRatingCount()).toBe(3);
        expect(field1.indexRating()).toBe(50);
        expect(field1.indexRatingPercentage()).toBe(1);
        expect(field1.indexIncome()).toBe(500);

        // With all ratings
        resourcePool1.ratingMode = 2;
        field1.setIndexRating(); // TODO Manually update?!

        expect(field1.indexRatingAverage()).toBe(60);
        expect(field1.indexRatingCount()).toBe(3);
        expect(field1.indexRating()).toBe(60);
        expect(field1.indexRatingPercentage()).toBe(1);
        expect(field1.indexIncome()).toBe(500);

        // With user element field & only my ratings
        resourcePool1.ratingMode = 1;

        var userElementField1 = new UserElementField();
        userElementField1.ElementField = field1;
        userElementField1.Rating = 35;
        field1.UserElementFieldSet.push(userElementField1);

        // Broadcast ?!
        $rootScope.$broadcast('elementFieldIndexRatingUpdated', { elementField: field1, value: userElementField1.Rating });
        expect(field1.currentUserIndexRating()).toBe(35);
        expect(field1.indexRatingAverage()).toBe(55);
        expect(field1.indexRatingCount()).toBe(3);
        expect(field1.indexRating()).toBe(35);
        expect(field1.indexRatingPercentage()).toBe(1);
        expect(field1.indexIncome()).toBe(500);

        // With all ratings
        resourcePool1.ratingMode = 2;
        field1.setIndexRating(); // TODO Manually update?!

        expect(field1.indexRatingAverage()).toBe(55);
        expect(field1.indexRatingCount()).toBe(3);
        expect(field1.indexRating()).toBe(55);
        expect(field1.indexRatingPercentage()).toBe(1);
        expect(field1.indexIncome()).toBe(500);
    });

    it('ElementField - two indexes', function () {

        var resourcePool1 = new ResourcePool();
        resourcePool1.ResourcePoolRateTotal = 15;
        resourcePool1.ResourcePoolRateCount = 1;
        resourcePool1.UseFixedResourcePoolRate = true;
        resourcePool1.ratingMode = 1; // Only my ratings
        resourcePool1.InitialValue = 500;

        var element1 = new Element();
        element1.ResourcePool = resourcePool1;
        resourcePool1.ElementSet.push(element1);
        resourcePool1.MainElement = element1;

        // Fields
        var field1 = new ElementField();
        field1.Element = element1;
        field1.ElementFieldType = 4;
        field1.IndexEnabled = true;
        field1.IndexRating = 130;
        field1.IndexRatingCount = 2;
        element1.ElementFieldSet.push(field1);

        var field2 = new ElementField();
        field2.Element = element1;
        field2.ElementFieldType = 4;
        field2.IndexEnabled = true;
        field2.IndexRating = 70;
        field2.IndexRatingCount = 2;
        element1.ElementFieldSet.push(field2);

        expect(field1.otherUsersIndexRating()).toBe(65);
        expect(field1.otherUsersIndexRatingCount()).toBe(2);
        expect(field1.otherUsersIndexRatingTotal()).toBe(130);
        expect(field1.currentUserIndexRating()).toBe(50); // No user element field, default value
        expect(field1.indexRatingAverage()).toBe(60);
        expect(field1.indexRatingCount()).toBe(3);
        expect(field1.indexRating()).toBe(50);
        expect(field1.indexRatingPercentage()).toBe(0.5);
        expect(field1.indexIncome()).toBe(250);

        expect(field2.otherUsersIndexRating()).toBe(35);
        expect(field2.otherUsersIndexRatingCount()).toBe(2);
        expect(field2.otherUsersIndexRatingTotal()).toBe(70);
        expect(field2.currentUserIndexRating()).toBe(50); // No user element field, default value
        expect(field2.indexRatingAverage()).toBe(40);
        expect(field2.indexRatingCount()).toBe(3);
        expect(field2.indexRating()).toBe(50);
        expect(field2.indexRatingPercentage()).toBe(0.5);
        expect(field2.indexIncome()).toBe(250);

        // With all ratings
        resourcePool1.ratingMode = 2;
        field1.setIndexRating(); // TODO Manually update?!
        field2.setIndexRating(); // TODO Manually update?!

        expect(field1.indexRatingAverage()).toBe(60);
        expect(field1.indexRatingCount()).toBe(3);
        expect(field1.indexRating()).toBe(60);
        expect(field1.indexRatingPercentage()).toBe(0.6);
        expect(field1.indexIncome()).toBe(300);

        expect(field2.indexRatingAverage()).toBe(40);
        expect(field2.indexRatingCount()).toBe(3);
        expect(field2.indexRating()).toBe(40);
        expect(field2.indexRatingPercentage()).toBe(0.4);
        expect(field2.indexIncome()).toBe(200);

        // With user element field & only my ratings
        resourcePool1.ratingMode = 1;

        var userElementField1 = new UserElementField();
        userElementField1.ElementField = field1;
        userElementField1.Rating = 35;
        field1.UserElementFieldSet.push(userElementField1);
        // Broadcast ?!
        $rootScope.$broadcast('elementFieldIndexRatingUpdated', { elementField: field1, value: userElementField1.Rating });

        var userElementField2 = new UserElementField();
        userElementField2.ElementField = field2;
        userElementField2.Rating = 65;
        field2.UserElementFieldSet.push(userElementField2);
        // Broadcast ?!
        $rootScope.$broadcast('elementFieldIndexRatingUpdated', { elementField: field2, value: userElementField2.Rating });

        expect(field1.currentUserIndexRating()).toBe(35);
        expect(field1.indexRatingAverage()).toBe(55);
        expect(field1.indexRatingCount()).toBe(3);
        expect(field1.indexRating()).toBe(35);
        expect(field1.indexRatingPercentage()).toBe(0.35);
        expect(field1.indexIncome()).toBe(175);

        expect(field2.currentUserIndexRating()).toBe(65);
        expect(field2.indexRatingAverage()).toBe(45);
        expect(field2.indexRatingCount()).toBe(3);
        expect(field2.indexRating()).toBe(65);
        expect(field2.indexRatingPercentage()).toBe(0.65);
        expect(field2.indexIncome()).toBe(325);

        // With all ratings
        resourcePool1.ratingMode = 2;
        field1.setIndexRating(); // TODO Manually update?!
        field2.setIndexRating(); // TODO Manually update?!

        expect(field1.indexRatingAverage()).toBe(55);
        expect(field1.indexRatingCount()).toBe(3);
        expect(field1.indexRating()).toBe(55);
        expect(field1.indexRatingPercentage()).toBe(0.55);
        expect(field1.indexIncome()).toBe(275);

        expect(field2.indexRatingAverage()).toBe(45);
        expect(field2.indexRatingCount()).toBe(3);
        expect(field2.indexRating()).toBe(45);
        expect(field2.indexRatingPercentage()).toBe(0.45);
        expect(field2.indexIncome()).toBe(225);

    });

});
