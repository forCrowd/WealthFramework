import { Element as CoreElement, ElementFieldDataType } from "@forcrowd/backbone-client-core";

import { ElementField } from "./element-field";
import { ElementItem } from "./element-item";

export class Element extends CoreElement {

  private fields: {
    parent: Element,
    familyTree: Element[],
    rating: number,
    income: number,
  } = {
      parent: null,
      familyTree: null,
      rating: 0,
      income: 0
    };

  elementFieldSet(ratingEnabledFilter: boolean = true): ElementField[] {
    return this.getElementFieldSetWithFilter(this, ratingEnabledFilter);
  }

  familyTree() {

    // TODO In case of add / remove elements?
    if (this.fields.familyTree === null) {
      this.setFamilyTree();
    }

    return this.fields.familyTree;
  }

  getElementFieldSetSorted() {
    return this.ElementFieldSet.sort((a, b) => a.SortOrder - b.SortOrder);
  }

  getElementItemSet(sort: string = "name") {

    return this.ElementItemSet.sort((a: ElementItem, b: ElementItem) => {

      switch (sort) {
        case "income":
        default: {
          return b.income() - a.income();
        }
        case "name": {
          const nameA = a.Name.toLowerCase();
          const nameB = b.Name.toLowerCase();
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        }
        case "allRoundsIncome": {
          return b.allRoundsIncome() - a.allRoundsIncome();
        }
      }
    });
  }

  income() {
    return this.fields.income;
  }

  rating() {
    return this.fields.rating;
  }

  initialize() {
    if (this.initialized) return;

    super.initialize();

    // Fields
    this.ElementFieldSet.forEach(field => {
      field.initialize();
    });

    // Items
    this.ElementItemSet.forEach(item => {
      item.initialize();
    });
  }

  parent() {

    // TODO In case of add / remove elements?
    if (this.fields.parent === null) {
      this.setParent();
    }

    return this.fields.parent;
  }

  setFamilyTree() {

    this.fields.familyTree = [];

    let element = this as Element; // TODO: ?
    while (element) {
      this.fields.familyTree.unshift(element);
      element = element.parent();
    }

    // TODO At the moment it's only upwards, later include children?
  }

  setIncome() {

    var value = 0;
    this.ElementItemSet.forEach((item: ElementItem) => {
      value += item.income();
    });

    if (this.fields.income !== value) {
      this.fields.income = value;
    }
  }

  setParent() {
    if (this.ParentFieldSet.length > 0) {
      this.fields.parent = this.ParentFieldSet[0].Element as Element;
    }
  }

  setRating() {

    const fieldSet = this.elementFieldSet(false);

    var value = 0;
    fieldSet.forEach(field => {
      value += field.rating();
    });

    if (this.fields.rating !== value) {
      this.fields.rating = value;

      // Update related
      fieldSet.forEach(field => {
        field.setRatingPercentage();
      });
    }
  }

  private getElementFieldSetWithFilter(element: Element, ratingEnabledFilter: boolean = true) {

    const sortedElementFieldSet = element.getElementFieldSetSorted();
    var fieldSet: ElementField[] = [];

    // Validate
    sortedElementFieldSet.forEach(field => {
      if (!ratingEnabledFilter || (ratingEnabledFilter && field.RatingEnabled)) {
        fieldSet.push(field as ElementField);
      }

      if (field.DataType === ElementFieldDataType.Element && field.SelectedElement !== null) {
        const childFieldSet = this.getElementFieldSetWithFilter(field.SelectedElement as Element, ratingEnabledFilter);

        childFieldSet.forEach(childField => {
          fieldSet.push(childField);
        });
      }
    });

    return fieldSet;
  }
}
