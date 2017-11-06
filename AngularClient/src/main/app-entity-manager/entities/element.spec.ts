import { ElementFieldDataType } from "./element-field";
import { TestHelpers } from "./test-helpers";

// TODO: Check all these tests below one more time

describe("main/app-entity-manager/entities/element", () => {

    it("parent - one child", () => {

        // Parent element
        var parent = TestHelpers.createElement();

        // Child element
        var child = TestHelpers.createElement(parent.ResourcePool);

        // Parent's field
        var field = TestHelpers.createElementField(parent);
        field.DataType = ElementFieldDataType.Element;
        field.SelectedElement = child;
        child.ParentFieldSet.push(field);

        // Assert
        expect(child.parent()).toBe(parent);

    });

    it("parent - multiple children", () => {

        // Grand parent element
        var grandParent = TestHelpers.createElement();

        // Parent
        var parent = TestHelpers.createElement(grandParent.ResourcePool);

        // Child element
        var child = TestHelpers.createElement(grandParent.ResourcePool);

        // Grand parent's field
        var grandParentField = TestHelpers.createElementField(grandParent);
        grandParentField.DataType = ElementFieldDataType.Element;
        grandParentField.SelectedElement = parent;
        parent.ParentFieldSet.push(grandParentField);

        // Parent's field
        var parentField = TestHelpers.createElementField(parent);
        parentField.DataType = ElementFieldDataType.Element;
        parentField.SelectedElement = child;
        child.ParentFieldSet.push(parentField);

        // Assert
        expect(parent.parent()).toBe(grandParent);
        expect(child.parent()).toBe(parent);

    });

    it("familyTree", () => {

        // Grand parent element
        var grandParent = TestHelpers.createElement();

        // Parent
        var parent = TestHelpers.createElement(grandParent.ResourcePool);

        // Child element
        var child = TestHelpers.createElement(grandParent.ResourcePool);

        // Grand parent's field
        var grandParentField = TestHelpers.createElementField(grandParent);
        grandParentField.DataType = ElementFieldDataType.Element;
        grandParentField.SelectedElement = parent;
        parent.ParentFieldSet.push(grandParentField);

        // Parent's field
        var parentField = TestHelpers.createElementField(parent);
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

    it("elementFieldSet", () => {

        // Case 1: Initial
        var element = TestHelpers.createElement();

        expect(element.elementFieldSet().length).toBe(0);

        // Case 2: Adding a new field but without index
        var field1 = TestHelpers.createElementField(element, ElementFieldDataType.Decimal);

        expect(element.elementFieldSet().length).toBe(1);

        // Case 3: Enable the index
        field1.IndexEnabled = false;

        expect(element.elementFieldSet().length).toBe(0);

        // Case 4: Add a new field with index
        TestHelpers.createElementField(element, ElementFieldDataType.Decimal);

        expect(element.elementFieldSet().length).toBe(1);

        // TODO Child element's indexes - update / remove cases

    });

    it("income", () => {

        // Case 1: Initial
        var element = TestHelpers.createElement();

        expect(element.income()).toBe(0);

        // Case 2: Set initial value, add the fields, first item and the cell
        element.ResourcePool.InitialValue = 275;

        var item1 = TestHelpers.createElementItem(element);

        // Decimal field
        var decimalField = TestHelpers.createElementField(element, ElementFieldDataType.Decimal);

        // Decimal cell
        TestHelpers.createElementCell(decimalField, item1, 50);

        expect(element.income()).toBe(275);

        // Case 3: Add the second item
        var item2 = TestHelpers.createElementItem(element);

        TestHelpers.createElementCell(decimalField, item2, 150);

        // TODO Doesn't work at the moment, fix it later / coni2k - 27 Oct. '15
        //expect(element.income()).toBe(2750);

        // TODO Update / remove

    });

    it("indexRating", () => {

        // Case 1: Initial
        var element = TestHelpers.createElement();

        expect(element.indexRating()).toBe(0);

        // Case 2: Adding the first index field
        TestHelpers.createElementField(element, ElementFieldDataType.Decimal);

        expect(element.indexRating()).toBe(50);

        // Case 2: Adding the second index field
        TestHelpers.createElementField(element, ElementFieldDataType.Decimal);

        expect(element.indexRating()).toBe(100);

        // TODO Update / remove cases

    });
});
