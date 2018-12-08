import { Injectable } from "@angular/core";
import { ProjectService } from "@forcrowd/backbone-client-core";
import { Subject } from "rxjs";

import { ElementCell } from "./entities/element-cell";
import { ElementField } from "./entities/element-field";

@Injectable()
export class AppProjectService extends ProjectService {

  elementCellDecimalValueUpdated = new Subject<ElementCell>();

  updateElementCellDecimalValue(elementCell: ElementCell, value: number) {
    const userElementCell = elementCell.UserElementCellSet[0];

    if (!userElementCell) {
      this.createUserElementCell(elementCell, value);
    } else {
      userElementCell.DecimalValue = value;
    }

    this.elementCellDecimalValueUpdated.next(elementCell);
  }

  updateElementFieldRating(elementField: ElementField, rating: number) {
    const userElementField = elementField.UserElementFieldSet[0];

    if (!userElementField) {
      this.createUserElementField(elementField, rating);
    } else {
      userElementField.Rating = rating;
    }
  }
}
