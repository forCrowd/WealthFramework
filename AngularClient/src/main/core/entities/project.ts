import { Project as CoreProject } from "@forcrowd/backbone-client-core";
import { Subject } from "rxjs";

import { ElementCell } from "./element-cell";
import { ElementItem } from "./element-item";

export enum RatingMode {
  CurrentUser = 1,
  AllUsers = 2
}

export class Project extends CoreProject {

  // Client-side
  initialValue = 100;

  get RatingMode(): RatingMode {
    return this.fields.ratingMode;
  }
  set RatingMode(value: RatingMode) {

    if (this.fields.ratingMode !== value) {
      this.fields.ratingMode = value;
      this.ratingModeUpdated.next(value);
    }
  }

  get rounds(): number {
    return this.fields.rounds;
  }

  increaseRounds(): void {
    this.fields.rounds++;

    this.ElementSet.forEach(element => {
      element.ElementItemSet.forEach((elementItem: ElementItem) => {
        elementItem.ElementCellSet.forEach((elementCell: ElementCell) => {
          elementCell.setIncome();
          elementCell.increaseAllRoundsIncome();
        });

        elementItem.increaseAllRoundsIncome();
      });
    });
  }

  resetRounds(): void {
    this.fields.rounds = 0;

    this.ElementSet.forEach(element => {
      element.ElementItemSet.forEach((elementItem: ElementItem) => {
        elementItem.ElementCellSet.forEach((elementCell: ElementCell) => {
          elementCell.resetAllRoundsIncome();
        });

        elementItem.resetAllRoundsIncome();
      });
    });
  }

  ratingModeUpdated = new Subject<RatingMode>();

  private fields: {
    ratingMode: number,
    rounds: number,
  } = {
      ratingMode: RatingMode.CurrentUser,
      rounds: 0,
    };

  initialize() {
    if (this.initialized) return;

    super.initialize();

    // Elements sort order
    this.ElementSet = this.ElementSet.sort((a, b) => a.SortOrder - b.SortOrder);

    this.ElementSet.forEach(element => {
      element.initialize();
    });
  }

  toggleRatingMode() {
    this.RatingMode = this.RatingMode === RatingMode.CurrentUser
      ? RatingMode.AllUsers
      : RatingMode.CurrentUser;
  }
}
