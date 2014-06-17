namespace BusinessObjects
{
    using BusinessObjects.Attributes;
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

        [Display(Name = "Quality Rating")]
        public decimal QualityRating { get; set; }

        [Display(Name = "Customer Satisfaction Rating")]
        public decimal CustomerSatisfactionRating { get; set; }

        [Display(Name = "Employee Satisfaction Rating")]
        public decimal EmployeeSatisfactionRating { get; set; }
        
        public virtual Organization Organization { get; set; }

        public virtual User User { get; set; }

        /* */

        // A bit weird navigation property.
        // To prevent this (or ideally), there needs to be a foreign key between this class and UserOrganization (UserResourcePoolId on UserOrganization).
        public UserResourcePool UserResourcePool
        {
            get { return User.UserResourcePoolSet.Single(item => item.ResourcePool == Organization.Sector.ResourcePool); }
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

        #region - Total Cost Index -

        public decimal TotalCostIndexPercentageWithSalesPrice
        {
            get
            {
                return UserResourcePool.ResourcePool.SalesPrice == 0
                    ? 0
                    : 1 - (Organization.SalesPrice / UserResourcePool.ResourcePool.SalesPrice);
            }
        }

        /// <summary>
        /// Old formula for Total Cost Index calculation, based on Profit
        /// Keep it for a while as a sample (maybe both Profit and Sales Price could be used)
        /// </summary>
        public decimal TotalCostIndexPercentageWithProfit
        {
            get
            {
                return UserResourcePool.ResourcePool.Profit == 0
                    ? 0
                    : 1 - (Organization.Profit / UserResourcePool.ResourcePool.Profit);
            }
        }

        public decimal TotalCostIndexPercentageWithNumberOfSales
        {
            get
            {
                return TotalCostIndexPercentageWithSalesPrice * NumberOfSales;
            }
        }

        public decimal TotalCostIndexPercentageWithNumberOfSalesWeighted
        {
            get
            {
                return UserResourcePool.TotalCostIndexPercentageWithNumberOfSales == 0
                    ? 0
                    : TotalCostIndexPercentageWithNumberOfSales / UserResourcePool.TotalCostIndexPercentageWithNumberOfSales;
            }
        }

        public decimal TotalCostIndexIncome
        {
            get
            {
                return UserResourcePool.TotalCostIndexShare * TotalCostIndexPercentageWithNumberOfSalesWeighted;
            }
        }

        #endregion

        #region - Knowledge Index -

        public decimal KnowledgeIndexPercentage
        {
            get
            {
                return UserResourcePool.ResourcePool.LicenseRatingAverage == 0
                    ? 0
                    : Organization.License.GetAverageRating() / UserResourcePool.ResourcePool.LicenseRatingAverage;
            }
        }

        public decimal KnowledgeIndexPercentageWithNumberOfSales
        {
            get
            {
                return KnowledgeIndexPercentage * NumberOfSales;
            }
        }

        public decimal KnowledgeIndexPercentageWithNumberOfSalesWeighted
        {
            get
            {
                return UserResourcePool.KnowledgeIndexPercentageWithNumberOfSales == 0
                    ? 0
                    : KnowledgeIndexPercentageWithNumberOfSales / UserResourcePool.KnowledgeIndexPercentageWithNumberOfSales;
            }
        }

        public decimal KnowledgeIndexIncome
        {
            get
            {
                return UserResourcePool.KnowledgeIndexShare * KnowledgeIndexPercentageWithNumberOfSalesWeighted;
            }
        }

        #endregion

        #region - Quality Index -

        public decimal QualityIndexPercentage
        {
            get
            {
                return UserResourcePool.ResourcePool.QualityRatingAverage == 0
                    ? 0
                    : Organization.GetAverageQualityRating() / UserResourcePool.ResourcePool.QualityRatingAverage;
            }
        }

        public decimal QualityIndexPercentageWithNumberOfSales
        {
            get
            {
                return QualityIndexPercentage * NumberOfSales;
            }
        }

        public decimal QualityIndexPercentageWithNumberOfSalesWeighted
        {
            get
            {
                return UserResourcePool.QualityIndexPercentageWithNumberOfSales == 0
                    ? 0
                    : QualityIndexPercentageWithNumberOfSales / UserResourcePool.QualityIndexPercentageWithNumberOfSales;
            }
        }

        public decimal QualityIndexIncome
        {
            get
            {
                return UserResourcePool.QualityIndexShare * QualityIndexPercentageWithNumberOfSalesWeighted;
            }
        }

        #endregion

        #region - Sector Index -

        public decimal SectorIndexPercentage
        {
            get
            {
                return UserResourcePool.ResourcePool.SectorRatingAverage == 0
                    ? 0
                    : Organization.Sector.GetAverageRating() / UserResourcePool.ResourcePool.SectorRatingAverage;
            }
        }

        public decimal SectorIndexPercentageWithNumberOfSales
        {
            get
            {
                return SectorIndexPercentage * NumberOfSales;
            }
        }

        public decimal SectorIndexPercentageWithNumberOfSalesWeighted
        {
            get
            {
                return UserResourcePool.SectorIndexPercentageWithNumberOfSales == 0
                    ? 0
                    : SectorIndexPercentageWithNumberOfSales / UserResourcePool.SectorIndexPercentageWithNumberOfSales;
            }
        }

        public decimal SectorIndexIncome
        {
            get
            {
                return UserResourcePool.SectorIndexShare * SectorIndexPercentageWithNumberOfSalesWeighted;
            }
        }

        #endregion

        #region - Employee Satisfaction Index -

        public decimal EmployeeSatisfactionIndexPercentage
        {
            get
            {
                return UserResourcePool.ResourcePool.EmployeeSatisfactionRatingAverage == 0
                    ? 0
                    : Organization.GetAverageEmployeeSatisfactionRating() / UserResourcePool.ResourcePool.EmployeeSatisfactionRatingAverage;
            }
        }

        public decimal EmployeeSatisfactionIndexPercentageWithNumberOfSales
        {
            get
            {
                return EmployeeSatisfactionIndexPercentage * NumberOfSales;
            }
        }

        public decimal EmployeeSatisfactionIndexPercentageWithNumberOfSalesWeighted
        {
            get
            {
                return UserResourcePool.EmployeeSatisfactionIndexPercentageWithNumberOfSales == 0
                    ? 0
                    : EmployeeSatisfactionIndexPercentageWithNumberOfSales / UserResourcePool.EmployeeSatisfactionIndexPercentageWithNumberOfSales;
            }
        }

        public decimal EmployeeSatisfactionIndexIncome
        {
            get
            {
                return UserResourcePool.EmployeeSatisfactionIndexShare * EmployeeSatisfactionIndexPercentageWithNumberOfSalesWeighted;
            }
        }

        #endregion

        #region - Customer Satisfaction Index -

        public decimal CustomerSatisfactionIndexPercentage
        {
            get
            {
                return UserResourcePool.ResourcePool.CustomerSatisfactionRatingAverage == 0
                    ? 0
                    : Organization.GetAverageCustomerSatisfactionRating() / UserResourcePool.ResourcePool.CustomerSatisfactionRatingAverage;
            }
        }

        public decimal CustomerSatisfactionIndexPercentageWithNumberOfSales
        {
            get
            {
                return CustomerSatisfactionIndexPercentage * NumberOfSales;
            }
        }

        public decimal CustomerSatisfactionIndexPercentageWithNumberOfSalesWeighted
        {
            get
            {
                return UserResourcePool.CustomerSatisfactionIndexPercentageWithNumberOfSales == 0
                    ? 0
                    : CustomerSatisfactionIndexPercentageWithNumberOfSales / UserResourcePool.CustomerSatisfactionIndexPercentageWithNumberOfSales;
            }
        }

        public decimal CustomerSatisfactionIndexIncome
        {
            get
            {
                return UserResourcePool.CustomerSatisfactionIndexShare * CustomerSatisfactionIndexPercentageWithNumberOfSalesWeighted;
            }
        }

        #endregion

        #region - Distance Index -

        /// <summary>
        /// TODO Distance Index has no calculation at the moment
        /// </summary>
        public decimal DistanceRating
        {
            get { return 1; }
        }

        public decimal DistanceIndexPercentage
        {
            get
            {
                return UserResourcePool.DistanceRating == 0
                    ? 0
                    : DistanceRating / UserResourcePool.DistanceRating;
            }
        }

        public decimal DistanceIndexPercentageWithNumberOfSales
        {
            get
            {
                return DistanceIndexPercentage * NumberOfSales;
            }
        }

        public decimal DistanceIndexPercentageWithNumberOfSalesWeighted
        {
            get
            {
                return UserResourcePool.DistanceIndexPercentageWithNumberOfSales == 0
                    ? 0
                    : DistanceIndexPercentageWithNumberOfSales / UserResourcePool.DistanceIndexPercentageWithNumberOfSales;
            }
        }

        public decimal DistanceIndexIncome
        {
            get
            {
                return UserResourcePool.DistanceIndexShare * DistanceIndexPercentageWithNumberOfSalesWeighted;
            }
        }

        #endregion

        public decimal TotalResourcePoolIncome
        {
            get
            {
                return TotalCostIndexIncome
                    + KnowledgeIndexIncome
                    + QualityIndexIncome
                    + SectorIndexIncome
                    + EmployeeSatisfactionIndexIncome
                    + CustomerSatisfactionIndexIncome
                    + DistanceIndexIncome;
            }
        }

        public decimal TotalIncome
        {
            get { return TotalProfit + TotalResourcePoolIncome; }
        }

    }
}
