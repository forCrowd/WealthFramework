namespace BusinessObjects
{
    using BusinessObjects.Metadata;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;

    [MetadataType(typeof(SectorMetadata))]
    public partial class Sector : BaseEntity
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
        
        public virtual ICollection<Organization> OrganizationSet { get; set; }
        public virtual ICollection<UserSectorRating> UserSectorRatingSet { get; set; }
        public virtual ResourcePool ResourcePool { get; set; }

        /* */

        public decimal GetAverageRating()
        {
            return UserSectorRatingSet.Any()
                ? UserSectorRatingSet.Average(item => item.Rating)
                : 0;
        }
    }
}
