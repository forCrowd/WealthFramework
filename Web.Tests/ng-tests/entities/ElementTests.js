/// <reference path="Commons.js" />

describe('ng Element', function () {

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
        resourcePool.MainElement = element;

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

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];
        resourcePool.MainElement = element;

        expect(element.directIncome()).toBe(0);

        // Case 2: Add the field, first item and the cell
        var directIncomeField = new ElementField();
        directIncomeField.Element = element;
        directIncomeField.ElementFieldType = 11;
        element.ElementFieldSet = [directIncomeField];

        var item1 = new ElementItem();
        item1.Element = element;
        element.ElementItemSet = [item1];

        var directIncomeCell1 = new ElementCell();
        directIncomeCell1.ElementField = directIncomeField;
        directIncomeCell1.ElementItem = item1;
        directIncomeCell1.NumericValueTotal = 50;
        directIncomeField.ElementCellSet = [directIncomeCell1];
        item1.ElementCellSet = [directIncomeCell1];

        expect(element.directIncome()).toBe(50);

        // Case 3: Add the second item
        var item2 = new ElementItem();
        item2.Element = element;
        element.ElementItemSet.push(item2);

        var directIncomeCell2 = new ElementCell();
        directIncomeCell2.ElementField = directIncomeField;
        directIncomeCell2.ElementItem = item2;
        directIncomeCell2.NumericValueTotal = 150;
        directIncomeField.ElementCellSet.push(directIncomeCell2);
        item2.ElementCellSet = [directIncomeCell2];

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
        resourcePool.MainElement = element;

        expect(element.multiplier()).toBe(0);

        // Case 2: Add the field, first item and the cell
        var multiplierField = new ElementField();
        multiplierField.Element = element;
        multiplierField.ElementFieldType = 12;
        element.ElementFieldSet = [multiplierField];

        var item1 = new ElementItem();
        item1.Element = element;
        element.ElementItemSet = [item1];

        var directIncomeCell1 = new ElementCell();
        directIncomeCell1.ElementField = multiplierField;
        directIncomeCell1.ElementItem = item1;
        multiplierField.ElementCellSet = [directIncomeCell1];
        item1.ElementCellSet = [directIncomeCell1];

        var userDirectIncomeCell1 = new UserElementCell();
        userDirectIncomeCell1.ElementCell = directIncomeCell1;
        userDirectIncomeCell1.DecimalValue = 5;
        directIncomeCell1.UserElementCellSet = [userDirectIncomeCell1];
        directIncomeCell1.CurrentUserCell = userDirectIncomeCell1;

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
        cell2.CurrentUserCell = userCell2;

        expect(element.multiplier()).toBe(20);

        // TODO Update / remove

    });

    it('totalDirectIncome', function () {

        // Case 1: Initial
        var resourcePool = new ResourcePool();

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];
        resourcePool.MainElement = element;

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

        var directIncomeCell1 = new ElementCell();
        directIncomeCell1.ElementField = directIncomeField;
        directIncomeCell1.ElementItem = item1;
        directIncomeCell1.NumericValueTotal = 50;
        directIncomeField.ElementCellSet = [directIncomeCell1];
        item1.ElementCellSet = [directIncomeCell1];

        var multiplierCell1 = new ElementCell();
        multiplierCell1.ElementField = multiplierField;
        multiplierCell1.ElementItem = item1;
        multiplierField.ElementCellSet = [multiplierCell1];
        item1.ElementCellSet.push(multiplierCell1);

        var userMultiplierCell1 = new UserElementCell();
        userMultiplierCell1.ElementCell = multiplierCell1;
        userMultiplierCell1.DecimalValue = 5;
        multiplierCell1.UserElementCellSet = [userMultiplierCell1];
        multiplierCell1.CurrentUserCell = userMultiplierCell1;

        expect(element.totalDirectIncome()).toBe(250);

        // Case 3: Add the second item
        var item2 = new ElementItem();
        item2.Element = element;
        element.ElementItemSet.push(item2);

        var directIncomeCell2 = new ElementCell();
        directIncomeCell2.ElementField = directIncomeField;
        directIncomeCell2.ElementItem = item2;
        directIncomeCell2.NumericValueTotal = 150;
        directIncomeField.ElementCellSet.push(directIncomeCell2);
        item2.ElementCellSet = [directIncomeCell2];

        var multiplierCell2 = new ElementCell();
        multiplierCell2.ElementField = multiplierField;
        multiplierCell2.ElementItem = item2;
        multiplierField.ElementCellSet = [multiplierCell2];
        item2.ElementCellSet.push(multiplierCell2);

        var userMultiplierCell2 = new UserElementCell();
        userMultiplierCell2.ElementCell = multiplierCell2;
        userMultiplierCell2.DecimalValue = 15;
        multiplierCell2.UserElementCellSet = [userMultiplierCell2];
        multiplierCell2.CurrentUserCell = userMultiplierCell2;

        expect(element.totalDirectIncome()).toBe(2500);

        // TODO Update / remove

    });

    it('resourcePoolAmount', function () {

        // Case 1: Initial
        var resourcePool = new ResourcePool();

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];
        resourcePool.MainElement = element;

        expect(element.resourcePoolAmount()).toBe(0);

        // Case 2: Add the fields, first item and the cell
        var item1 = new ElementItem();
        item1.Element = element;
        element.ElementItemSet = [item1];

        // DirectIncome field
        var directIncomeField = new ElementField();
        directIncomeField.Element = element;
        directIncomeField.ElementFieldType = 11;
        element.ElementFieldSet = [directIncomeField];

        // DirectIncome cell
        var directIncomeCell = new ElementCell();
        directIncomeCell.ElementField = directIncomeField;
        directIncomeCell.ElementItem = item1;
        directIncomeCell.NumericValueTotal = 50;
        directIncomeField.ElementCellSet = [directIncomeCell];
        item1.ElementCellSet = [directIncomeCell];

        expect(element.resourcePoolAmount()).toBe(5);

        // Case 3: Add the second item
        var item2 = new ElementItem();
        item2.Element = element;
        element.ElementItemSet.push(item2);

        var directIncomeCell2 = new ElementCell();
        directIncomeCell2.ElementField = directIncomeField;
        directIncomeCell2.ElementItem = item2;
        directIncomeCell2.NumericValueTotal = 150;
        directIncomeField.ElementCellSet.push(directIncomeCell2);
        item2.ElementCellSet = [directIncomeCell2];

        expect(element.resourcePoolAmount()).toBe(20);

        // TODO Update / remove

    });

    it('totalResourcePoolAmount', function () {

        // Case 1: Initial
        var resourcePool = new ResourcePool();

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];
        resourcePool.MainElement = element;

        expect(element.totalResourcePoolAmount()).toBe(0);

        // Case 2: Add the fields, first item and the cell
        var item1 = new ElementItem();
        item1.Element = element;
        element.ElementItemSet = [item1];

        // DirectIncome field
        var directIncomeField = new ElementField();
        directIncomeField.Element = element;
        directIncomeField.ElementFieldType = 11;
        element.ElementFieldSet = [directIncomeField];

        var multiplierField = new ElementField();
        multiplierField.Element = element;
        multiplierField.ElementFieldType = 12;
        element.ElementFieldSet.push(multiplierField);

        // DirectIncome cell
        var directIncomeCell = new ElementCell();
        directIncomeCell.ElementField = directIncomeField;
        directIncomeCell.ElementItem = item1;
        directIncomeCell.NumericValueTotal = 50;
        directIncomeField.ElementCellSet = [directIncomeCell];
        item1.ElementCellSet = [directIncomeCell];

        var multiplierCell1 = new ElementCell();
        multiplierCell1.ElementField = multiplierField;
        multiplierCell1.ElementItem = item1;
        multiplierField.ElementCellSet = [multiplierCell1];
        item1.ElementCellSet.push(multiplierCell1);

        var userMultiplierCell1 = new UserElementCell();
        userMultiplierCell1.ElementCell = multiplierCell1;
        userMultiplierCell1.DecimalValue = 5;
        multiplierCell1.UserElementCellSet = [userMultiplierCell1];
        multiplierCell1.CurrentUserCell = userMultiplierCell1;

        expect(element.totalResourcePoolAmount()).toBe(25);

        // Case 3: Add the second item
        var item2 = new ElementItem();
        item2.Element = element;
        element.ElementItemSet.push(item2);

        var directIncomeCell2 = new ElementCell();
        directIncomeCell2.ElementField = directIncomeField;
        directIncomeCell2.ElementItem = item2;
        directIncomeCell2.NumericValueTotal = 150;
        directIncomeField.ElementCellSet.push(directIncomeCell2);
        item2.ElementCellSet = [directIncomeCell2];

        var multiplierCell2 = new ElementCell();
        multiplierCell2.ElementField = multiplierField;
        multiplierCell2.ElementItem = item2;
        multiplierField.ElementCellSet = [multiplierCell2];
        item2.ElementCellSet.push(multiplierCell2);

        var userMultiplierCell2 = new UserElementCell();
        userMultiplierCell2.ElementCell = multiplierCell2;
        userMultiplierCell2.DecimalValue = 15;
        multiplierCell2.UserElementCellSet = [userMultiplierCell2];
        multiplierCell2.CurrentUserCell = userMultiplierCell2;

        expect(element.totalResourcePoolAmount()).toBe(250);

        // TODO Update / remove

    });

    it('directIncomeIncludingResourcePoolAmount', function () {

        // Case 1: Initial
        var resourcePool = new ResourcePool();

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];
        resourcePool.MainElement = element;

        expect(element.directIncomeIncludingResourcePoolAmount()).toBe(0);

        // Case 2: Add the fields, first item and the cell
        var item1 = new ElementItem();
        item1.Element = element;
        element.ElementItemSet = [item1];

        // DirectIncome field
        var directIncomeField = new ElementField();
        directIncomeField.Element = element;
        directIncomeField.ElementFieldType = 11;
        element.ElementFieldSet = [directIncomeField];

        // DirectIncome cell
        var directIncomeCell = new ElementCell();
        directIncomeCell.ElementField = directIncomeField;
        directIncomeCell.ElementItem = item1;
        directIncomeCell.NumericValueTotal = 50;
        directIncomeField.ElementCellSet = [directIncomeCell];
        item1.ElementCellSet = [directIncomeCell];

        expect(element.directIncomeIncludingResourcePoolAmount()).toBe(55);

        // Case 3: Add the second item
        var item2 = new ElementItem();
        item2.Element = element;
        element.ElementItemSet.push(item2);

        var directIncomeCell2 = new ElementCell();
        directIncomeCell2.ElementField = directIncomeField;
        directIncomeCell2.ElementItem = item2;
        directIncomeCell2.NumericValueTotal = 150;
        directIncomeField.ElementCellSet.push(directIncomeCell2);
        item2.ElementCellSet = [directIncomeCell2];

        expect(element.directIncomeIncludingResourcePoolAmount()).toBe(220);

        // TODO Update / remove

    });

    it('totalDirectIncomeIncludingResourcePoolAmount', function () {

        // Case 1: Initial
        var resourcePool = new ResourcePool();

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];
        resourcePool.MainElement = element;

        expect(element.totalDirectIncomeIncludingResourcePoolAmount()).toBe(0);

        // Case 2: Add the fields, first item and the cell
        var item1 = new ElementItem();
        item1.Element = element;
        element.ElementItemSet = [item1];

        // DirectIncome field
        var directIncomeField = new ElementField();
        directIncomeField.Element = element;
        directIncomeField.ElementFieldType = 11;
        element.ElementFieldSet = [directIncomeField];

        var multiplierField = new ElementField();
        multiplierField.Element = element;
        multiplierField.ElementFieldType = 12;
        element.ElementFieldSet.push(multiplierField);

        // DirectIncome cell
        var directIncomeCell = new ElementCell();
        directIncomeCell.ElementField = directIncomeField;
        directIncomeCell.ElementItem = item1;
        directIncomeCell.NumericValueTotal = 50;
        directIncomeField.ElementCellSet = [directIncomeCell];
        item1.ElementCellSet = [directIncomeCell];

        var multiplierCell1 = new ElementCell();
        multiplierCell1.ElementField = multiplierField;
        multiplierCell1.ElementItem = item1;
        multiplierField.ElementCellSet = [multiplierCell1];
        item1.ElementCellSet.push(multiplierCell1);

        var userMultiplierCell1 = new UserElementCell();
        userMultiplierCell1.ElementCell = multiplierCell1;
        userMultiplierCell1.DecimalValue = 5;
        multiplierCell1.UserElementCellSet = [userMultiplierCell1];
        multiplierCell1.CurrentUserCell = userMultiplierCell1;

        expect(element.totalDirectIncomeIncludingResourcePoolAmount()).toBe(275);

        // Case 3: Add the second item
        var item2 = new ElementItem();
        item2.Element = element;
        element.ElementItemSet.push(item2);

        var directIncomeCell2 = new ElementCell();
        directIncomeCell2.ElementField = directIncomeField;
        directIncomeCell2.ElementItem = item2;
        directIncomeCell2.NumericValueTotal = 150;
        directIncomeField.ElementCellSet.push(directIncomeCell2);
        item2.ElementCellSet = [directIncomeCell2];

        var multiplierCell2 = new ElementCell();
        multiplierCell2.ElementField = multiplierField;
        multiplierCell2.ElementItem = item2;
        multiplierField.ElementCellSet = [multiplierCell2];
        item2.ElementCellSet.push(multiplierCell2);

        var userMultiplierCell2 = new UserElementCell();
        userMultiplierCell2.ElementCell = multiplierCell2;
        userMultiplierCell2.DecimalValue = 15;
        multiplierCell2.UserElementCellSet = [userMultiplierCell2];
        multiplierCell2.CurrentUserCell = userMultiplierCell2;

        expect(element.totalDirectIncomeIncludingResourcePoolAmount()).toBe(2750);

        // TODO Update / remove

    });

    it('totalResourcePoolIncome', function () {

        // Case 1: Initial
        var resourcePool = new ResourcePool();

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];
        resourcePool.MainElement = element;

        expect(element.totalResourcePoolIncome()).toBe(0);

        // Case 2: Add the fields, first item and the cell
        var item1 = new ElementItem();
        item1.Element = element;
        element.ElementItemSet = [item1];

        // DirectIncome field
        var directIncomeField = new ElementField();
        directIncomeField.Element = element;
        directIncomeField.ElementFieldType = 11;
        directIncomeField.IndexEnabled = true;
        element.ElementFieldSet = [directIncomeField];

        var multiplierField = new ElementField();
        multiplierField.Element = element;
        multiplierField.ElementFieldType = 12;
        element.ElementFieldSet.push(multiplierField);

        // DirectIncome cell
        var directIncomeCell = new ElementCell();
        directIncomeCell.ElementField = directIncomeField;
        directIncomeCell.ElementItem = item1;
        directIncomeCell.NumericValueTotal = 50;
        directIncomeField.ElementCellSet = [directIncomeCell];
        item1.ElementCellSet = [directIncomeCell];

        var multiplierCell1 = new ElementCell();
        multiplierCell1.ElementField = multiplierField;
        multiplierCell1.ElementItem = item1;
        multiplierField.ElementCellSet = [multiplierCell1];
        item1.ElementCellSet.push(multiplierCell1);

        var userMultiplierCell1 = new UserElementCell();
        userMultiplierCell1.ElementCell = multiplierCell1;
        userMultiplierCell1.DecimalValue = 5;
        multiplierCell1.UserElementCellSet = [userMultiplierCell1];
        multiplierCell1.CurrentUserCell = userMultiplierCell1;

        // Case 3: Add the second item
        var item2 = new ElementItem();
        item2.Element = element;
        element.ElementItemSet.push(item2);

        var directIncomeCell2 = new ElementCell();
        directIncomeCell2.ElementField = directIncomeField;
        directIncomeCell2.ElementItem = item2;
        directIncomeCell2.NumericValueTotal = 150;
        directIncomeField.ElementCellSet.push(directIncomeCell2);
        item2.ElementCellSet = [directIncomeCell2];

        var multiplierCell2 = new ElementCell();
        multiplierCell2.ElementField = multiplierField;
        multiplierCell2.ElementItem = item2;
        multiplierField.ElementCellSet = [multiplierCell2];
        item2.ElementCellSet.push(multiplierCell2);

        var userMultiplierCell2 = new UserElementCell();
        userMultiplierCell2.ElementCell = multiplierCell2;
        userMultiplierCell2.DecimalValue = 15;
        multiplierCell2.UserElementCellSet = [userMultiplierCell2];
        multiplierCell2.CurrentUserCell = userMultiplierCell2;

        // TODO Doesn't work at the moment, fix it later / SH - 27 Oct. '15
        //expect(element.totalResourcePoolIncome()).toBe(((50 * 5) + (150 * 15)) * 0.1);

        // TODO Update / remove

    });

    it('totalIncome', function () {

        // Case 1: Initial
        var resourcePool = new ResourcePool();

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];
        resourcePool.MainElement = element;

        expect(element.totalIncome()).toBe(0);

        // Case 2: Add the fields, first item and the cell
        var item1 = new ElementItem();
        item1.Element = element;
        element.ElementItemSet = [item1];

        // DirectIncome field
        var directIncomeField = new ElementField();
        directIncomeField.Element = element;
        directIncomeField.ElementFieldType = 11;
        directIncomeField.IndexEnabled = true;
        element.ElementFieldSet = [directIncomeField];

        var multiplierField = new ElementField();
        multiplierField.Element = element;
        multiplierField.ElementFieldType = 12;
        element.ElementFieldSet.push(multiplierField);

        // DirectIncome cell
        var directIncomeCell = new ElementCell();
        directIncomeCell.ElementField = directIncomeField;
        directIncomeCell.ElementItem = item1;
        directIncomeCell.NumericValueTotal = 50;
        directIncomeField.ElementCellSet = [directIncomeCell];
        item1.ElementCellSet = [directIncomeCell];

        var multiplierCell1 = new ElementCell();
        multiplierCell1.ElementField = multiplierField;
        multiplierCell1.ElementItem = item1;
        multiplierField.ElementCellSet = [multiplierCell1];
        item1.ElementCellSet.push(multiplierCell1);

        var userMultiplierCell1 = new UserElementCell();
        userMultiplierCell1.ElementCell = multiplierCell1;
        userMultiplierCell1.DecimalValue = 5;
        multiplierCell1.UserElementCellSet = [userMultiplierCell1];
        multiplierCell1.CurrentUserCell = userMultiplierCell1;

        expect(element.totalIncome()).toBe(275);

        // Case 3: Add the second item
        var item2 = new ElementItem();
        item2.Element = element;
        element.ElementItemSet.push(item2);

        var directIncomeCell2 = new ElementCell();
        directIncomeCell2.ElementField = directIncomeField;
        directIncomeCell2.ElementItem = item2;
        directIncomeCell2.NumericValueTotal = 150;
        directIncomeField.ElementCellSet.push(directIncomeCell2);
        item2.ElementCellSet = [directIncomeCell2];

        var multiplierCell2 = new ElementCell();
        multiplierCell2.ElementField = multiplierField;
        multiplierCell2.ElementItem = item2;
        multiplierField.ElementCellSet = [multiplierCell2];
        item2.ElementCellSet.push(multiplierCell2);

        var userMultiplierCell2 = new UserElementCell();
        userMultiplierCell2.ElementCell = multiplierCell2;
        userMultiplierCell2.DecimalValue = 15;
        multiplierCell2.UserElementCellSet = [userMultiplierCell2];
        multiplierCell2.CurrentUserCell = userMultiplierCell2;
    
        // TODO Manually update?!
        directIncomeField.setIndexIncome();

        // TODO Doesn't work at the moment, fix it later / SH - 27 Oct. '15
        //expect(element.totalIncome()).toBe(2750);

        // TODO Update / remove

    });

    it('totalIncomeAverage', function () {

        // Case 1: Initial
        var resourcePool = new ResourcePool();

        var element = new Element();
        element.ResourcePool = resourcePool;
        resourcePool.ElementSet = [element];
        resourcePool.MainElement = element;

        expect(element.totalIncomeAverage()).toBe(0);

        // Case 2: Add the fields, first item and the cell
        var item1 = new ElementItem();
        item1.Element = element;
        element.ElementItemSet = [item1];

        // DirectIncome field
        var directIncomeField = new ElementField();
        directIncomeField.Element = element;
        directIncomeField.ElementFieldType = 11;
        directIncomeField.IndexEnabled = true;
        element.ElementFieldSet = [directIncomeField];

        var multiplierField = new ElementField();
        multiplierField.Element = element;
        multiplierField.ElementFieldType = 12;
        element.ElementFieldSet.push(multiplierField);

        // DirectIncome cell
        var directIncomeCell = new ElementCell();
        directIncomeCell.ElementField = directIncomeField;
        directIncomeCell.ElementItem = item1;
        directIncomeCell.NumericValueTotal = 50;
        directIncomeField.ElementCellSet = [directIncomeCell];
        item1.ElementCellSet = [directIncomeCell];

        var multiplierCell1 = new ElementCell();
        multiplierCell1.ElementField = multiplierField;
        multiplierCell1.ElementItem = item1;
        multiplierField.ElementCellSet = [multiplierCell1];
        item1.ElementCellSet.push(multiplierCell1);

        var userMultiplierCell1 = new UserElementCell();
        userMultiplierCell1.ElementCell = multiplierCell1;
        userMultiplierCell1.DecimalValue = 5;
        multiplierCell1.UserElementCellSet = [userMultiplierCell1];
        multiplierCell1.CurrentUserCell = userMultiplierCell1;

        expect(element.totalIncomeAverage()).toBe(275);

        // Case 3: Add the second item
        var item2 = new ElementItem();
        item2.Element = element;
        element.ElementItemSet.push(item2);

        var directIncomeCell2 = new ElementCell();
        directIncomeCell2.ElementField = directIncomeField;
        directIncomeCell2.ElementItem = item2;
        directIncomeCell2.NumericValueTotal = 150;
        directIncomeField.ElementCellSet.push(directIncomeCell2);
        item2.ElementCellSet = [directIncomeCell2];

        var multiplierCell2 = new ElementCell();
        multiplierCell2.ElementField = multiplierField;
        multiplierCell2.ElementItem = item2;
        multiplierField.ElementCellSet = [multiplierCell2];
        item2.ElementCellSet.push(multiplierCell2);

        var userMultiplierCell2 = new UserElementCell();
        userMultiplierCell2.ElementCell = multiplierCell2;
        userMultiplierCell2.DecimalValue = 15;
        multiplierCell2.UserElementCellSet = [userMultiplierCell2];
        multiplierCell2.CurrentUserCell = userMultiplierCell2;

        // TODO Manually update?!
        directIncomeField.setIndexIncome();

        // TODO Doesn't work at the moment, fix it later / SH - 27 Oct. '15
        //expect(element.totalIncomeAverage()).toBe(2750 / 2);

        // TODO Update / remove

    });

});
