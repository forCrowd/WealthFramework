import { EntityBase } from "./entity-base";
import { ElementCell } from "./element-cell";
import { User } from "./user";

export class UserElementCell extends EntityBase {

    // Server-side
    User: User;
    ElementCell: ElementCell;
    StringValue: string = null;
    BooleanValue: boolean = null;
    IntegerValue: number = null;
    DateTimeValue: Date = null;
    DecimalValue: number = null;
}
