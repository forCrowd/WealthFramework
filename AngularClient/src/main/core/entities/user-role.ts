import { EntityBase } from "./entity-base";
import { Role } from "./role";
import { User } from "./user";

export class UserRole extends EntityBase {

  // Server-side
  User: User;
  Role: Role;
}
