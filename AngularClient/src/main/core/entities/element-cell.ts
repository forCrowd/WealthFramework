import { ElementCell as CoreElementCell, ElementFieldDataType } from "@forcrowd/backbone-client-core";
import { Subject } from "rxjs";

import { ElementField } from "./element-field";
import { ElementItem } from "./element-item";
import { Project, RatingMode } from "./project";

export class ElementCell extends CoreElementCell {

  // Client
  otherUsersDecimalValueTotal = 0;
  otherUsersDecimalValueCount = 0;
  selectedDecimalValue = 0;

  // Events
  decimalValueUpdated = new Subject<number>();

  private fields: {
    allRoundsIncome: number,
    currentUserDecimalValue: number,
    income: number,
    decimalValue: number,
    decimalValuePercentage: number,
  } = {
      allRoundsIncome: 0,
      currentUserDecimalValue: 0,
      income: 0,
      decimalValue: 0,
      decimalValuePercentage: 0,
    };

  allRoundsIncome() {
    return this.fields.allRoundsIncome;
  }

  income() {
    return this.fields.income;
  }

  increaseAllRoundsIncome() {
    this.fields.allRoundsIncome += this.income();
  }

  initialize() {
    if (this.initialized) return true;

    super.initialize();

    // Other users'
    this.otherUsersDecimalValueTotal = this.DecimalValueTotal;
    this.otherUsersDecimalValueCount = this.DecimalValueCount;

    // Exclude current user's
    if (this.UserElementCellSet[0]) {
      this.otherUsersDecimalValueTotal -= this.UserElementCellSet[0].DecimalValue;
      this.otherUsersDecimalValueCount -= 1;
    }

    // User cells
    this.UserElementCellSet.forEach(userCell => {
      userCell.initialize();
    });

    // Initial values
    this.setCurrentUserDecimalValue();

    // Event handlers
    (this.ElementField.Element.Project as Project).ratingModeUpdated.subscribe(() => {
      (this.ElementField.Element.Project as Project).RatingMode === RatingMode.CurrentUser
        ? this.currentUserDecimalValue()
        : this.allUsersDecimalValue();
    });

    return true;
  }

  decimalValue() { // a.k.a rating
    return this.fields.decimalValue;
  }

  decimalValueAverage() { // a.k.a. all users' decimal value
    return this.decimalValueCount() === 0 ? 0 : this.decimalValueTotal() / this.decimalValueCount();
  }

  decimalValueCount() {
    return this.ElementField.UseFixedValue
      ? 1
      : this.otherUsersDecimalValueCount + 1; // There is always default value, increase count by 1
  }

  decimalValuePercentage() { // a.k.a. rating percentage
    return this.fields.decimalValuePercentage;
  }

  decimalValueTotal() {
    return this.ElementField.UseFixedValue
      ? this.UserElementCellSet[0]
        ? this.currentUserDecimalValue()
        : this.otherUsersDecimalValueTotal
      : this.otherUsersDecimalValueTotal + this.currentUserDecimalValue();
  }

  resetAllRoundsIncome() {
    this.fields.allRoundsIncome = 0;
  }

  setCurrentUserDecimalValue() {

    const value = this.UserElementCellSet[0] ? this.UserElementCellSet[0].DecimalValue : 50; // Default value

    if (this.fields.currentUserDecimalValue !== value) {
      this.fields.currentUserDecimalValue = value;

      this.currentUserDecimalValue();
    }
  }

  setIncome() {

    let value: number = 0; // Default value?

    if (this.ElementField.DataType === ElementFieldDataType.Element && this.SelectedElementItem !== null) {
      // item's index income / how many times this item has been selected (used) by higher items
      // TODO Check whether ParentCellSet gets updated when selecting / deselecting an item
      value = (this.SelectedElementItem as ElementItem).income() / this.SelectedElementItem.ParentCellSet.length;
    } else {
      if (this.ElementField.RatingEnabled) {
        value = (this.ElementField as ElementField).income() * this.decimalValuePercentage();
      }
    }

    if (this.fields.income !== value) {
      this.fields.income = value;

      // Update related
      (this.ElementItem as ElementItem).setIncome();
    }
  }

  currentUserDecimalValue() {

    if (this.fields.decimalValue !== this.fields.currentUserDecimalValue) {
      this.fields.decimalValue = this.fields.currentUserDecimalValue;

      // Update related
      //this.setDecimalValuePercentage(); - No need to call this one since field is going to update it anyway! / coni2k - 05 Nov. '17
      (this.ElementField as ElementField).setDecimalValue();

      // Event
      this.decimalValueUpdated.next(this.fields.decimalValue);
    }

    return this.fields.currentUserDecimalValue;
  }

  allUsersDecimalValue() {

    if (this.fields.decimalValue !== this.decimalValueAverage()) {
      this.fields.decimalValue = this.decimalValueAverage();

      // Update related
      (this.ElementField as ElementField).setDecimalValue();

      // Event
      this.decimalValueUpdated.next(this.fields.decimalValue);
    }
  }

  setDecimalValuePercentage() {

    const value = (this.ElementField as ElementField).decimalValue() === 0
      ? 0
      : this.decimalValue() / (this.ElementField as ElementField).decimalValue();

    if (this.fields.decimalValuePercentage !== value) {
      this.fields.decimalValuePercentage = value;

      // Update related
      this.setIncome();
    }
  }
}
