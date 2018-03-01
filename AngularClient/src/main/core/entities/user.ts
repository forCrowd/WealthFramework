import { EntityBase } from "./entity-base";
import { Project } from "./project";
import { UserElementCell } from "./user-element-cell";
import { UserElementField } from "./user-element-field";
import { UserRole } from "./user-role";
import { stripInvalidChars } from "../../shared/utils";

export class User extends EntityBase {

    // Server-side
    Id = 0;
    Email = "";
    EmailConfirmed = false;
    EmailConfirmationSentOn: Date | null;
    UserName = "";;
    FirstName: string = null;
    MiddleName: string = null;
    LastName: string = null;
    SingleUseToken: string = null;
    HasPassword = false;
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
    ProjectSet: Project[];
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

    isAuthenticated(): boolean {
        return this.Id > 0;
    }
}
