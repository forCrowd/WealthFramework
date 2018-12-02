import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AppHttpClient } from "@forcrowd/backbone-client-core";
import { EntityQuery, Predicate } from "breeze-client";
import { Observable, Subject } from "rxjs";
import { mergeMap, finalize, map } from "rxjs/operators";

import { AppSettings } from "../../app-settings/app-settings";
import { Element } from "./entities/element";
import { ElementCell } from "./entities/element-cell";
import { ElementField, ElementFieldDataType } from "./entities/element-field";
import { ElementItem } from "./entities/element-item";
import { Project } from "./entities/project";
import { UserElementCell } from "./entities/user-element-cell";
import { UserElementField } from "./entities/user-element-field";
import { AppEntityManager } from "./app-entity-manager.service";
import { AuthService } from "./auth.service";

@Injectable()
export class ProjectService {

  elementCellDecimalValueUpdated = new Subject<ElementCell>();

  createElementCell(initialValues: Object) {

    const elementCell = this.appEntityManager.createEntity("ElementCell", initialValues) as ElementCell;

    // If DataType is decimal, also create "User element cell"
    if (elementCell.ElementField.DataType === ElementFieldDataType.Decimal) {

      elementCell.DecimalValueTotal = 0; // Computed field
      elementCell.DecimalValueCount = 1; // Computed field

      const userElementCellInitial = {
        User: this.authService.currentUser,
        ElementCell: elementCell,
        DecimalValue: 0,
      } as any;

      this.appEntityManager.createEntity("UserElementCell", userElementCellInitial);
    }

    return elementCell;
  }

  createUserElementCell(elementCell: ElementCell, value: any) {

    // Search for an existing entity: deleted but not synced with remote entities are still in metadataStore
    const existingKey = [this.authService.currentUser.Id, elementCell.Id];
    let userElementCell = this.appEntityManager.getEntityByKey("UserElementCell", existingKey) as UserElementCell;

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
        User: this.authService.currentUser,
        ElementCell: elementCell
      } as any;

      switch (elementCell.ElementField.DataType) {
        case ElementFieldDataType.String: { break; }
        case ElementFieldDataType.Decimal: { userElementCellInitial.DecimalValue = value !== null ? value : 50; break; }
        case ElementFieldDataType.Element: { break; }
      }

      userElementCell = this.appEntityManager.createEntity("UserElementCell", userElementCellInitial) as UserElementCell;
    }

    return userElementCell;
  }

  createUserElementField(elementField: ElementField, rating: number = 50) {

    // Search for an existing entity: deleted but not synced with remote entities are still in metadataStore
    const existingKey = [this.authService.currentUser.Id, elementField.Id];
    let userElementField = this.appEntityManager.getEntityByKey("UserElementField", existingKey) as UserElementField;

    if (userElementField) {

      // If it's deleted, restore it
      if (userElementField.entityAspect.entityState.isDeleted()) {
        userElementField.entityAspect.rejectChanges();
      }

      userElementField.Rating = rating;

    } else {

      const userElementFieldInitial = {
        User: this.authService.currentUser,
        ElementField: elementField,
        Rating: rating
      };

      userElementField = this.appEntityManager.createEntity("UserElementField", userElementFieldInitial) as UserElementField;
    }

    return userElementField;
  }

  createElementField(initialValues: Object, rating: number = 50) {

    const elementField = this.appEntityManager.createEntity("ElementField", initialValues) as ElementField;

    // If RatingEnabled, also create "User element field"
    if (elementField.RatingEnabled) {

      elementField.RatingTotal = 0; // Computed field
      elementField.RatingCount = 1; // Computed field

      const userElementFieldInitial = {
        User: this.authService.currentUser,
        ElementField: elementField,
        Rating: rating
      };

      this.appEntityManager.createEntity("UserElementField", userElementFieldInitial);
    }

    return elementField;
  }

  // These "updateX" functions were defined in their related entities (user.js).
  // Only because they had to use createEntity() on dataService, it was moved to this service.
  // Try do handle them in a better way, maybe by using broadcast?
  updateElementCellDecimalValue(elementCell: ElementCell, value: number) {

    const userElementCell = elementCell.UserElementCellSet[0];

    if (!userElementCell) { // If there is no item, create it

      this.createUserElementCell(elementCell, value);

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
          this.createUserElementField(elementField, rating);

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
}
