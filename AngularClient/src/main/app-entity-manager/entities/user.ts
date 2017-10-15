import { EntityBase } from "./entity-base";
import { ResourcePool } from "./resource-pool";
import { UserElementCell } from "./user-element-cell";
import { UserElementField } from "./user-element-field";
import { UserRole } from "./user-role";
import { stripInvalidChars } from "../../utils";

export class User extends EntityBase {

    // Server-side
    Id = 0;
    Email = "";
    EmailConfirmed = false;
    EmailConfirmationSentOn: Date | null;
    get UserName(): string {
        return this.fields.userName;
    }
    set UserName(value: string) {
        const newValue = stripInvalidChars(value);

        if (this.fields.userName !== newValue) {
            this.fields.userName = newValue;
        }
    }

    SingleUseToken: string = null;
    HasPassword = false;
    FirstName = "";
    MiddleName = "";
    LastName = "";
    PhoneNumber = "";
    PhoneNumberConfirmed = false;
    TwoFactorEnabled = false;
    AccessFailedCount = 0;
    LockoutEnabled = false;
    LockoutEndDateUtc: Date = null;
    Notes = "";
    Claims: any[];
    Logins: any[];
    Roles: UserRole[];
    ResourcePoolSet: ResourcePool[];
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

    getResourcePoolSetSorted(): ResourcePool[] {
        return this.ResourcePoolSet.sort((a, b) => {
            const nameA = a.Name.toLowerCase();
            const nameB = b.Name.toLowerCase();
            if (nameA < nameB) { return -1 };
            if (nameA > nameB) { return 1 };
            return 0;
        });
    }

    // Functions
    isAuthenticated(): boolean {
        return this.Id > 0;
    }

    isAdmin(): boolean {

        if (!this.initialized) {
            return false;
        }

        return this.Roles[0].Role.Name === "Administrator";
    }
}
