namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;

    [DefaultProperty("Name")]
    // [ODataControllerAuthorization("Administrator")]
    public class Sector : BaseEntity
    {
        public Sector()
        {
            OrganizationSet = new HashSet<Organization>();
            UserSectorRatingSet = new HashSet<UserSectorRating>();
        }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public short Id { get; set; }

        public int ResourcePoolId { get; set; }

        [Required]
        [StringLength(50)]
        [Display(Name = "Sector")]
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
