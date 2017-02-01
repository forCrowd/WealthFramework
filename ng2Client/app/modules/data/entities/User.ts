export class User {

    // Server-side
    Id = 0;
    Email = "";
    EmailConfirmed = false;
    IsAnonymous = false;
    UserName = "";
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
    // TODO breezejs - Cannot assign a navigation property in an entity ctor
    //Claims = null;
    //Logins = [];
    //Roles = [];
    //ResourcePoolSet = [];
    //UserResourcePoolSet = [];
    //UserElementFieldSet = [];
    //UserElementCellSet = [];

    getResourcePoolSetSorted(): any[] {
        return (this as any).ResourcePoolSet.sort((a: any, b: any) => {
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
