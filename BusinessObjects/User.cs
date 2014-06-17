namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    [DefaultProperty("Email")]
    public partial class User : BaseEntity
    {
        public User()
        {
            this.UserLicenseRatingSet = new HashSet<UserLicenseRating>();
            this.UserOrganizationSet = new HashSet<UserOrganization>();
            this.UserResourcePoolSet = new HashSet<UserResourcePool>();
            this.UserSectorRatingSet = new HashSet<UserSectorRating>();
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
        
        public virtual ICollection<UserLicenseRating> UserLicenseRatingSet { get; set; }
        
        public virtual ICollection<UserOrganization> UserOrganizationSet { get; set; }
        
        public virtual ICollection<UserResourcePool> UserResourcePoolSet { get; set; }

        public virtual ICollection<UserSectorRating> UserSectorRatingSet { get; set; }
    }
}
