import { ElementFieldDataType, ElementItem as CoreElementItem } from "@forcrowd/backbone-client-core";
import { Subject } from "rxjs";

import { Element } from "./element";
import { ElementCell } from "./element-cell";

export class ElementItem extends CoreElementItem {

  allRoundsIncomeUpdated = new Subject<number>();
  incomeUpdated = new Subject<number>();

  // Client-side
  private fields: {
    allRoundsIncome: number,
    income: number,
  } = {
      allRoundsIncome: 0,
      income: 0,
    };

  allRoundsIncome() {
    return this.fields.allRoundsIncome;
  }

  elementCell(fieldName: string): ElementCell {

    let cell: ElementCell = null;

    for (let elementCellIndex = 0; elementCellIndex < this.ElementCellSet.length; elementCellIndex++) {
      cell = this.ElementCellSet[elementCellIndex] as ElementCell;

      if (cell.ElementField.Name === fieldName) {
        break;
      }
    }

    return cell;
  }

  getElementCellSetSorted() {
    return this.ElementCellSet.sort((a, b) => (a.ElementField.SortOrder - b.ElementField.SortOrder));
  }

  income() {
    return this.fields.income;
  }

  incomeStatus() {

    var value = 0; // for element allRoundsIncome;
    var notSelected = 0; // if item isn't selectedElementItem then increase

    this.Element.ElementItemSet.forEach((item: ElementItem) => {
      if (item.ParentCellSet.length === 0) notSelected++;
        value += item.allRoundsIncome();
    });

    // Probably Element is Parent
    if (this.Element.ElementItemSet.length === notSelected) notSelected = 0;

    const incomeAllRounds = +(this.allRoundsIncome().toFixed(2));
    const allRoundsIncomeAverage = +((value / (this.Element.ElementItemSet.length - notSelected)).toFixed(2));

    if (incomeAllRounds < allRoundsIncomeAverage) {
      return "low";
    } else if (incomeAllRounds > allRoundsIncomeAverage) {
      return "high";
    }
    return "average";
  }

  increaseAllRoundsIncome() {
    this.fields.allRoundsIncome += this.income();

    this.allRoundsIncomeUpdated.next(this.fields.allRoundsIncome);
  }

  initialize() {
    if (this.initialized) return;

    super.initialize();

    // Cells
    this.ElementCellSet.forEach(cell => {
      cell.initialize();
    });
  }

  ratingCells() {
    return this.getRatingCells(this);
  }

  resetAllRoundsIncome() {
    this.fields.allRoundsIncome = 0;

    this.allRoundsIncomeUpdated.next(this.fields.allRoundsIncome);
  }

  setIncome(): void {
    var value = 0;

    this.ElementCellSet.forEach((cell: ElementCell) => {
      value += cell.income();
    });

    if (this.fields.income !== value) {
      this.fields.income = value;

      // Update related
      // TODO Is this correct? It looks like it didn't affect anything?
      this.ParentCellSet.forEach((parentCell: ElementCell) => {
        parentCell.setIncome();
      });

      (this.Element as Element).setIncome();

      this.incomeUpdated.next(this.fields.income);
    }
  }

  private getRatingCells(elementItem: ElementItem) {

    var ratingCells: ElementCell[] = [];
    const sortedElementCellSet = elementItem.getElementCellSetSorted();

    sortedElementCellSet.forEach(cell => {

      if (cell.ElementField.RatingEnabled) {
        ratingCells.push(cell as ElementCell);
      }

      if (cell.ElementField.DataType === ElementFieldDataType.Element && cell.SelectedElementItem !== null) {
        const childRatingCells = this.getRatingCells(cell.SelectedElementItem as ElementItem);

        if (childRatingCells.length > 0) {
          ratingCells.push(cell as ElementCell);
        }
      }
    });

    return ratingCells;
  }
}
