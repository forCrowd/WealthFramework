import { Project } from "./project";
import { Element } from "./element";
import { ElementField, ElementFieldDataType } from "./element-field";
import { UserElementField } from "./user-element-field";
import { ElementItem } from "./element-item";
import { ElementCell } from "./element-cell";
import { UserElementCell } from "./user-element-cell";

export class TestHelpers {

  static createElement(project?: Project): Element {

    if (!project) {
      project = TestHelpers.createProject();
    }

    // Element
    const element = new Element();
    element.Project = project;
    element.ElementFieldSet = [];
    element.ElementItemSet = [];
    element.ParentFieldSet = [];

    // Cross relation
    project.ElementSet.push(element);

    element.initialize();

    return element;
  }

  static createElementCell(elementField?: ElementField, elementItem?: ElementItem, decimalValueTotal?: number, decimalValueCount?: number, userCellDecimalValue?: number): ElementCell {

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

    if (decimalValueTotal) {
      elementCell.DecimalValueTotal = decimalValueTotal;
    }

    if (decimalValueCount) {
      elementCell.DecimalValueCount = decimalValueCount;
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

  static createElementField(element?: Element, dataType?: ElementFieldDataType, ratingTotal?: number, ratingCount?: number, userElementFieldRating?: number): ElementField {

    if (!element) {
      const project = TestHelpers.createProject();
      element = TestHelpers.createElement(project);
    }

    // Element field
    const elementField = new ElementField();
    elementField.Element = element;
    elementField.RatingEnabled = true;
    elementField.ElementCellSet = [];
    elementField.UserElementFieldSet = [];

    if (dataType) {
      elementField.DataType = dataType;
    }

    if (ratingTotal) {
      elementField.RatingTotal = ratingTotal;
    }

    if (ratingCount) {
      elementField.RatingCount = ratingCount;
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
      const project = TestHelpers.createProject();
      element = TestHelpers.createElement(project);
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

  static createProject(): Project {
    const project = new Project();
    project.ElementSet = [];
    project.initialize();
    return project;
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
