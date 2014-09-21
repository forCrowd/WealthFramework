namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;

    [BusinessObjects.Attributes.DefaultProperty("Email")]
    public class User : BaseEntity
    {
        public User()
        {
            UserResourcePoolSet = new HashSet<UserResourcePool>();
            UserResourcePoolIndexSet = new HashSet<UserResourcePoolIndex>();
            UserResourcePoolIndexValueSet = new HashSet<UserResourcePoolIndexValue>();
            UserOrganizationSet = new HashSet<UserOrganization>();
            UserElementItemSet = new HashSet<UserElementItem>();
        }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        [Required]
        [StringLength(256)]
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public string AspNetUserId { get; set; }

        [Required]
        [StringLength(100)]
        [Display(Name = "Email")]
        public string Email { get; set; }

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

        public virtual ICollection<UserResourcePool> UserResourcePoolSet { get; set; }
        public virtual ICollection<UserResourcePoolIndex> UserResourcePoolIndexSet { get; set; }
        public virtual ICollection<UserResourcePoolIndexValue> UserResourcePoolIndexValueSet { get; set; }
        public virtual ICollection<UserOrganization> UserOrganizationSet { get; set; }
        public virtual ICollection<UserElementItem> UserElementItemSet { get; set; }


    }
}
