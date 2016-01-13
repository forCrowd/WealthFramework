(function () {
    'use strict';

    var factoryId = 'User';
    angular.module('main')
        .factory(factoryId, ['logger', userFactory]);

    function userFactory(logger) {

        // Logger
        logger = logger.forSource(factoryId);

        // Return
        return User;

        function User() {

            var self = this;

            // Server-side props
            self.Id = 0;
            self.Email = '';
            self.EmailConfirmed = false;
            self.UserName = '';
            self.FirstName = '';
            self.MiddleName = '';
            self.LastName = '';
            self.PhoneNumber = '';
            self.PhoneNumberConfirmed = false;
            self.TwoFactorEnabled = false;
            self.AccessFailedCount = 0;
            self.LockoutEnabled = false;
            self.LockoutEndDateUtc = null;
            self.Notes = '';
            self.CreatedOn = new Date();
            self.ModifiedOn = new Date();
            self.DeletedOn = null;
            // TODO breezejs - Cannot assign a navigation property in an entity ctor
            //self.Claims = null;
            //self.Logins = [];
            //self.Roles = [];

            // Functions
            self.hasPassword = hasPassword;
            self.isAuthenticated = isAuthenticated;

            /*** Implementations ***/

            function hasPassword() {
                if (typeof self.Claims === 'undefined') {
                    throw new Error('Invalid operation: Claims is undefined');
                }

                for (var i = 0; i < self.Claims.length; i++) {
                    var claim = self.Claims[i];
                    if (claim.ClaimType === 'HasNoPassword') {
                        return false;
                    }
                }

                return true;
            }

            function isAuthenticated() {
                return self.Id > 0;
            }
        }
    }
})();