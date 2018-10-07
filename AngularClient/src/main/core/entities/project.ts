import { Subject } from "rxjs";

import { Element } from "./element";
import { EntityBase } from "./entity-base";
import { User } from "./user";

export enum RatingMode {
  CurrentUser = 1,
  AllUsers = 2
}

export class Project extends EntityBase {

  // Server-side
  Id = 0;
  User: User;
  Name = "";
  Description: string = null;
  RatingCount = 0;
  ElementSet: Element[];

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
      element.ElementItemSet.forEach(elementItem => {
        elementItem.ElementCellSet.forEach(elementCell => {
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
      element.ElementItemSet.forEach(elementItem => {
        elementItem.ElementCellSet.forEach(elementCell => {
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

  initialize(): boolean {
    if (!super.initialize()) return false;

    // Elements sort order
    this.ElementSet = this.ElementSet.sort((a, b) => a.SortOrder - b.SortOrder);

    this.ElementSet.forEach(element => {
      element.initialize();
    });

    return true;
  }

  toggleRatingMode() {
    this.RatingMode = this.RatingMode === RatingMode.CurrentUser
      ? RatingMode.AllUsers
      : RatingMode.CurrentUser;
  }
}
