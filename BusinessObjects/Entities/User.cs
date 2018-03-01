using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using forCrowd.WealthEconomy.Framework;
using Microsoft.AspNet.Identity.EntityFramework;

namespace forCrowd.WealthEconomy.BusinessObjects.Entities
{
    public class User : IdentityUser<int, UserLogin, UserRole, UserClaim>, IEntity
    {
        [Obsolete("Parameterless constructors used by OData & EF. Make them private when possible.")]
        public User()
        {
            ProjectSet = new HashSet<Project>();
            UserElementFieldSet = new HashSet<UserElementField>();
            UserElementCellSet = new HashSet<UserElementCell>();
        }

        public User(string userName, string email)
            : this()
        {
            Validations.ArgumentNullOrDefault(userName, nameof(userName));
            // TODO Valid email address check?
            Validations.ArgumentNullOrDefault(email, nameof(email));

            UserName = userName;
            Email = email;
        }

        public DateTime? EmailConfirmationSentOn { get; set; }

        /// <summary>
        /// Determines whether user has a password or not.
        /// </summary>
        public bool HasPassword { get; set; }

        /// <summary>
        /// This token's purpose is to allow user to login to the system one time only.
        /// In case of "auto generated guest account" and "external login", the user has no chance to enter a password.
        /// So the client sends a request with this token, the user logs into the system, gets a "bearer" token and this token gets removed.
        /// </summary>
        public string SingleUseToken { get; set; }

        [StringLength(50)]
        public string FirstName { get; set; }

        [StringLength(50)]
        public string MiddleName { get; set; }

        [StringLength(50)]
        public string LastName { get; set; }

        public string Notes { get; set; }

        public DateTime CreatedOn { get; set; }

        public DateTime ModifiedOn { get; set; }

        public DateTime? DeletedOn { get; set; }

        [Timestamp]
        public byte[] RowVersion { get; set; }

        public virtual ICollection<Project> ProjectSet { get; set; }
        public virtual ICollection<UserElementField> UserElementFieldSet { get; set; }
        public virtual ICollection<UserElementCell> UserElementCellSet { get; set; }

        /// <summary>
        /// Reset properties to their default values, except for UserName and CreatedOn
        /// Function is used in requesting a user's profile details other than the logged in user, therefore only limited details should be shown
        /// TODO Find a better way of doing this?
        /// </summary>
        public void ResetValues()
        {
            AccessFailedCount = default(int);
            Email = default(string);
            EmailConfirmed = default(bool);
            EmailConfirmationSentOn = null;
            LockoutEnabled = default(bool);
            LockoutEndDateUtc = default(DateTime?);
            PasswordHash = default(string);
            PhoneNumber = default(string);
            PhoneNumberConfirmed = default(bool);
            SecurityStamp = default(string);
            TwoFactorEnabled = default(bool);
            //UserName = default(string);
            HasPassword = default(bool);
            SingleUseToken = default(string);
            FirstName = default(string);
            MiddleName = default(string);
            LastName = default(string);
            Notes = default(string);
            CreatedOn = default(DateTime);
            ModifiedOn = default(DateTime);
            DeletedOn = default(DateTime?);
            RowVersion = new byte[] { };
        }
    }
}
