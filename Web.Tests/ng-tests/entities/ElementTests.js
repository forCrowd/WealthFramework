/// <reference path="Commons.js" />

describe('ng-tests Element', function () {

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

    it('parent - initial', function () {

        var element = new Element();
        expect(element.parent()).toBe(null);

    });

    it('parent - one child', function () {

        // Parent element
        var parent = new Element();

        // Child element
        var child = new Element();

        // Parent's field
        var field = new ElementField();
        field.Element = parent;
        field.ElementFieldType = 6;
        field.SelectedElement = child;
        parent.ElementFieldSet = [field];
        child.ParentFieldSet = [field];

        // Assert
        expect(child.parent()).toBe(parent);

    });

    it('parent - multiple children', function () {

        // Grand parent element
        var grandParent = new Element();

        // Parent
        var parent = new Element();

        // Child element
        var child = new Element();

        // Grand parent's field
        var grandParentField = new ElementField();
        grandParentField.Element = grandParent;
        grandParentField.ElementFieldType = 6;
        grandParentField.SelectedElement = parent;
        grandParent.ElementFieldSet = [grandParentField];
        parent.ParentFieldSet = [grandParentField];

        // Parent's field
        var parentField = new ElementField();
        parentField.Element = parent;
        parentField.ElementFieldType = 6;
        parentField.SelectedElement = child;
        parent.ElementFieldSet = [parentField];
        child.ParentFieldSet = [parentField];

        // Assert
        expect(parent.parent()).toBe(grandParent);
        expect(child.parent()).toBe(parent);

    });

    it('familyTree', function () {

        // Grand parent element
        var grandParent = new Element();

        // Parent
        var parent = new Element();

        // Child element
        var child = new Element();

        // Grand parent's field
        var grandParentField = new ElementField();
        grandParentField.Element = grandParent;
        grandParentField.ElementFieldType = 6;
        grandParentField.SelectedElement = parent;
        grandParent.ElementFieldSet = [grandParentField];
        parent.ParentFieldSet = [grandParentField];

        // Parent's field
        var parentField = new ElementField();
        parentField.Element = parent;
        parentField.ElementFieldType = 6;
        parentField.SelectedElement = child;
        parent.ElementFieldSet = [parentField];
        child.ParentFieldSet = [parentField];

        // Assert
        expect(parent.familyTree().length).toBe(2);
        //expect(child.familyTree().length).toBe(3);

        //expect(parent.familyTree()[0]).toBe(grandParent);
        //expect(child.familyTree()[0]).toBe(grandParent);
        //expect(child.familyTree()[1]).toBe(parent);

    });

});
