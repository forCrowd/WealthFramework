namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using Microsoft.AspNet.Identity.EntityFramework;
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;
    using System.Threading.Tasks;

    [BusinessObjects.Attributes.DefaultProperty("Email")]
    public class User : IdentityUser<int, UserLogin, UserRole, UserClaim>, IEntity
    {
        public User()
        {
            UserResourcePoolSet = new HashSet<UserResourcePool>();
            UserElementCellSet = new HashSet<UserElementCell>();
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

        public virtual ICollection<UserResourcePool> UserResourcePoolSet { get; set; }
        public virtual ICollection<UserElementCell> UserElementCellSet { get; set; }

        // TODO Block from Web Api Identity template?
        //public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager <ApplicationUser> manager)
        //{
        //    // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
        //    var userIdentity = await manager.CreateIdentityAsync(this, DefaultAuthenticationTypes.ApplicationCookie);
        //    // Add custom user claims here
        //    return userIdentity;
        //}
    }
}

//namespace BusinessObjects
//{
//    using BusinessObjects.Attributes;
//    using System.Collections.Generic;
//    using System.ComponentModel;
//    using System.ComponentModel.DataAnnotations;

//    [BusinessObjects.Attributes.DefaultProperty("Email")]
//    public class User : BaseEntity
//    {
//        public User()
//        {
//            UserResourcePoolSet = new HashSet<UserResourcePool>();
//            UserResourcePoolIndexSet = new HashSet<UserResourcePoolIndex>();
//            UserElementCellSet = new HashSet<UserElementCell>();
//        }

//        [DisplayOnListView(false)]
//        [DisplayOnEditView(false)]
//        public int Id { get; set; }

//        [Required]
//        [StringLength(256)]
//        [DisplayOnListView(false)]
//        [DisplayOnEditView(false)]
//        public string AspNetUserId { get; set; }

//        [Required]
//        [StringLength(100)]
//        [Display(Name = "Email")]
//        public string Email { get; set; }

//        [StringLength(50)]
//        [Display(Name = "First Name")]
//        public string FirstName { get; set; }

//        [StringLength(50)]
//        [Display(Name = "Middle Name")]
//        public string MiddleName { get; set; }

//        [StringLength(50)]
//        [Display(Name = "Last Name")]
//        public string LastName { get; set; }

//        [DisplayOnListView(false)]
//        public string Notes { get; set; }

//        public virtual ICollection<UserResourcePool> UserResourcePoolSet { get; set; }
//        public virtual ICollection<UserResourcePoolIndex> UserResourcePoolIndexSet { get; set; }
//        public virtual ICollection<UserElementCell> UserElementCellSet { get; set; }
//    }
//}
