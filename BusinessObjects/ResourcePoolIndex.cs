namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    [DisplayName("CMRP Index")]
    [BusinessObjects.Attributes.DefaultProperty("Name")]
    // [ODataControllerAuthorization("Administrator")]
    public class ResourcePoolIndex : BaseEntity
    {
        public ResourcePoolIndex()
        {
            UserResourcePoolIndexSet = new HashSet<UserResourcePoolIndex>();
        }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        public int ResourcePoolId { get; set; }

        [Required]
        [StringLength(50)]
        [Display(Name = "Resource Pool Index")]
        public string Name { get; set; }

        [Required]
        [Display(Name = "Resource Pool Index Type")]
        public byte ResourcePoolIndexType { get; set; }
        public Nullable<int> ElementId { get; set; }
        public Nullable<int> ElementFieldId { get; set; }
        
        [Required]
        [Display(Name = "Rating Sort Type")]
        public byte RatingSortType { get; set; }

        public virtual ResourcePool ResourcePool { get; set; }
        public virtual Element Element { get; set; }
        public virtual ElementField ElementField { get; set; }
        public virtual ICollection<UserResourcePoolIndex> UserResourcePoolIndexSet { get; set; }

        /* */

        public IEnumerable<ResourcePoolIndexOrganization> ResourcePoolIndexOrganizationSet
        {
            get
            {
                var list = new HashSet<ResourcePoolIndexOrganization>();
                foreach (var item in ResourcePool.OrganizationSet)
                    list.Add(new ResourcePoolIndexOrganization(this, item));
                return list;
            }
        }

        /// <summary>
        /// How many users rated this index?
        /// </summary>
        public decimal IndexRatingCount
        {
            get { return UserResourcePoolIndexSet.Count(); }
        }

        /// <summary>
        /// What is the average rating for this index?
        /// It will be used to determine the weight of this index in its resource pool.
        /// </summary>
        public decimal IndexRatingAverage
        {
            get
            {
                return UserResourcePoolIndexSet.Any()
                    ? UserResourcePoolIndexSet.Average(item => item.Rating)
                    : 0;
            }
        }

        public decimal IndexRatingPercentage
        {
            get
            {
                return ResourcePool.IndexRatingAverage == 0
                    ? 0
                    : IndexRatingAverage / ResourcePool.IndexRatingAverage;
            }
        }

        //public decimal IndexValue
        //{
        //    get
        //    {
        //        switch (ResourcePoolIndexType)
        //        {
        //            //case (byte)BusinessObjects.ResourcePoolIndexType.TotalCostIndex:
        //            //    return ResourcePool.OrganizationSet.Sum(item => item.SalesPrice);
        //            //case (byte)BusinessObjects.ResourcePoolIndexType.DynamicOrganizationIndex:
        //            //    return ResourcePoolIndexOrganizationSet.Sum(item => item.DynamicOrganizationIndexValueAverage);
        //            default: throw new ArgumentOutOfRangeException();
        //        }
        //    }
        //}
    }
}
