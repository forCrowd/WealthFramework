import { Injectable } from "@angular/core";
import { ElementFieldDataType, ProjectService } from "@forcrowd/backbone-client-core";
import { Subject } from "rxjs";

import { ElementCell } from "./entities/element-cell";
import { ElementField } from "./entities/element-field";
import { UserElementCell } from "./entities/user-element-cell";
import { UserElementField } from "./entities/user-element-field";

@Injectable()
export class AppProjectService extends ProjectService {

  elementCellDecimalValueUpdated = new Subject<ElementCell>();

  // These "updateX" functions were defined in their related entities (user.js).
  // Only because they had to use createEntity() on dataService, it was moved to this service.
  // Try do handle them in a better way, maybe by using broadcast?
  updateElementCellDecimalValue(elementCell: ElementCell, value: number) {

    const userElementCell = elementCell.UserElementCellSet[0];

    if (!userElementCell) { // If there is no item, create it

      this.createOrReuseUserCell(elementCell, value);

    } else { // If there is an item, update DecimalValue, but cannot be smaller than zero and cannot be bigger than 100

      userElementCell.DecimalValue = value;

    }

    this.elementCellDecimalValueUpdated.next(elementCell);
  }

  updateElementFieldRating(elementField: ElementField, updateType: string) {

    switch (updateType) {
      case "increase":
      case "decrease": {

        const userElementField = elementField.UserElementFieldSet[0];

        // If there is no item, create it
        if (!userElementField) {

          const rating = updateType === "increase" ? 55 : 45;
          this.createOrReuseUserField(elementField, rating);

        } else { // If there is an item, update Rating, but cannot be smaller than zero and cannot be bigger than 100

          userElementField.Rating = updateType === "increase" ?
            userElementField.Rating + 5 > 100 ? 100 : userElementField.Rating + 5 :
            userElementField.Rating - 5 < 0 ? 0 : userElementField.Rating - 5;
        }

        break;
      }
      case "reset": {

        if (elementField.UserElementFieldSet[0]) {
          elementField.UserElementFieldSet[0].Rating = 50;
        }

        break;
      }
    }
  }

  private createOrReuseUserCell(elementCell: ElementCell, value: any) {

    // Search for an existing entity: deleted but not synced with remote entities are still in metadataStore
    const existingKey = [(this as any).authService.currentUser.Id, elementCell.Id];
    let userElementCell = (this as any).appEntityManager.getEntityByKey("UserElementCell", existingKey) as UserElementCell;

    if (userElementCell) {

      // If it's deleted, restore it
      if (userElementCell.entityAspect.entityState.isDeleted()) {
        userElementCell.entityAspect.rejectChanges();
      }

      switch (elementCell.ElementField.DataType) {
      case ElementFieldDataType.String: { break; }
      case ElementFieldDataType.Decimal: { userElementCell.DecimalValue = value !== null ? value : 50; break; }
      case ElementFieldDataType.Element: { break; }
      }

    } else {

      const userElementCellInitial = {
        User: (this as any).authService.currentUser,
        ElementCell: elementCell
      } as any;

      switch (elementCell.ElementField.DataType) {
      case ElementFieldDataType.String: { break; }
      case ElementFieldDataType.Decimal: { userElementCellInitial.DecimalValue = value !== null ? value : 50; break; }
      case ElementFieldDataType.Element: { break; }
      }

      userElementCell = (this as any).appEntityManager.createEntity("UserElementCell", userElementCellInitial) as UserElementCell;
    }

    return userElementCell;
  }

  private createOrReuseUserField(elementField: ElementField, rating: number = 50) {

    // Search for an existing entity: deleted but not synced with remote entities are still in metadataStore
    const existingKey = [(this as any).authService.currentUser.Id, elementField.Id];
    let userElementField = (this as any).appEntityManager.getEntityByKey("UserElementField", existingKey) as UserElementField;

    if (userElementField) {

      // If it's deleted, restore it
      if (userElementField.entityAspect.entityState.isDeleted()) {
        userElementField.entityAspect.rejectChanges();
      }

      userElementField.Rating = rating;

    } else {

      const userElementFieldInitial = {
        User: (this as any).authService.currentUser,
        ElementField: elementField,
        Rating: rating
      };

      userElementField = (this as any).appEntityManager.createEntity("UserElementField", userElementFieldInitial) as UserElementField;
    }

    return userElementField;
  }
}
