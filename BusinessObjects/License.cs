namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;

    [DefaultProperty("Name")]
    // [ODataControllerAuthorization("Administrator")]
    public partial class License : BaseEntity
    {
        public License()
        {
            this.OrganizationSet = new HashSet<Organization>();
            this.UserLicenseRatingSet = new HashSet<UserLicenseRating>();
        }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public short Id { get; set; }

        public int ResourcePoolId { get; set; }
        
        [Display(Name = "License")]
        [Required]
        [StringLength(50)]
        public string Name { get; set; }

        public string Description { get; set; }

        [DisplayOnListView(false)]
        [Required]
        public string Text { get; set; }

        public virtual ICollection<Organization> OrganizationSet { get; set; }
        public virtual ICollection<UserLicenseRating> UserLicenseRatingSet { get; set; }
        public virtual ResourcePool ResourcePool { get; set; }

        /* */

        public decimal GetAverageRating()
        {
            return UserLicenseRatingSet.Any()
                ? UserLicenseRatingSet.Average(item => item.Rating)
                : 0;
        }
    }
}
