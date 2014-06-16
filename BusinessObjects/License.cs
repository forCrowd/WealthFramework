namespace BusinessObjects
{
    using BusinessObjects.Metadata;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;

    [MetadataType(typeof(LicenseMetadata))]
    public partial class License : BaseEntity
    {
        public License()
        {
            this.OrganizationSet = new HashSet<Organization>();
            this.UserLicenseRatingSet = new HashSet<UserLicenseRating>();
        }

        public short Id { get; set; }
        public int ResourcePoolId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
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
