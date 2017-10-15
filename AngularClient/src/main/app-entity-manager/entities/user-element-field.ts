import { EntityBase } from "./entity-base";
import { ElementField } from "./element-field";
import { User } from "./user";

export class UserElementField extends EntityBase {

    // Server-side
    User: User;
    ElementField: ElementField;
    get Rating(): number {
        return this.fields.rating;
    }
    set Rating(value: number) {
        if (this.fields.rating !== value) {
            this.fields.rating = value;

            // Update related
            if (this.initialized) {
                this.ElementField.setCurrentUserIndexRating();
            }
        }
    }

    private fields: {
        rating: number,
    } = {
        rating: 0,
    }

    initialize(): boolean {
        if (!super.initialize()) return false;

        this.ElementField.setCurrentUserIndexRating();

        return true;
    }
}
