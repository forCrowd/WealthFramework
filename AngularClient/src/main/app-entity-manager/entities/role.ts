import { EntityBase } from "./entity-base";
import { UserRole } from "./user-role";

export class Role extends EntityBase {

    // Server-side
    Id = 0;
    Name: string = "";
    Users: UserRole[];
}
