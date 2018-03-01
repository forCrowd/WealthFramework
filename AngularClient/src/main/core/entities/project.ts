import { Subject } from "rxjs";

import { Element } from "./element";
import { EntityBase } from "./entity-base";
import { User } from "./user";
import { stripInvalidChars } from "../../shared/utils";

export enum RatingMode {
    CurrentUser = 1,
    AllUsers = 2
}

export class Project extends EntityBase {

    // Server-side
    Id = 0;
    User: User;
    Name = "";
    Description: string = null;
    InitialValue = 100; // 1000000000
    RatingCount = 0;
    ElementSet: Element[];

    // Client-side
    get RatingMode(): RatingMode {
        return this.fields.ratingMode;
    }
    set RatingMode(value: RatingMode) {

        if (this.fields.ratingMode !== value) {
            this.fields.ratingMode = value;
            this.ratingModeUpdated.next(value);
        }
    }

    ratingModeUpdated = new Subject<RatingMode>();

    private fields: {
        ratingMode: number,
    } = {
        ratingMode: RatingMode.CurrentUser,
    };

    initialize(): boolean {
        if (!super.initialize()) return false;

        this.ElementSet.forEach(element => {
            element.initialize();
        });

        return true;
    }

    toggleRatingMode() {
        this.RatingMode = this.RatingMode === RatingMode.CurrentUser
            ? RatingMode.AllUsers
            : RatingMode.CurrentUser;
    }
}
