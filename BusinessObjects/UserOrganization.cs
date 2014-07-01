namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;

    [DefaultProperty("Name")]
    public class UserOrganization : BaseEntity
    {
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        public int UserId { get; set; }

        public int OrganizationId { get; set; }

        [Display(Name = "Number of Sales")]
        public int NumberOfSales { get; set; }

        //[Display(Name = "Quality Rating")]
        //public decimal QualityRating { get; set; }

        //[Display(Name = "Customer Satisfaction Rating")]
        //public decimal CustomerSatisfactionRating { get; set; }

        //[Display(Name = "Employee Satisfaction Rating")]
        //public decimal EmployeeSatisfactionRating { get; set; }

        public virtual Organization Organization { get; set; }

        public virtual User User { get; set; }

        /* */

        // A bit weird navigation property.
        // To prevent this (or ideally), there needs to be a foreign key between this class and UserResourcePool (UserResourcePoolId on this class).
        public UserResourcePool UserResourcePool
        {
            get { return User.UserResourcePoolSet.Single(item => item.ResourcePool == Organization.Sector.ResourcePool); }
        }

        public IEnumerable<UserResourcePoolIndexOrganization> UserResourcePoolIndexOrganizationSet
        {
            get
            {
                var list = new HashSet<UserResourcePoolIndexOrganization>();

                foreach (var item in UserResourcePool.ResourcePool.ResourcePoolIndexSet)
                    list.Add(new UserResourcePoolIndexOrganization(this, new ResourcePoolIndexOrganization(item, Organization)));

                return list;
            }
        }

        public decimal NumberOfSalesPercentage
        {
            get
            {
                return UserResourcePool.NumberOfSales == 0
                    ? 0
                    : decimal.Divide(NumberOfSales, UserResourcePool.NumberOfSales);
            }
        }

        public decimal ResourcePoolTax
        {
            get
            {
                return Organization.SalesPrice * UserResourcePool.ResourcePoolRatePercentage;
            }
        }

        public decimal SalesPriceIncludingResourcePoolTax
        {
            get { return Organization.SalesPrice + ResourcePoolTax; }
        }

        public decimal TotalProductionCost
        {
            get { return Organization.ProductionCost * NumberOfSales; }
        }

        public decimal TotalSalesRevenue
        {
            get { return Organization.SalesPrice * NumberOfSales; }
        }

        public decimal TotalProfit
        {
            get { return Organization.Profit * NumberOfSales; }
        }

        public decimal TotalResourcePoolTax
        {
            get { return ResourcePoolTax * NumberOfSales; }
        }

        public decimal TotalSalesRevenueIncludingResourcePoolTax
        {
            get { return SalesPriceIncludingResourcePoolTax * NumberOfSales; }
        }

        #region - Sector Index -

        //public decimal SectorIndexValuePercentageWithNumberOfSales
        //{
        //    get { return Organization.Sector.RatingPercentage * NumberOfSales; }
        //}

        //public decimal SectorIndexValuePercentageWithNumberOfSalesPercentage
        //{
        //    get
        //    {
        //        return UserResourcePool.SectorIndexValuePercentageWithNumberOfSales == 0
        //            ? 0
        //            : SectorIndexValuePercentageWithNumberOfSales / UserResourcePool.SectorIndexValuePercentageWithNumberOfSales;
        //    }
        //}

        public decimal SectorIndexValueMultiplied
        {
            get { return Organization.Sector.RatingPercentage * NumberOfSalesPercentage; }
        }

        public decimal SectorIndexValuePercentage
        {
            get
            {
                return UserResourcePool.SectorIndexValueMultiplied == 0
                    ? 0
                    : SectorIndexValueMultiplied / UserResourcePool.SectorIndexValueMultiplied;
            }
        }

        public decimal SectorIndexIncome
        {
            //get { return UserResourcePool.SectorIndexShare * SectorIndexValuePercentageWithNumberOfSalesPercentage; }
            get { return UserResourcePool.SectorIndexShare * SectorIndexValuePercentage; }
        }

        #endregion

        #region - Knowledge Index -

        //public decimal KnowledgeIndexValuePercentageWithNumberOfSales
        //{
        //    get
        //    {
        //        if (Organization.License == null)
        //            return 0;

        //        return Organization.License.RatingPercentage * NumberOfSales;
        //    }
        //}

        //public decimal KnowledgeIndexValuePercentageWithNumberOfSalesPercentage
        //{
        //    get
        //    {
        //        return UserResourcePool.KnowledgeIndexValuePercentageWithNumberOfSales == 0
        //            ? 0
        //            : KnowledgeIndexValuePercentageWithNumberOfSales / UserResourcePool.KnowledgeIndexValuePercentageWithNumberOfSales;
        //    }
        //}

        public decimal KnowledgeIndexValueMultiplied
        {
            get
            {
                if (Organization.License == null)
                    return 0;

                return Organization.License.RatingPercentage * NumberOfSalesPercentage;
            }
        }

        public decimal KnowledgeIndexValuePercentage
        {
            get
            {
                return UserResourcePool.KnowledgeIndexValueMultiplied == 0
                    ? 0
                    : KnowledgeIndexValueMultiplied / UserResourcePool.KnowledgeIndexValueMultiplied;
            }
        }

        public decimal KnowledgeIndexIncome
        {
            get
            {
                //return UserResourcePool.KnowledgeIndexShare * KnowledgeIndexValuePercentageWithNumberOfSalesPercentage;
                return UserResourcePool.KnowledgeIndexShare * KnowledgeIndexValuePercentage;
            }
        }

        #endregion

        #region - Total Cost Index -

        //public decimal TotalCostIndexValuePercentageWithNumberOfSales
        //{
        //    get
        //    {
        //        return Organization.SalesPricePercentage * NumberOfSales;
        //    }
        //}

        //public decimal TotalCostIndexValuePercentageWithNumberOfSalesPercentage
        //{
        //    get
        //    {
        //        return UserResourcePool.TotalCostIndexValuePercentageWithNumberOfSales == 0
        //            ? 0
        //            : TotalCostIndexValuePercentageWithNumberOfSales / UserResourcePool.TotalCostIndexValuePercentageWithNumberOfSales;
        //    }
        //}

        public decimal TotalCostIndexValueMultiplied
        {
            get { return Organization.SalesPricePercentage * NumberOfSalesPercentage; }
        }

        public decimal TotalCostIndexValuePercentage
        {
            get
            {
                return UserResourcePool.TotalCostIndexValueMultiplied == 0
                    ? 0
                    : TotalCostIndexValueMultiplied / UserResourcePool.TotalCostIndexValueMultiplied;
            }
        }

        public decimal TotalCostIndexIncome
        {
            get
            {
                //return UserResourcePool.TotalCostIndexShare * TotalCostIndexValuePercentageWithNumberOfSalesPercentage;
                return UserResourcePool.TotalCostIndexShare * TotalCostIndexValuePercentage;
            }
        }

        #endregion

        //#region - Quality Index -

        //public decimal QualityIndexValueWeightedAverageWithNumberOfSales
        //{
        //    get
        //    {
        //        return Organization.QualityRatingWeightedAverage * NumberOfSales;
        //    }
        //}

        //public decimal QualityIndexValueWeightedAverageWithNumberOfSalesWeightedAverage
        //{
        //    get
        //    {
        //        return UserResourcePool.QualityIndexValueWeightedAverageWithNumberOfSales == 0
        //            ? 0
        //            : QualityIndexValueWeightedAverageWithNumberOfSales / UserResourcePool.QualityIndexValueWeightedAverageWithNumberOfSales;
        //    }
        //}

        //public decimal QualityIndexIncome
        //{
        //    get
        //    {
        //        return UserResourcePool.QualityIndexShare * QualityIndexValueWeightedAverageWithNumberOfSalesWeightedAverage;
        //    }
        //}

        //#endregion

        //#region - Employee Satisfaction Index -

        //public decimal EmployeeSatisfactionIndexValueWeightedAverageWithNumberOfSales
        //{
        //    get
        //    {
        //        return Organization.EmployeeSatisfactionRatingWeightedAverage * NumberOfSales;
        //    }
        //}

        //public decimal EmployeeSatisfactionIndexValueWeightedAverageWithNumberOfSalesWeightedAverage
        //{
        //    get
        //    {
        //        return UserResourcePool.EmployeeSatisfactionIndexValueWeightedAverageWithNumberOfSales == 0
        //            ? 0
        //            : EmployeeSatisfactionIndexValueWeightedAverageWithNumberOfSales / UserResourcePool.EmployeeSatisfactionIndexValueWeightedAverageWithNumberOfSales;
        //    }
        //}

        //public decimal EmployeeSatisfactionIndexIncome
        //{
        //    get
        //    {
        //        return UserResourcePool.EmployeeSatisfactionIndexShare * EmployeeSatisfactionIndexValueWeightedAverageWithNumberOfSalesWeightedAverage;
        //    }
        //}

        //#endregion

        //#region - Customer Satisfaction Index -

        //public decimal CustomerSatisfactionIndexValueWeightedAverageWithNumberOfSales
        //{
        //    get
        //    {
        //        return Organization.CustomerSatisfactionRatingWeightedAverage * NumberOfSales;
        //    }
        //}

        //public decimal CustomerSatisfactionIndexValueWeightedAverageWithNumberOfSalesWeightedAverage
        //{
        //    get
        //    {
        //        return UserResourcePool.CustomerSatisfactionIndexValueWeightedAverageWithNumberOfSales == 0
        //            ? 0
        //            : CustomerSatisfactionIndexValueWeightedAverageWithNumberOfSales / UserResourcePool.CustomerSatisfactionIndexValueWeightedAverageWithNumberOfSales;
        //    }
        //}

        //public decimal CustomerSatisfactionIndexIncome
        //{
        //    get
        //    {
        //        return UserResourcePool.CustomerSatisfactionIndexShare * CustomerSatisfactionIndexValueWeightedAverageWithNumberOfSalesWeightedAverage;
        //    }
        //}

        //#endregion

        /// <summary>
        /// Dynamic index income
        /// </summary>
        public decimal IndexIncome
        {
            get { return UserResourcePoolIndexOrganizationSet.Sum(item => item.IndexIncome); }
        }

        public decimal TotalResourcePoolIncome
        {
            get
            {
                return SectorIndexIncome
                    + KnowledgeIndexIncome
                    + TotalCostIndexIncome
                    //+ QualityIndexIncome
                    //+ EmployeeSatisfactionIndexIncome
                    //+ CustomerSatisfactionIndexIncome
                    + IndexIncome;
            }
        }

        public decimal TotalIncome
        {
            get { return TotalProfit + TotalResourcePoolIncome; }
        }

    }
}
