namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;

    [DefaultProperty("Name")]
    // [ODataControllerAuthorization("Administrator")]
    public class Organization : BaseEntity
    {
        public Organization()
        {
            UserOrganizationSet = new HashSet<UserOrganization>();
            UserResourcePoolIndexValueSet = new HashSet<UserResourcePoolIndexValue>();
        }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        public short SectorId { get; set; }

        [Required]
        [StringLength(100)]
        [Display(Name = "Organization")]
        public string Name { get; set; }

        [Display(Name = "Production Cost")]
        public decimal ProductionCost { get; set; }

        [Display(Name = "Sales Price")]
        public decimal SalesPrice { get; set; }

        public short LicenseId { get; set; }

        public virtual Sector Sector { get; set; }
        public virtual License License { get; set; }
        public virtual ICollection<UserOrganization> UserOrganizationSet { get; set; }
        public virtual ICollection<UserResourcePoolIndexValue> UserResourcePoolIndexValueSet { get; set; }

        /* */

        public ResourcePool ResourcePool { get { return Sector.ResourcePool; } }

        /// <summary>
        /// a.k.a. Markup
        /// </summary>
        public decimal Profit
        {
            get { return SalesPrice - ProductionCost; }
        }

        /// <summary>
        /// a.k.a Markup percentage
        /// </summary>
        public decimal ProfitPercentage
        {
            get
            {
                return ProductionCost == 0
                    ? 0
                    : Profit / ProductionCost;
            }
        }

        public decimal ProfitMargin
        {
            get
            {
                return SalesPrice == 0
                    ? 0
                    : Profit / SalesPrice;
            }
        }

        /// <summary>
        /// Will be used in Total Cost Index calculation
        /// </summary>
        public decimal SalesPricePercentage
        {
            get
            {
                return ResourcePool.TotalCostIndex == null
                    ? 0
                    : ResourcePool.TotalCostIndex.IndexValueAverage == 0
                    ? 0
                    : 1 - (SalesPrice / ResourcePool.TotalCostIndex.IndexValueAverage);
            }
        }

        //public decimal QualityRatingAverage
        //{
        //    get
        //    {
        //        return UserOrganizationSet.Any()
        //            ? UserOrganizationSet.Average(item => item.QualityRating)
        //            : 0;
        //    }
        //}

        //public decimal QualityRatingWeightedAverage
        //{
        //    get
        //    {
        //        return ResourcePool.QualityRatingAverage == 0
        //            ? 0
        //            : QualityRatingAverage / ResourcePool.QualityRatingAverage;
        //    }
        //}

        //public decimal EmployeeSatisfactionRatingAverage
        //{
        //    get
        //    {
        //        return UserOrganizationSet.Any()
        //            ? UserOrganizationSet.Average(rating => rating.EmployeeSatisfactionRating)
        //            : 0;
        //    }
        //}

        //public decimal EmployeeSatisfactionRatingWeightedAverage
        //{
        //    get
        //    {
        //        return ResourcePool.EmployeeSatisfactionRatingAverage == 0
        //            ? 0
        //            : EmployeeSatisfactionRatingAverage / ResourcePool.EmployeeSatisfactionRatingAverage;
        //    }
        //}

        //public decimal CustomerSatisfactionRatingAverage
        //{
        //    get
        //    {
        //        return UserOrganizationSet.Any()
        //            ? UserOrganizationSet.Average(rating => rating.CustomerSatisfactionRating)
        //            : 0;
        //    }
        //}

        //public decimal CustomerSatisfactionRatingWeightedAverage
        //{
        //    get
        //    {
        //        return ResourcePool.CustomerSatisfactionRatingAverage == 0
        //            ? 0
        //            : CustomerSatisfactionRatingAverage / ResourcePool.CustomerSatisfactionRatingAverage;
        //    }
        //}
    }
}
