import { EntityBase } from "./entity-base";
import { ResourcePool } from "./resource-pool";
import { UserElementCell } from "./user-element-cell";
import { UserElementField } from "./user-element-field";
import { UserResourcePool } from "./user-resource-pool";
import { UserRole } from "./user-role";
import { stripInvalidChars } from "../../utils";

export class User extends EntityBase {

    // Server-side
    Id = 0;
    Email = "";
    EmailConfirmed = false;
    EmailConfirmationSentOn?: Date;
    get UserName(): string {
        return this.fields.userName;
    }
    set UserName(value: string) {
        var newValue = stripInvalidChars(value);

        if (this.fields.userName !== newValue) {
            this.fields.userName = newValue;
        }
    }
    SingleUseToken: any = null;
    HasPassword = false;
    FirstName = "";
    MiddleName = "";
    LastName = "";
    PhoneNumber = "";
    PhoneNumberConfirmed = false;
    TwoFactorEnabled = false;
    AccessFailedCount = 0;
    LockoutEnabled = false;
    LockoutEndDateUtc: any = null;
    Notes = "";
    Claims: any;
    Logins: any[];
    Roles: UserRole[];
    ResourcePoolSet: ResourcePool[];
    UserResourcePoolSet: UserResourcePool[];
    UserElementFieldSet: UserElementField[];
    UserElementCellSet: UserElementCell[];

    get userText(): string {

        if (!this.initialized) {
            return "";
        }

        let userText = this.UserName;

        if (this.Roles.length > 0) {
            userText += ` (${this.Roles[0].Role.Name})`;
        }

        return userText;
    }

    private fields: {
        userName: string
    } = {
        userName: ""
    };

    getResourcePoolSetSorted(): any[] {
        return this.ResourcePoolSet.sort((a: any, b: any) => {
            let nameA = a.Name.toLowerCase(), nameB = b.Name.toLowerCase();
            if (nameA < nameB) { return -1 };
            if (nameA > nameB) { return 1 };
            return 0;
        });
    }

    // Functions
    isAuthenticated() {
        return this.Id > 0;
    }
}
