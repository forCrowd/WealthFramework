import { EntityBase } from "./entity-base";
import { ResourcePool } from "./resource-pool";
import { User } from "./user";

export class UserResourcePool extends EntityBase {

    // Server-side
    User: User;
    ResourcePool: ResourcePool;
    ResourcePoolRate: number = 0;
}
