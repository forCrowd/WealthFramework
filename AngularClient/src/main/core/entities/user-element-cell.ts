import { UserElementCell as CoreUserElementCell } from "@forcrowd/backbone-client-core";

import { ElementCell } from "./element-cell";

export class UserElementCell extends CoreUserElementCell {

  get DecimalValue() {
    return this.fields.decimalValue;
  }
  set DecimalValue(value: number | null) {

    if (this.fields.decimalValue !== value) {
      this.fields.decimalValue = value;

      // Update related
      if (this.initialized) {
        (this.ElementCell as ElementCell).setCurrentUserDecimalValue();
      }
    }
  }

  private fields: {
    decimalValue: number | null
  } = {
    decimalValue: null
  };

  initialize() {
    if (this.initialized) return;

    super.initialize();

    (this.ElementCell as ElementCell).setCurrentUserDecimalValue();
  }
}
