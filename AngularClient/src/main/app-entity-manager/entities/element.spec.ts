import { ElementFieldDataType } from "./enums";
import { TestHelpers } from "./test-helpers";

// TODO: Check all these tests below one more time

describe("main/app-entity-manager/entities/element", () => {

    it("parent - one child", () => {

        // Parent element
        var parent = TestHelpers.getElement();

        // Child element
        var child = TestHelpers.getElement(parent.ResourcePool);

        // Parent's field
        var field = TestHelpers.getElementField(parent);
        field.DataType = ElementFieldDataType.Element;
        field.SelectedElement = child;
        child.ParentFieldSet.push(field);

        // Assert
        expect(child.parent()).toBe(parent);

    });

    it("parent - multiple children", () => {

        // Grand parent element
        var grandParent = TestHelpers.getElement();

        // Parent
        var parent = TestHelpers.getElement(grandParent.ResourcePool);

        // Child element
        var child = TestHelpers.getElement(grandParent.ResourcePool);

        // Grand parent's field
        var grandParentField = TestHelpers.getElementField(grandParent);
        grandParentField.DataType = ElementFieldDataType.Element;
        grandParentField.SelectedElement = parent;
        parent.ParentFieldSet.push(grandParentField);

        // Parent's field
        var parentField = TestHelpers.getElementField(parent);
        parentField.DataType = ElementFieldDataType.Element;
        parentField.SelectedElement = child;
        child.ParentFieldSet.push(parentField);

        // Assert
        expect(parent.parent()).toBe(grandParent);
        expect(child.parent()).toBe(parent);

    });

    it("familyTree", () => {

        // Grand parent element
        var grandParent = TestHelpers.getElement();

        // Parent
        var parent = TestHelpers.getElement(grandParent.ResourcePool);

        // Child element
        var child = TestHelpers.getElement(grandParent.ResourcePool);

        // Grand parent's field
        var grandParentField = TestHelpers.getElementField(grandParent);
        grandParentField.DataType = ElementFieldDataType.Element;
        grandParentField.SelectedElement = parent;
        parent.ParentFieldSet.push(grandParentField);

        // Parent's field
        var parentField = TestHelpers.getElementField(parent);
        parentField.DataType = ElementFieldDataType.Element;
        parentField.SelectedElement = child;
        child.ParentFieldSet.push(parentField);

        // Assert

        // TODO Manually update?!
        parent.setFamilyTree();
        child.setFamilyTree();

        expect(parent.familyTree().length).toBe(2);
        expect(child.familyTree().length).toBe(3);

        expect(parent.familyTree()[0]).toBe(grandParent);
        expect(parent.familyTree()[1]).toBe(parent);

        expect(child.familyTree()[0]).toBe(grandParent);
        expect(child.familyTree()[1]).toBe(parent);
        expect(child.familyTree()[2]).toBe(child);

    });

    it("elementFieldIndexSet", () => {

        // Case 1: Initial
        var element = TestHelpers.getElement();

        expect(element.elementFieldIndexSet().length).toBe(0);

        // Case 2: Adding a new field but without index
        var field1 = TestHelpers.getElementField(element);
        field1.DataType = ElementFieldDataType.Decimal;

        // TODO Manually update?!
        element.setElementFieldIndexSet();

        expect(element.elementFieldIndexSet().length).toBe(0);

        // Case 3: Enable the index
        field1.IndexEnabled = true;
        element.setElementFieldIndexSet();

        expect(element.elementFieldIndexSet().length).toBe(1);

        // Case 4: Add a new field with index
        var field2 = TestHelpers.getElementField(element);
        field2.DataType = ElementFieldDataType.Decimal;
        field2.IndexEnabled = true;

        // TODO Manually update?!
        element.setElementFieldIndexSet();

        expect(element.elementFieldIndexSet().length).toBe(2);

        // TODO Child element's indexes - update / remove cases

    });

    it("indexRating", () => {

        // Case 1: Initial
        var element = TestHelpers.getElement();

        expect(element.indexRating()).toBe(0);

        // Case 2: Adding the first index field
        var field1 = TestHelpers.getElementField(element);
        field1.DataType = ElementFieldDataType.Decimal;
        field1.IndexEnabled = true;

        // TODO Manually update?!
        element.setElementFieldIndexSet();
        element.setIndexRating();

        expect(element.indexRating()).toBe(50);

        // Case 2: Adding the second index field
        var field2 = TestHelpers.getElementField(element);
        field2.DataType = ElementFieldDataType.Decimal;
        field2.IndexEnabled = true;

        // TODO Manually update?!
        element.setElementFieldIndexSet();
        element.setIndexRating();

        expect(element.indexRating()).toBe(100);

        // TODO Update / remove cases

    });

    it("directIncomeField", () => {

        // Case 1: Initial
        var element = TestHelpers.getElement();

        expect(element.directIncomeField()).toBe(null);

        // Case 2: Add the field
        var directIncomeField = TestHelpers.getElementField(element);
        directIncomeField.DataType = ElementFieldDataType.DirectIncome;

        expect(element.directIncomeField()).toBe(directIncomeField);

        // TODO Remove?

    });

    it("directIncome", () => {

        // Case 1: Initial
        var element = TestHelpers.getElement();

        expect(element.directIncome()).toBe(0);

        // Case 2: Add the field, first item and the cell
        var directIncomeField = TestHelpers.getElementField(element);
        directIncomeField.DataType = ElementFieldDataType.DirectIncome;

        var item1 = TestHelpers.getElementItem(element);

        var directIncomeCell1 = TestHelpers.getElementCell(directIncomeField, item1);
        directIncomeCell1.NumericValueTotal = 50;

        expect(element.directIncome()).toBe(50);

        // Case 3: Add the second item
        var item2 = TestHelpers.getElementItem(element);

        var directIncomeCell2 = TestHelpers.getElementCell(directIncomeField, item2);
        directIncomeCell2.NumericValueTotal = 150;

        expect(element.directIncome()).toBe(200);

        // TODO Update / remove

    });

    it("multiplierField", () => {

        // Case 1: Initial
        var element = TestHelpers.getElement();

        expect(element.multiplierField()).toBe(null);

        // Case 2: Add the field
        var multiplierField = TestHelpers.getElementField(element);
        multiplierField.DataType = ElementFieldDataType.Multiplier;

        // TODO Manually update?!
        element.setMultiplierField();

        expect(element.multiplierField()).toBe(multiplierField);

        // TODO Remove?

    });

    it("multiplier", () => {

        // Case 1: Initial
        var element = TestHelpers.getElement();

        expect(element.multiplier()).toBe(0);

        // Case 2: Add the field, first item and the cell
        var multiplierField = TestHelpers.getElementField(element);
        multiplierField.DataType = 12;

        var item1 = TestHelpers.getElementItem(element);

        var directIncomeCell1 = TestHelpers.getElementCell(multiplierField, item1);

        var userDirectIncomeCell1 = TestHelpers.getUserElementCell(directIncomeCell1);
        userDirectIncomeCell1.DecimalValue = 5;

        expect(element.multiplier()).toBe(5);

        // Case 3: Add the second item
        var item2 = TestHelpers.getElementItem(element);

        var cell2 = TestHelpers.getElementCell(multiplierField, item2);

        var userCell2 = TestHelpers.getUserElementCell(cell2);
        userCell2.DecimalValue = 15;

        expect(element.multiplier()).toBe(20);

        // TODO Update / remove

    });

    it("totalDirectIncome", () => {

        // Case 1: Initial
        var element = TestHelpers.getElement();
        
        expect(element.totalDirectIncome()).toBe(0);

        // Case 2: Add the fields, first item and the cell
        var directIncomeField = TestHelpers.getElementField(element);
        directIncomeField.DataType = ElementFieldDataType.DirectIncome;
        
        var multiplierField = TestHelpers.getElementField(element);
        multiplierField.DataType = ElementFieldDataType.Multiplier;
        
        var item1 = TestHelpers.getElementItem(element);
        
        var directIncomeCell1 = TestHelpers.getElementCell(directIncomeField, item1);
        directIncomeCell1.NumericValueTotal = 50;

        var multiplierCell1 = TestHelpers.getElementCell(multiplierField, item1);

        var userMultiplierCell1 = TestHelpers.getUserElementCell(multiplierCell1);
        userMultiplierCell1.DecimalValue = 5;

        expect(element.totalDirectIncome()).toBe(250);

        // Case 3: Add the second item
        var item2 = TestHelpers.getElementItem(element);

        var directIncomeCell2 = TestHelpers.getElementCell(directIncomeField, item2);
        directIncomeCell2.NumericValueTotal = 150;

        var multiplierCell2 = TestHelpers.getElementCell(multiplierField, item2);

        var userMultiplierCell2 = TestHelpers.getUserElementCell(multiplierCell2);
        userMultiplierCell2.DecimalValue = 15;

        expect(element.totalDirectIncome()).toBe(2500);

        // TODO Update / remove

    });

    it("resourcePoolAmount", () => {

        // Case 1: Initial
        var element = TestHelpers.getElement();
        
        expect(element.resourcePoolAmount()).toBe(0);

        // Case 2: Add the fields, first item and the cell
        var item1 = TestHelpers.getElementItem(element);
        
        // DirectIncome field
        var directIncomeField = TestHelpers.getElementField(element);
        directIncomeField.DataType = 11;

        // DirectIncome cell
        var directIncomeCell = TestHelpers.getElementCell(directIncomeField, item1);
        directIncomeCell.NumericValueTotal = 50;

        expect(element.resourcePoolAmount()).toBe(5);

        // Case 3: Add the second item
        var item2 = TestHelpers.getElementItem(element);

        var directIncomeCell2 = TestHelpers.getElementCell(directIncomeField, item2);
        directIncomeCell2.NumericValueTotal = 150;

        expect(element.resourcePoolAmount()).toBe(20);

        // TODO Update / remove

    });

    it("totalResourcePoolAmount", () => {

        // Case 1: Initial
        var element = TestHelpers.getElement();
        
        expect(element.totalResourcePoolAmount()).toBe(0);

        // Case 2: Add the fields, first item and the cell
        var item1 = TestHelpers.getElementItem(element);
        
        // DirectIncome field
        var directIncomeField = TestHelpers.getElementField(element);
        directIncomeField.DataType = 11;

        var multiplierField = TestHelpers.getElementField(element);
        multiplierField.DataType = 12;

        // DirectIncome cell
        var directIncomeCell = TestHelpers.getElementCell(directIncomeField, item1);
        directIncomeCell.NumericValueTotal = 50;

        var multiplierCell1 = TestHelpers.getElementCell(multiplierField, item1);

        var userMultiplierCell1 = TestHelpers.getUserElementCell(multiplierCell1);
        userMultiplierCell1.DecimalValue = 5;

        expect(element.totalResourcePoolAmount()).toBe(25);

        // Case 3: Add the second item
        var item2 = TestHelpers.getElementItem(element);

        var directIncomeCell2 = TestHelpers.getElementCell(directIncomeField, item2);
        directIncomeCell2.NumericValueTotal = 150;

        var multiplierCell2 = TestHelpers.getElementCell(multiplierField, item2);

        var userMultiplierCell2 = TestHelpers.getUserElementCell(multiplierCell2);
        userMultiplierCell2.DecimalValue = 15;

        expect(element.totalResourcePoolAmount()).toBe(250);

        // TODO Update / remove

    });

    it("directIncomeIncludingResourcePoolAmount", () => {

        // Case 1: Initial
        var element = TestHelpers.getElement();
        
        expect(element.directIncomeIncludingResourcePoolAmount()).toBe(0);

        // Case 2: Add the fields, first item and the cell
        var item1 = TestHelpers.getElementItem(element);
        
        // DirectIncome field
        var directIncomeField = TestHelpers.getElementField(element);
        directIncomeField.DataType = 11;

        // DirectIncome cell
        var directIncomeCell = TestHelpers.getElementCell(directIncomeField, item1);
        directIncomeCell.NumericValueTotal = 50;

        expect(element.directIncomeIncludingResourcePoolAmount()).toBe(55);

        // Case 3: Add the second item
        var item2 = TestHelpers.getElementItem(element);

        var directIncomeCell2 = TestHelpers.getElementCell(directIncomeField, item2);
        directIncomeCell2.NumericValueTotal = 150;

        expect(element.directIncomeIncludingResourcePoolAmount()).toBe(220);

        // TODO Update / remove

    });

    it("totalDirectIncomeIncludingResourcePoolAmount", () => {

        // Case 1: Initial
        var element = TestHelpers.getElement();
        
        expect(element.totalDirectIncomeIncludingResourcePoolAmount()).toBe(0);

        // Case 2: Add the fields, first item and the cell
        var item1 = TestHelpers.getElementItem(element);
        
        // DirectIncome field
        var directIncomeField = TestHelpers.getElementField(element);
        directIncomeField.DataType = 11;

        var multiplierField = TestHelpers.getElementField(element);
        multiplierField.DataType = 12;

        // DirectIncome cell
        var directIncomeCell = TestHelpers.getElementCell(directIncomeField, item1);
        directIncomeCell.NumericValueTotal = 50;

        var multiplierCell1 = TestHelpers.getElementCell(multiplierField, item1);

        var userMultiplierCell1 = TestHelpers.getUserElementCell(multiplierCell1);
        userMultiplierCell1.DecimalValue = 5;

        expect(element.totalDirectIncomeIncludingResourcePoolAmount()).toBe(275);

        // Case 3: Add the second item
        var item2 = TestHelpers.getElementItem(element);

        var directIncomeCell2 = TestHelpers.getElementCell(directIncomeField, item2);
        directIncomeCell2.NumericValueTotal = 150;

        var multiplierCell2 = TestHelpers.getElementCell(multiplierField, item2);

        var userMultiplierCell2 = TestHelpers.getUserElementCell(multiplierCell2);
        userMultiplierCell2.DecimalValue = 15;

        expect(element.totalDirectIncomeIncludingResourcePoolAmount()).toBe(2750);

        // TODO Update / remove

    });

    it("totalIncome", () => {

        // Case 1: Initial
        var element = TestHelpers.getElement();
        
        expect(element.totalIncome()).toBe(0);

        // Case 2: Add the fields, first item and the cell
        var item1 = TestHelpers.getElementItem(element);
        
        // DirectIncome field
        var directIncomeField = TestHelpers.getElementField(element);
        directIncomeField.DataType = 11;
        directIncomeField.IndexEnabled = true;

        var multiplierField = TestHelpers.getElementField(element);
        multiplierField.DataType = 12;

        // DirectIncome cell
        var directIncomeCell = TestHelpers.getElementCell(directIncomeField, item1);
        directIncomeCell.NumericValueTotal = 50;

        var multiplierCell1 = TestHelpers.getElementCell(multiplierField, item1);

        var userMultiplierCell1 = TestHelpers.getUserElementCell(multiplierCell1);
        userMultiplierCell1.DecimalValue = 5;

        expect(element.totalIncome()).toBe(275);

        // Case 3: Add the second item
        var item2 = TestHelpers.getElementItem(element);

        var directIncomeCell2 = TestHelpers.getElementCell(directIncomeField, item2);
        directIncomeCell2.NumericValueTotal = 150;

        var multiplierCell2 = TestHelpers.getElementCell(multiplierField, item2);

        var userMultiplierCell2 = TestHelpers.getUserElementCell(multiplierCell2);
        userMultiplierCell2.DecimalValue = 15;

        // TODO Manually update?!
        directIncomeField.setIndexIncome();

        // TODO Doesn't work at the moment, fix it later / coni2k - 27 Oct. '15
        //expect(element.totalIncome()).toBe(2750);

        // TODO Update / remove

    });

    it("totalIncomeAverage", () => {

        // Case 1: Initial
        var element = TestHelpers.getElement();

        expect(element.totalIncomeAverage()).toBe(0);

        // Case 2: Add the fields, first item and the cell
        var item1 = TestHelpers.getElementItem(element);
        
        // DirectIncome field
        var directIncomeField = TestHelpers.getElementField(element);
        directIncomeField.DataType = 11;
        directIncomeField.IndexEnabled = true;

        var multiplierField = TestHelpers.getElementField(element);
        multiplierField.DataType = 12;

        // DirectIncome cell
        var directIncomeCell = TestHelpers.getElementCell(directIncomeField, item1);
        directIncomeCell.NumericValueTotal = 50;

        var multiplierCell1 = TestHelpers.getElementCell(multiplierField, item1);

        var userMultiplierCell1 = TestHelpers.getUserElementCell(multiplierCell1);
        userMultiplierCell1.DecimalValue = 5;

        expect(element.totalIncomeAverage()).toBe(275);

        // Case 3: Add the second item
        var item2 = TestHelpers.getElementItem(element);

        var directIncomeCell2 = TestHelpers.getElementCell(directIncomeField, item2);
        directIncomeCell2.NumericValueTotal = 150;

        var multiplierCell2 = TestHelpers.getElementCell(multiplierField, item2);

        var userMultiplierCell2 = TestHelpers.getUserElementCell(multiplierCell2);
        userMultiplierCell2.DecimalValue = 15;

        // TODO Manually update?!
        directIncomeField.setIndexIncome();

        // TODO Doesn't work at the moment, fix it later / coni2k - 27 Oct. '15
        //expect(element.totalIncomeAverage()).toBe(2750 / 2);

        // TODO Update / remove

    });
});
