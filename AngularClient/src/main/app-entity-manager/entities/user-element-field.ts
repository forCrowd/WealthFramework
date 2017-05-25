import { EntityBase } from "./entity-base";
import { ElementField } from "./element-field";
import { User } from "./user";

export class UserElementField extends EntityBase {

    // Server-side
    User: User;
    ElementField: ElementField;
    Rating: number = 0;
}
