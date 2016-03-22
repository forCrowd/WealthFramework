namespace forCrowd.WealthEconomy.BusinessObjects
{
    using Framework;
    using Microsoft.AspNet.Identity.EntityFramework;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    public class User : IdentityUser<int, UserLogin, UserRole, UserClaim>, IEntity
    {
        [Obsolete("Parameterless constructors used by OData & EF. Make them private when possible.")]
        public User()
        {
            ResourcePoolSet = new HashSet<ResourcePool>();
            UserResourcePoolSet = new HashSet<UserResourcePool>();
            UserElementFieldSet = new HashSet<UserElementField>();
            UserElementCellSet = new HashSet<UserElementCell>();
        }

        public User(string userName, string email)
            : this()
        {
            Validations.ArgumentNullOrDefault(userName, "userName");
            // TODO Valid email address check?
            Validations.ArgumentNullOrDefault(email, "email");

            UserName = userName;
            Email = email;
        }

        public bool IsAnonymous { get; set; }

        /// <summary>
        /// Determines whether user has a password or not.
        /// Since in most cases the user will have a password, keep only false value, 'null' will be treated as true.
        /// </summary>
        public bool? HasPassword { get; set; }

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

        public virtual ICollection<ResourcePool> ResourcePoolSet { get; set; }
        public virtual ICollection<UserResourcePool> UserResourcePoolSet { get; set; }
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
            LockoutEnabled = default(bool);
            LockoutEndDateUtc = default(DateTime?);
            PasswordHash = default(string);
            PhoneNumber = default(string);
            PhoneNumberConfirmed = default(bool);
            SecurityStamp = default(string);
            TwoFactorEnabled = default(bool);
            //UserName = default(string);
            IsAnonymous = default(bool);
            HasPassword = default(bool?);
            SingleUseToken = default(string);
            FirstName = default(string);
            MiddleName = default(string);
            LastName = default(string);
            Notes = default(string);
            //CreatedOn = default(string);
            ModifiedOn = default(DateTime);
            DeletedOn = default(DateTime?);
            RowVersion = new byte[] { };
        }
    }
}
