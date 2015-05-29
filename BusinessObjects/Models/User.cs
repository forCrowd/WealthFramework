namespace forCrowd.WealthEconomy.BusinessObjects
{
    using forCrowd.WealthEconomy.BusinessObjects.Attributes;
    using forCrowd.WealthEconomy.Framework;
    using Microsoft.AspNet.Identity.EntityFramework;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;
    using System.Security.Permissions;
    using System.Threading.Tasks;

    [forCrowd.WealthEconomy.BusinessObjects.Attributes.DefaultProperty("Email")]
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

        public User(string email)
            : this()
        {
            Validations.ArgumentNullOrDefault(email, "email");
            // TODO Email address validation?

            Email = email;
            UserName = email;
        }

        [StringLength(50)]
        [Display(Name = "First Name")]
        public string FirstName { get; set; }

        [StringLength(50)]
        [Display(Name = "Middle Name")]
        public string MiddleName { get; set; }

        [StringLength(50)]
        [Display(Name = "Last Name")]
        public string LastName { get; set; }

        [DisplayOnListView(false)]
        public string Notes { get; set; }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public System.DateTime CreatedOn { get; set; }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public System.DateTime ModifiedOn { get; set; }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public System.DateTime? DeletedOn { get; set; }

        [Timestamp]
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public byte[] RowVersion { get; set; }

        public virtual ICollection<ResourcePool> ResourcePoolSet { get; set; }
        public virtual ICollection<UserResourcePool> UserResourcePoolSet { get; set; }
        public virtual ICollection<UserElementField> UserElementFieldSet { get; set; }
        public virtual ICollection<UserElementCell> UserElementCellSet { get; set; }
    }
}

