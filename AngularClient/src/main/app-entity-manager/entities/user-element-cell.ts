import { EntityBase } from "./entity-base";
import { ElementCell } from "./element-cell";
import { User } from "./user";

export class UserElementCell extends EntityBase {

    // Server-side
    User: User;
    ElementCell: ElementCell;
    get DecimalValue(): number | null {
        return this.fields.decimalValue;
    }
    set DecimalValue(value: number | null) {

        if (this.fields.decimalValue !== value) {
            this.fields.decimalValue = value;

            // Update related
            if (this.initialized) {
                this.ElementCell.setCurrentUserNumericValue();
            }
        }
    }

    private fields: {
        decimalValue: number | null
    } = {
        decimalValue: null,
    }

    initialize(): boolean {
        if (!super.initialize()) return false;

        this.ElementCell.setCurrentUserNumericValue();

        return true;        
    }
}
