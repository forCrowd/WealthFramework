import { EntityBase } from "./entity-base";

export class UserResourcePool extends EntityBase {

    // Server-side
    UserId: number = 0;
    ResourcePoolId: number = 0;
    ResourcePoolRate: number = 0;

    static initializer(entity: UserResourcePool) {
        super.initializer(entity);
    }
}
