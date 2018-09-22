import { EntityBase } from "./entity-base";
import { UserRole } from "./user-role";

export class Role extends EntityBase {

  // Server-side
  Id = 0;
  Users: UserRole[];

  get Name(): string {
    return this.fields.name;
  }
  set Name(value: string) {
    this.fields.name = value.trim();
  }

  private fields: {
    name: string,
  } = {
      name: "",
    }
}
