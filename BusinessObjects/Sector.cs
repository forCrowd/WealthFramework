//namespace BusinessObjects
//{
//    using BusinessObjects.Attributes;
//    using System.Collections.Generic;
//    using System.ComponentModel.DataAnnotations;
//    using System.Linq;

//    [BusinessObjects.Attributes.DefaultProperty("Name")]
//    // [ODataControllerAuthorization("Administrator")]
//    public class Sector : BaseEntity
//    {
//        public Sector()
//        {
//            OrganizationSet = new HashSet<Organization>();
//            UserSectorRatingSet = new HashSet<UserSectorRating>();
//        }

//        [DisplayOnListView(false)]
//        [DisplayOnEditView(false)]
//        public short Id { get; set; }

//        public int ResourcePoolId { get; set; }

//        [Required]
//        [StringLength(50)]
//        [Display(Name = "Sector")]
//        public string Name { get; set; }

//        public string Description { get; set; }

//        public virtual ICollection<Organization> OrganizationSet { get; set; }
//        public virtual ICollection<UserSectorRating> UserSectorRatingSet { get; set; }
//        public virtual ResourcePool ResourcePool { get; set; }

//        /* */

//        public int RatingCount
//        {
//            get { return UserSectorRatingSet.Count(); }
//        }

//        public decimal RatingAverage
//        {
//            get
//            {
//                return UserSectorRatingSet.Any()
//                    ? UserSectorRatingSet.Average(item => item.Rating)
//                    : 0;
//            }
//        }

//        public decimal RatingPercentage
//        {
//            get
//            {
//                return ResourcePool.SectorIndex == null
//                    ? 0
//                    : ResourcePool.SectorIndex.IndexValue == 0
//                    ? 0
//                    : RatingAverage / ResourcePool.SectorIndex.IndexValue;
//            }
//        }
//    }
//}
