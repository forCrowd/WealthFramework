import { UserElementField as CoreUserElementField } from "@forcrowd/backbone-client-core";

import { ElementField } from "./element-field";

export class UserElementField extends CoreUserElementField {

  get Rating() {
    return this._rating;
  }
  set Rating(value: number) {

    if (this._rating !== value) {
      this._rating = value;

      // Update related
      if (this.initialized) {
        (this.ElementField as ElementField).setCurrentUserRating();
      }
    }
  }

  private _rating = 0;

  initialize() {
    if (this.initialized) return;

    super.initialize();

    (this.ElementField as ElementField).setCurrentUserRating();
  }
}
