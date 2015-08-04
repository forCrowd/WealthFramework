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
        expect(child.familyTree().length).toBe(3);

        expect(parent.familyTree()[0]).toBe(grandParent);
        expect(parent.familyTree()[1]).toBe(parent);

        expect(child.familyTree()[0]).toBe(grandParent);
        expect(child.familyTree()[1]).toBe(parent);
        expect(child.familyTree()[2]).toBe(child);

    });

    it('elementFieldIndexSet', function () {
        
        // Case 1: Initial
        var element = new Element();

        expect(element.elementFieldIndexSet().length).toBe(0);

        // Case 2: Adding a new field but without index
        var field1 = new ElementField();
        field1.Element = element;
        field1.ElementFieldType = 4;
        element.ElementFieldSet = [field1];

        // TODO Manually update?!
        element.setElementFieldIndexSet();

        expect(element.elementFieldIndexSet().length).toBe(0);

        // Case 3: Enable the index
        field1.IndexEnabled = true;
        element.setElementFieldIndexSet();

        expect(element.elementFieldIndexSet().length).toBe(1);

        // Case 4: Add a new field with index
        var field2 = new ElementField();
        field2.Element = element;
        field2.ElementFieldType = 4;
        field2.IndexEnabled = true;
        element.ElementFieldSet.push(field2);

        // TODO Manually update?!
        element.setElementFieldIndexSet();

        expect(element.elementFieldIndexSet().length).toBe(2);

        // TODO Child element's indexes - update / remove cases

    });


    it('indexRating', function () {

        // Case 1: Initial
        var resourcePool = new ResourcePool();

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];

        expect(element.indexRating()).toBe(0);

        // Case 2: Adding the first index field
        var field1 = new ElementField();
        field1.Element = element;
        field1.ElementFieldType = 4;
        field1.IndexEnabled = true;
        element.ElementFieldSet = [field1];

        // TODO Manually update?!
        element.setElementFieldIndexSet();

        expect(element.indexRating()).toBe(50);

        // Case 2: Adding the second index field
        var field2 = new ElementField();
        field2.Element = element;
        field2.ElementFieldType = 4;
        field2.IndexEnabled = true;
        element.ElementFieldSet.push(field2);

        // TODO Manually update?!
        element.setElementFieldIndexSet();

        expect(element.indexRating()).toBe(100);

        // TODO Update / remove cases

    });

    it('directIncomeField', function () {

        // Case 1: Initial
        var element = new Element();

        expect(element.directIncomeField()).toBe(null);

        // Case 2: Add the field
        var directIncomeField = new ElementField();
        directIncomeField.Element = element;
        directIncomeField.ElementFieldType = 11;
        element.ElementFieldSet = [directIncomeField];

        expect(element.directIncomeField()).toBe(directIncomeField);

        // TODO Remove?

    });

    it('directIncome', function () {

        // Case 1: Initial
        var resourcePool = new ResourcePool();
        resourcePool.RatingMode = 2; // To make the configuration easier

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];

        expect(element.directIncome()).toBe(0);

        // Case 2: Add the field, first item and the cell
        var directIncomeField = new ElementField();
        directIncomeField.Element = element;
        directIncomeField.ElementFieldType = 11;
        element.ElementFieldSet = [directIncomeField];

        var item1 = new ElementItem();
        item1.Element = element;
        element.ElementItemSet = [item1];

        var cell1 = new ElementCell();
        cell1.ElementField = directIncomeField;
        cell1.ElementItem = item1;
        cell1.NumericValue = 50;
        cell1.NumericValueCount = 1;
        directIncomeField.ElementCellSet = [cell1];
        item1.ElementCellSet = [cell1];

        expect(element.directIncome()).toBe(50);

        // Case 3: Add the second item
        var item2 = new ElementItem();
        item2.Element = element;
        element.ElementItemSet.push(item2);

        var cell2 = new ElementCell();
        cell2.ElementField = directIncomeField;
        cell2.ElementItem = item2;
        cell2.NumericValue = 150;
        cell2.NumericValueCount = 1;
        directIncomeField.ElementCellSet.push(cell2);
        item2.ElementCellSet = [cell2];

        expect(element.directIncome()).toBe(200);

        // TODO Update / remove

    });

    it('multiplierField', function () {

        // Case 1: Initial
        var element = new Element();

        expect(element.multiplierField()).toBe(null);

        // Case 2: Add the field
        var multiplierField = new ElementField();
        multiplierField.Element = element;
        multiplierField.ElementFieldType = 12;
        element.ElementFieldSet = [multiplierField];

        expect(element.multiplierField()).toBe(multiplierField);

        // TODO Remove?

    });

    it('multiplier', function () {

        // Case 1: Initial
        var resourcePool = new ResourcePool();
        //resourcePool.RatingMode = 2; // To make the configuration easier

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];

        expect(element.multiplier()).toBe(0);

        // Case 2: Add the field, first item and the cell
        var multiplierField = new ElementField();
        multiplierField.Element = element;
        multiplierField.ElementFieldType = 12;
        element.ElementFieldSet = [multiplierField];

        var item1 = new ElementItem();
        item1.Element = element;
        element.ElementItemSet = [item1];

        var cell1 = new ElementCell();
        cell1.ElementField = multiplierField;
        cell1.ElementItem = item1;
        multiplierField.ElementCellSet = [cell1];
        item1.ElementCellSet = [cell1];

        var userCell1 = new UserElementCell();
        userCell1.ElementCell = cell1;
        userCell1.DecimalValue = 5;
        cell1.UserElementCellSet = [userCell1];

        expect(element.multiplier()).toBe(5);

        // Case 3: Add the second item
        var item2 = new ElementItem();
        item2.Element = element;
        element.ElementItemSet.push(item2);

        var cell2 = new ElementCell();
        cell2.ElementField = multiplierField;
        cell2.ElementItem = item2;
        multiplierField.ElementCellSet.push(cell2);
        item2.ElementCellSet = [cell2];

        var userCell2 = new UserElementCell();
        userCell2.ElementCell = cell2;
        userCell2.DecimalValue = 15;
        cell2.UserElementCellSet = [userCell2];

        expect(element.multiplier()).toBe(20);

        // TODO Update / remove

    });

    it('totalDirectIncome', function () {

        // Case 1: Initial
        var resourcePool = new ResourcePool();

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];

        expect(element.totalDirectIncome()).toBe(0);

        // Case 2: Add the fields, first item and the cell
        var directIncomeField = new ElementField();
        directIncomeField.Element = element;
        directIncomeField.ElementFieldType = 11;
        element.ElementFieldSet = [directIncomeField];

        var multiplierField = new ElementField();
        multiplierField.Element = element;
        multiplierField.ElementFieldType = 12;
        element.ElementFieldSet.push(multiplierField);

        var item1 = new ElementItem();
        item1.Element = element;
        element.ElementItemSet = [item1];

        var cell1 = new ElementCell();
        cell1.ElementField = directIncomeField;
        cell1.ElementItem = item1;
        cell1.NumericValue = 50;
        cell1.NumericValueCount = 1;
        directIncomeField.ElementCellSet = [cell1];
        item1.ElementCellSet = [cell1];

        var cell2 = new ElementCell();
        cell2.ElementField = multiplierField;
        cell2.ElementItem = item1;
        multiplierField.ElementCellSet = [cell2];
        item1.ElementCellSet.push(cell2);

        var userCell1 = new UserElementCell();
        userCell1.ElementCell = cell2;
        userCell1.DecimalValue = 5;
        cell2.UserElementCellSet = [userCell1];

        expect(element.totalDirectIncome()).toBe(250);

        // Case 3: Add the second item
        var item2 = new ElementItem();
        item2.Element = element;
        element.ElementItemSet.push(item2);

        var cell3 = new ElementCell();
        cell3.ElementField = directIncomeField;
        cell3.ElementItem = item2;
        cell3.NumericValue = 150;
        cell3.NumericValueCount = 1;
        directIncomeField.ElementCellSet.push(cell3);
        item2.ElementCellSet = [cell3];

        var cell4 = new ElementCell();
        cell4.ElementField = multiplierField;
        cell4.ElementItem = item2;
        multiplierField.ElementCellSet = [cell4];
        item2.ElementCellSet.push(cell4);

        var userCell2 = new UserElementCell();
        userCell2.ElementCell = cell4;
        userCell2.DecimalValue = 15;
        cell4.UserElementCellSet = [userCell2];

        expect(element.totalDirectIncome()).toBe(2500);

        // TODO Update / remove

    });

    it('resourcePoolAmount', function () {



    });

    //totalResourcePoolAmount
    //directIncomeIncludingResourcePoolAmount
    //totalDirectIncomeIncludingResourcePoolAmount
    //totalResourcePoolIncome
    //totalIncome
    //totalIncomeAverage

});
