namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;

    [DefaultProperty("Name")]
    // [ODataControllerAuthorization("Administrator")]
    public class ResourcePool : BaseEntity
    {
        public ResourcePool()
        {
            ResourcePoolIndexSet = new HashSet<ResourcePoolIndex>();
            LicenseSet = new HashSet<License>();
            SectorSet = new HashSet<Sector>();
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
        public virtual ICollection<Sector> SectorSet { get; set; }
        public virtual ICollection<License> LicenseSet { get; set; }
        public virtual ICollection<UserResourcePool> UserResourcePoolSet { get; set; }

        /* */

        public IEnumerable<Organization> OrganizationSet
        {
            get { return SectorSet.SelectMany(sector => sector.OrganizationSet); }
        }

        #region - Indexes -

        public decimal SectorIndexRatingAverage
        {
            get
            {
                return UserResourcePoolSet.Any()
                    ? UserResourcePoolSet.Average(item => item.SectorIndexRating)
                    : 0;
            }
        }

        public decimal SectorIndexRatingPercentage
        {
            get
            {
                return TotalIndexRatingAverage == 0
                    ? 0
                    : SectorIndexRatingAverage / TotalIndexRatingAverage;
            }
        }
        
        public decimal KnowledgeIndexRatingAverage
        {
            get
            {
                return UserResourcePoolSet.Any()
                    ? UserResourcePoolSet.Average(item => item.KnowledgeIndexRating)
                    : 0;
            }
        }

        public decimal KnowledgeIndexRatingPercentage
        {
            get
            {
                return TotalIndexRatingAverage == 0
                    ? 0
                    : KnowledgeIndexRatingAverage / TotalIndexRatingAverage;
            }
        }

        public decimal TotalCostIndexRatingAverage
        {
            get
            {
                return UserResourcePoolSet.Any()
                    ? UserResourcePoolSet.Average(item => item.TotalCostIndexRating)
                    : 0;
            }
        }

        public decimal TotalCostIndexRatingPercentage
        {
            get
            {
                return TotalIndexRatingAverage == 0
                    ? 0
                    : TotalCostIndexRatingAverage / TotalIndexRatingAverage;
            }
        }

        //public decimal QualityIndexRatingAverage
        //{
        //    get
        //    {
        //        return UserResourcePoolSet.Any()
        //            ? UserResourcePoolSet.Average(item => item.QualityIndexRating)
        //            : 0;
        //    }
        //}

        //public decimal QualityIndexRatingWeightedAverage
        //{
        //    get
        //    {
        //        return TotalIndexRatingAverage == 0
        //            ? 0
        //            : QualityIndexRatingAverage / TotalIndexRatingAverage;
        //    }
        //}

        //public decimal EmployeeSatisfactionIndexRatingAverage
        //{
        //    get
        //    {
        //        return UserResourcePoolSet.Any()
        //            ? UserResourcePoolSet.Average(item => item.EmployeeSatisfactionIndexRating)
        //            : 0;
        //    }
        //}

        //public decimal EmployeeSatisfactionIndexRatingWeightedAverage
        //{
        //    get
        //    {
        //        return TotalIndexRatingAverage == 0
        //            ? 0
        //            : EmployeeSatisfactionIndexRatingAverage / TotalIndexRatingAverage;
        //    }
        //}

        //public decimal CustomerSatisfactionIndexRatingAverage
        //{
        //    get
        //    {
        //        return UserResourcePoolSet.Any()
        //            ? UserResourcePoolSet.Average(item => item.CustomerSatisfactionIndexRating)
        //            : 0;
        //    }
        //}

        //public decimal CustomerSatisfactionIndexRatingWeightedAverage
        //{
        //    get
        //    {
        //        return TotalIndexRatingAverage == 0
        //            ? 0
        //            : CustomerSatisfactionIndexRatingAverage / TotalIndexRatingAverage;
        //    }
        //}

        public decimal IndexRatingAverage
        {
            get { return ResourcePoolIndexSet.Sum(item => item.IndexRatingAverage); }
        }

        public decimal TotalIndexRatingAverage
        {
            get
            {
                return SectorIndexRatingAverage
                    + KnowledgeIndexRatingAverage
                    + TotalCostIndexRatingAverage
                    //+ QualityIndexRatingAverage
                    //+ EmployeeSatisfactionIndexRatingAverage
                    //+ CustomerSatisfactionIndexRatingAverage
                    + IndexRatingAverage;
            }
        }

        #endregion

        public decimal SectorRatingAverage
        {
            get { return SectorSet.Sum(sector => sector.RatingAverage); }
        }

        public decimal LicenseRatingAverage
        {
            get { return LicenseSet.Sum(license => license.RatingAverage); }
        }

        //public decimal QualityRatingAverage
        //{
        //    get { return OrganizationSet.Sum(item => item.QualityRatingAverage); }
        //}

        //public decimal EmployeeSatisfactionRatingAverage
        //{
        //    get { return OrganizationSet.Sum(item => item.EmployeeSatisfactionRatingAverage); }
        //}

        //public decimal CustomerSatisfactionRatingAverage
        //{
        //    get { return OrganizationSet.Sum(organization => organization.CustomerSatisfactionRatingAverage); }
        //}

        public decimal ProductionCost
        {
            get { return OrganizationSet.Sum(organization => organization.ProductionCost); }
        }

        public decimal SalesPrice
        {
            get { return OrganizationSet.Sum(organization => organization.SalesPrice); }
        }

        public decimal Profit
        {
            get { return OrganizationSet.Sum(organization => organization.Profit); }
        }

        public decimal ProfitPercentage
        {
            get
            {
                return OrganizationSet.Any()
                    ? OrganizationSet.Average(organization => organization.ProfitPercentage)
                    : 0;
            }
        }

        public decimal ProfitMargin
        {
            get
            {
                return OrganizationSet.Any()
                    ? OrganizationSet.Average(organization => organization.ProfitMargin)
                    : 0;
            }
        }
    }
}
