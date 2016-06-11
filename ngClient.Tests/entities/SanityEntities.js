/// <reference path="Commons.js" />

describe('ng Sanity Entities', function () {

    var ResourcePool, Element, ElementField, ElementItem, ElementCell;

    beforeEach(module('main'));

    beforeEach(function () {
        inject(function ($injector) {

            ResourcePool = $injector.get('ResourcePool');
            Element = $injector.get('Element');
            ElementField = $injector.get('ElementField');
            ElementItem = $injector.get('ElementItem');
            ElementCell = $injector.get('ElementCell');
            UserElementCell = $injector.get('UserElementCell');

            registerPrototypes($injector);

        });
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
