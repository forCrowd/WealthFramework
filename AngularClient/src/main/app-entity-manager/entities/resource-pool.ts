import { EventEmitter } from "@angular/core";

import { Element } from "./element";
import { EntityBase } from "./entity-base";
import { User } from "./user";
import { stripInvalidChars } from "../../utils";

export interface IUniqueKey {
    username: string;
    resourcePoolKey: string;
}

export enum RatingMode {
    CurrentUser = 1,
    AllUsers = 2
}

export class ResourcePool extends EntityBase {

    // Server-side
    Id: number = 0;
    User: User;

    get Name(): string {
        return this.fields.name;
    }
    set Name(value: string) {
        if (this.fields.name !== value) {
            const oldStripped = stripInvalidChars(this.fields.name);
            this.fields.name = value;

            if (this.initialized) {

                // If "Key" is not a custom value (generated through Name), then keep updating it
                if (this.Key === oldStripped) {
                    this.Key = value;
                }
            }
        }
    }

    get Key(): string {
        return this.fields.key;
    }
    set Key(value: string) {
        const newValue = stripInvalidChars(value);

        if (this.fields.key !== newValue) {
            this.fields.key = newValue;
        }
    }

    Description: string;
    get InitialValue(): number {
        return this.fields.initialValue;
    }
    set InitialValue(value: number) {
        if (this.fields.initialValue !== value) {
            this.fields.initialValue = value;

            this.ElementSet.forEach(element => {
                element.elementFieldSet(false).forEach(field => {
                    field.setIncome();
                });
            });
        }
    }

    RatingCount: number = 0;
    ElementSet: Element[];

    // Client-side
    get RatingMode(): RatingMode {
        return this.fields.ratingMode;
    }
    set RatingMode(value: RatingMode) {

        if (this.fields.ratingMode !== value) {
            this.fields.ratingMode = value;
            this.ratingModeUpdated.emit(value);
        }
    }

    get uniqueKey(): IUniqueKey {

        if (!this.initialized) {
            return null;
        }

        return {
            username: this.User.UserName,
            resourcePoolKey: this.Key
        };
    }

    ratingModeUpdated = new EventEmitter<RatingMode>();

    private fields: {
        initialValue: number,
        isAdded: boolean,
        key: string,
        name: string,
        ratingMode: number,
    } = {
        initialValue: 0,
        isAdded: false,
        key: "",
        name: "",
        ratingMode: RatingMode.CurrentUser,
    };

    initialize(): boolean {
        if (!super.initialize()) return false;

        this.ElementSet.forEach(element => {
            element.initialize();
        });

        return true;
    }

    mainElement(): Element {
        const result = this.ElementSet.filter((element: Element) => element.IsMainElement);
        return result.length > 0 ? result[0] : null;
    }

    remove() {

        // Related elements
        const elementSet = this.ElementSet.slice();
        elementSet.forEach(element => {
            element.remove();
        });

        this.entityAspect.setDeleted();
    }

    toggleRatingMode() {
        this.RatingMode = this.RatingMode === RatingMode.CurrentUser
            ? RatingMode.AllUsers
            : RatingMode.CurrentUser;
    }
}
