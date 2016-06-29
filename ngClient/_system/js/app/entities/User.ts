module Main.Entities {
    'use strict';

    export class User {

        // Server-side
        Id = 0;
        Email = '';
        EmailConfirmed = false;
        IsAnonymous = false;
        UserName = '';
        SingleUseToken = null;
        HasPassword = false;
        FirstName = '';
        MiddleName = '';
        LastName = '';
        PhoneNumber = '';
        PhoneNumberConfirmed = false;
        TwoFactorEnabled = false;
        AccessFailedCount = 0;
        LockoutEnabled = false;
        LockoutEndDateUtc = null;
        Notes = '';
        CreatedOn = new Date();
        ModifiedOn = new Date();
        DeletedOn = null;
        // TODO breezejs - Cannot assign a navigation property in an entity ctor
        //Claims = null;
        //Logins = [];
        //Roles = [];

        // Functions
        isAuthenticated() {
            return this.Id > 0;
        }
    }
}