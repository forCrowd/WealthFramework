namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;

    [DisplayName("CMRP")]
    [BusinessObjects.Attributes.DefaultProperty("Name")]
    // [ODataControllerAuthorization("Administrator")]
    public class ResourcePool : BaseEntity
    {
        public ResourcePool()
        {
            ElementSet = new HashSet<Element>();
            ResourcePoolIndexSet = new HashSet<ResourcePoolIndex>();
            OrganizationSet = new HashSet<Organization>();
            UserResourcePoolSet = new HashSet<UserResourcePool>();
        }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        [Display(Name = "Resource Pool")]
        public string Name { get; set; }

        [Required]
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public bool IsSample { get; set; }

        public virtual ICollection<ResourcePoolIndex> ResourcePoolIndexSet { get; set; }
        public virtual ICollection<Element> ElementSet { get; set; }
        public virtual ICollection<Organization> OrganizationSet { get; set; }
        public virtual ICollection<UserResourcePool> UserResourcePoolSet { get; set; }

        #region - Indexes -

        //public ResourcePoolIndex TotalCostIndex
        //{
        //    // TODO Static types can only be defined once per ResourcePool
        //    get { return ResourcePoolIndexSet.SingleOrDefault(item => item.ResourcePoolIndexType == (byte)ResourcePoolIndexType.TotalCostIndex); }
        //}

        public decimal IndexRatingAverage
        {
            get { return ResourcePoolIndexSet.Sum(item => item.IndexRatingAverage); }
        }

        #endregion

        //public decimal ProductionCost
        //{
        //    get { return OrganizationSet.Sum(organization => organization.ProductionCost); }
        //}

        public decimal SalesPrice
        {
            get { return OrganizationSet.Sum(organization => organization.SalesPrice); }
        }

        //public decimal Profit
        //{
        //    get { return OrganizationSet.Sum(organization => organization.Profit); }
        //}

        //public decimal ProfitPercentage
        //{
        //    get
        //    {
        //        return OrganizationSet.Any()
        //            ? OrganizationSet.Average(organization => organization.ProfitPercentage)
        //            : 0;
        //    }
        //}

        //public decimal ProfitMargin
        //{
        //    get
        //    {
        //        return OrganizationSet.Any()
        //            ? OrganizationSet.Average(organization => organization.ProfitMargin)
        //            : 0;
        //    }
        //}
    }
}
