import { ResourcePool } from "./resource-pool";
import { UserResourcePool } from "./user-resource-pool";
import { Element } from "./element";
import { ElementField } from "./element-field";
import { UserElementField } from "./user-element-field";
import { ElementItem } from "./element-item";
import { ElementCell } from "./element-cell";
import { UserElementCell } from "./user-element-cell";
import { ElementFieldDataType } from "./enums";

export class TestHelpers {

    static getElement(resourcePool?: ResourcePool): Element {

        if (!resourcePool) {
            resourcePool = TestHelpers.getResourcePool();
        }

        // Element
        var element = new Element();
        element.ResourcePool = resourcePool;
        element.IsMainElement = true;
        element.ElementFieldSet = [];
        element.ElementItemSet = [];
        element.ParentFieldSet = [];
        element.initialized = true;

        // Cross relation
        resourcePool.ElementSet.push(element);

        return element;
    }

    static getElementCell(elementField?: ElementField, elementItem?: ElementItem): ElementCell {

        if (!elementField) {
            var element = elementItem ? elementItem.Element : null;
            elementField = TestHelpers.getElementField(element);
        }

        if (!elementItem) {
            elementItem = TestHelpers.getElementItem(elementField.Element);
        }

        // Element cell
        var elementCell = new ElementCell();
        elementCell.ElementField = elementField;
        elementCell.ElementItem = elementItem;
        elementCell.UserElementCellSet = [];
        elementCell.initialized = true;

        // Cross relation
        elementField.ElementCellSet.push(elementCell);
        elementItem.ElementCellSet.push(elementCell);

        return elementCell;
    }

    static getElementField(element?: Element): ElementField {

        if (!element) {
            var resourcePool = TestHelpers.getResourcePool();
            element = TestHelpers.getElement(resourcePool);
        }

        // Element field
        var elementField = new ElementField();
        elementField.Element = element;
        elementField.ElementCellSet = [];
        elementField.UserElementFieldSet = [];
        elementField.initialized = true;

        // Cross relation
        element.ElementFieldSet.push(elementField);

        return elementField;
    }

    static getElementItem(element?: Element): ElementItem {

        if (!element) {
            var resourcePool = TestHelpers.getResourcePool();
            element = TestHelpers.getElement(resourcePool);
        }

        // Element item
        var elementItem = new ElementItem();
        elementItem.Element = element;
        elementItem.ElementCellSet = [];
        elementItem.ParentCellSet = [];
        elementItem.initialized = true;

        // Cross relation
        element.ElementItemSet.push(elementItem);

        return elementItem;
    }

    static getResourcePool(): ResourcePool {
        var resourcePool = new ResourcePool();
        resourcePool.UserResourcePoolSet = [];
        resourcePool.ElementSet = [];
        resourcePool.initialized = true;
        return resourcePool;
    }

    static getUserElementCell(elementCell: ElementCell): UserElementCell {

        // User element cell
        var userElementCell = new UserElementCell();
        userElementCell.ElementCell = elementCell;
        userElementCell.initialized = true;

        // Cross relation
        elementCell.UserElementCellSet.push(userElementCell);

        return userElementCell;
    }

    static getUserElementField(elementField: ElementField): UserElementField {

        // User element field
        var userElementField = new UserElementField();
        userElementField.ElementField = elementField;
        userElementField.initialized = true;

        // Cross relation
        elementField.UserElementFieldSet.push(userElementField);

        return userElementField;
    }
}
