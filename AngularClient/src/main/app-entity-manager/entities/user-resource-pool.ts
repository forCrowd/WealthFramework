import { EntityBase } from "./entity-base";
import { ResourcePool } from "./resource-pool";

export class UserResourcePool extends EntityBase {

    // Server-side
    UserId: number = 0;
    ResourcePoolId: number = 0;
    ResourcePoolRate: number = 0;
    ResourcePool: ResourcePool;
}
