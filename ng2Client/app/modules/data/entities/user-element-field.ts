import { EntityBase } from "./entity-base";

export class UserElementField extends EntityBase {

    // Server-side
    UserId: number = 0;
    UserElementFieldId: number = 0;
    Rating: number = 0;

    static initializer(entity: UserElementField) {
        super.initializer(entity);
    }
}
