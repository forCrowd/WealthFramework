import { Entity, EntityAspect, EntityType } from "breeze-client";

export class EntityBase implements Entity {

  entityAspect: EntityAspect;
  entityType: EntityType;
  initialized = false; // Determines whether the entity is completely being created or loaded from server.

  CreatedOn = new Date();
  ModifiedOn = new Date();
  DeletedOn: Date | null = null;
  RowVersion: string = "AAAAAAAAAAA=";

  get $typeName(): string {
    if (!this.entityAspect) return "";
    return this.entityAspect.getKey().entityType.shortName;
  }

  initialize(): boolean {

    if (this.initialized) {
      return false;
    }

    //console.log(`id: ${this["Id"] || "n/a"} - name: ${this["Name"] || "n/a"}`, this);

    this.initialized = true;

    return true;
  }
}
