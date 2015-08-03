/// <reference path="Commons.js" />

describe('ng-tests Sanity Checks', function () {

    var ResourcePool, Element, ElementField, ElementItem, ElementCell;

    beforeEach(module('main'));

    beforeEach(function () {
        inject(function ($injector) {

            ResourcePool = $injector.get('ResourcePool');
            Element = $injector.get('Element');
            ElementField = $injector.get('ElementField');
            ElementItem = $injector.get('ElementItem');
            ElementCell = $injector.get('ElementCell');

            registerPrototypes($injector);

        });
    });

    it('Pure sanity', function () {

        expect(0).toBe(0);

    });

    it('Experimental', function () {

        // Just experimental
        var number = 1000000000000000000000000000000000;
        var total = number * number;
        expect(total).toBe(total);

    });

    it('Entities', function () {

        // Entities
        var resourcePool1 = new ResourcePool();
        var element1 = new Element();
        var elementField1 = new ElementField();
        var elementItem1 = new ElementItem();
        var elementCell1 = new ElementCell();

        expect(resourcePool1).toBeDefined();
        expect(element1).toBeDefined();
        expect(elementField1).toBeDefined();
        expect(elementItem1).toBeDefined();
        expect(elementCell1).toBeDefined();
    });
});
