import { EntityBase } from "./entity-base";

export class UserElementCell extends EntityBase {

    // Server-side
    UserId: number = 0;
    ElementCellId: number = 0;
    StringValue: string = null;
    BooleanValue: boolean = null;
    IntegerValue: number = null;
    DateTimeValue: any = null;
    DecimalValue: number = null;

    static initializer(entity: UserElementCell) {
        super.initializer(entity);
    }
}
