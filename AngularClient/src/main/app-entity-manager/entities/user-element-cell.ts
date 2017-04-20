import { EntityBase } from "./entity-base";
import { ElementCell } from "./element-cell";
import { User } from "./user";

export class UserElementCell extends EntityBase {

    // Server-side
    UserId: number = 0;
    ElementCellId: number = 0;
    StringValue: string = null;
    BooleanValue: boolean = null;
    IntegerValue: number = null;
    DateTimeValue: any = null;
    DecimalValue: number = null;
    User: User;
    ElementCell: ElementCell;
}
