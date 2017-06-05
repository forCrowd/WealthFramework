import { Entity, EntityAspect, EntityType } from "breeze-client";

export class EntityBase implements Entity {

    entityAspect: EntityAspect;
    entityType: EntityType;

    // Determines whether the entity is completely being created or loaded from server.
    initialized: boolean = false;

    CreatedOn: Date = new Date();
    ModifiedOn: Date = new Date();
    DeletedOn?: Date = null;
    RowVersion: string = "AAAAAAAAAAA="; 

    get $typeName(): string {
        if (!this.entityAspect) return "";
        return this.entityAspect.getKey().entityType.shortName;
    }

    static initializer(entity: EntityBase): void {
        entity.initialized = true;
    }
}
