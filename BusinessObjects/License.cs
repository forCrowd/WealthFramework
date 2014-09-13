namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;

    [BusinessObjects.Attributes.DefaultProperty("Name")]
    // [ODataControllerAuthorization("Administrator")]
    public class License : BaseEntity
    {
        public License()
        {
            OrganizationSet = new HashSet<Organization>();
            UserLicenseRatingSet = new HashSet<UserLicenseRating>();
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

        public int RatingCount
        {
            get { return UserLicenseRatingSet.Count(); }
        }

        public decimal RatingAverage
        {
            get
            {
                return UserLicenseRatingSet.Any()
                    ? UserLicenseRatingSet.Average(item => item.Rating)
                    : 0;
            }
        }

        public decimal RatingPercentage
        {
            get
            {
                return ResourcePool.KnowledgeIndex == null
                    ? 0
                    : ResourcePool.KnowledgeIndex.IndexValue == 0
                    ? 0
                    : RatingAverage / ResourcePool.KnowledgeIndex.IndexValue;
            }
        }
    }
}
