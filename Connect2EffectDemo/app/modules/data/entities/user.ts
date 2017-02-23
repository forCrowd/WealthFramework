import { EntityBase } from "./entity-base";
import { stripInvalidChars } from "../../../utils";

export class User extends EntityBase {

    // Server-side
    Id = 0;
    Email = "";
    EmailConfirmed = false;
    IsAnonymous = false;
    get UserName(): string {
        return this.fields.userName;
    }
    set UserName(value: string) {
        var newValue = value;
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
    CreatedOn = new Date();
    ModifiedOn = new Date();
    DeletedOn: any = null;
    Claims: any;
    Logins: any[];
    Roles: any[];
    ResourcePoolSet: any[];
    UserResourcePoolSet: any[];
    UserElementFieldSet: any[];
    UserElementCellSet: any[];

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
