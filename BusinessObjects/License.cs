namespace BusinessObjects
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;
    using BusinessObjects.Metadata;

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
            return GetAverageRating(0);
        }

        public decimal GetAverageRating(int userId)
        {
            var ratings = userId > 0
                ? UserLicenseRatingSet.Where(rating => rating.UserId == userId)
                : UserLicenseRatingSet;

            if (!ratings.Any())
                return 0;

            return ratings.Average(rating => rating.Rating);
        }
    }
}
