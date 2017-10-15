import { ResourcePool } from "./resource-pool";
import { Element } from "./element";
import { ElementField, ElementFieldDataType } from "./element-field";
import { UserElementField } from "./user-element-field";
import { ElementItem } from "./element-item";
import { ElementCell } from "./element-cell";
import { UserElementCell } from "./user-element-cell";

export class TestHelpers {

    static createElement(resourcePool?: ResourcePool): Element {

        if (!resourcePool) {
            resourcePool = TestHelpers.createResourcePool();
        }

        // Element
        const element = new Element();
        element.ResourcePool = resourcePool;
        element.IsMainElement = true;
        element.ElementFieldSet = [];
        element.ElementItemSet = [];
        element.ParentFieldSet = [];

        // Cross relation
        resourcePool.ElementSet.push(element);

        element.initialize();

        return element;
    }

    static createElementCell(elementField?: ElementField, elementItem?: ElementItem, numericValueTotal?: number, numericValueCount?: number, userCellDecimalValue?: number): ElementCell {

        if (!elementField) {
            const element = elementItem ? elementItem.Element : null;
            elementField = TestHelpers.createElementField(element);
        }

        if (!elementItem) {
            elementItem = TestHelpers.createElementItem(elementField.Element);
        }

        // Element cell
        const elementCell = new ElementCell();
        elementCell.ElementField = elementField;
        elementCell.ElementItem = elementItem;
        elementCell.UserElementCellSet = [];

        if (numericValueTotal) {
            elementCell.NumericValueTotal = numericValueTotal;
        }

        if (numericValueCount) {
            elementCell.NumericValueCount = numericValueCount;
        }

        // Cross relation
        elementField.ElementCellSet.push(elementCell);
        elementItem.ElementCellSet.push(elementCell);

        // User cell
        if (userCellDecimalValue) {
            TestHelpers.createUserElementCell(elementCell, userCellDecimalValue);
        }

        elementCell.initialize();

        return elementCell;
    }

    static createElementField(element?: Element, dataType?: ElementFieldDataType, indexRatingTotal?: number, indexRatingCount?: number, userElementFieldRating?: number): ElementField {

        if (!element) {
            const resourcePool = TestHelpers.createResourcePool();
            element = TestHelpers.createElement(resourcePool);
        }

        // Element field
        const elementField = new ElementField();
        elementField.Element = element;
        elementField.IndexEnabled = true;
        elementField.ElementCellSet = [];
        elementField.UserElementFieldSet = [];

        if (dataType) {
            elementField.DataType = dataType;
        }

        if (indexRatingTotal) {
            elementField.IndexRatingTotal = indexRatingTotal;
        }

        if (indexRatingCount) {
            elementField.IndexRatingCount = indexRatingCount;
        }

        // Cross relation
        element.ElementFieldSet.push(elementField);

        // User element field
        if (userElementFieldRating) {
            TestHelpers.createUserElementField(elementField, userElementFieldRating);
        }

        elementField.initialize();

        return elementField;
    }

    static createElementItem(element?: Element): ElementItem {

        if (!element) {
            const resourcePool = TestHelpers.createResourcePool();
            element = TestHelpers.createElement(resourcePool);
        }

        // Element item
        const elementItem = new ElementItem();
        elementItem.Element = element;
        elementItem.ElementCellSet = [];
        elementItem.ParentCellSet = [];

        // Cross relation
        element.ElementItemSet.push(elementItem);

        elementItem.initialize();

        return elementItem;
    }

    static createResourcePool(): ResourcePool {
        const resourcePool = new ResourcePool();
        resourcePool.ElementSet = [];
        resourcePool.initialize();
        return resourcePool;
    }

    static createUserElementCell(elementCell: ElementCell, decimalValue?: number): UserElementCell {

        // User element cell
        const userElementCell = new UserElementCell();
        userElementCell.ElementCell = elementCell;

        if (decimalValue) {
            userElementCell.DecimalValue = decimalValue;
        }

        // Cross relation
        elementCell.UserElementCellSet.push(userElementCell);

        userElementCell.initialize();

        return userElementCell;
    }

    static createUserElementField(elementField: ElementField, rating?: number): UserElementField {

        // User element field
        const userElementField = new UserElementField();
        userElementField.ElementField = elementField;

        if (rating) {
            userElementField.Rating = rating;
        }

        // Cross relation
        elementField.UserElementFieldSet.push(userElementField);

        userElementField.initialize();

        return userElementField;
    }
}
