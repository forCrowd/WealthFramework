namespace BusinessObjects
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;
    using BusinessObjects.Metadata;

    [MetadataType(typeof(SectorMetadata))]
    public partial class Sector : IEntity
    {
        public Sector()
        {
            this.OrganizationSet = new HashSet<Organization>();
            this.UserSectorRatingSet = new HashSet<UserSectorRating>();
        }

        public short Id { get; set; }
        public int ResourcePoolId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime ModifiedOn { get; set; }
        public Nullable<DateTime> DeletedOn { get; set; }

        public virtual ICollection<Organization> OrganizationSet { get; set; }
        public virtual ICollection<UserSectorRating> UserSectorRatingSet { get; set; }
        public virtual ResourcePool ResourcePool { get; set; }

        /* */

        public decimal GetAverageRating()
        {
            return GetAverageRating(0);
        }

        public decimal GetAverageRating(int userId)
        {
            var ratings = userId > 0
                ? UserSectorRatingSet.Where(rating => rating.UserId == userId)
                : UserSectorRatingSet;

            if (!ratings.Any())
                return 0;

            return ratings.Average(rating => rating.Rating);
        }
    }
}
