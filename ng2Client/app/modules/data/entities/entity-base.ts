import { Entity, EntityAspect, EntityType } from "breeze-client";

export class EntityBase implements Entity {

    // Todo Is there any built-in prop for this? / coni2k - 25 Feb. '17
    initialized: boolean = false;
    entityAspect: EntityAspect;
    entityType: EntityType;

    get $typeName(): string {
        if (!this.entityAspect) return "";
        return this.entityAspect.getKey().entityType.shortName;
    }

    static initializer(entity: EntityBase): void {
        entity.initialized = true;
    }
}
