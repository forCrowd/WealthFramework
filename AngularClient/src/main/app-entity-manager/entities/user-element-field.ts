import { EntityBase } from "./entity-base";
import { ElementField } from "./element-field";

export class UserElementField extends EntityBase {

    // Server-side
    UserId: number = 0;
    UserElementFieldId: number = 0;
    Rating: number = 0;
    ElementField: ElementField;
}
