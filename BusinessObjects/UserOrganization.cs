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

        public decimal SectorIndexValueWeightedAverageWithNumberOfSales
        {
            get
            {
                return Organization.Sector.RatingWeightedAverage * NumberOfSales;
            }
        }

        public decimal SectorIndexValueWeightedAverageWithNumberOfSalesWeightedAverage
        {
            get
            {
                return UserResourcePool.SectorIndexValueWeightedAverageWithNumberOfSales == 0
                    ? 0
                    : SectorIndexValueWeightedAverageWithNumberOfSales / UserResourcePool.SectorIndexValueWeightedAverageWithNumberOfSales;
            }
        }

        public decimal SectorIndexIncome
        {
            get
            {
                return UserResourcePool.SectorIndexShare * SectorIndexValueWeightedAverageWithNumberOfSalesWeightedAverage;
            }
        }

        #endregion

        #region - Knowledge Index -

        public decimal KnowledgeIndexValueWeightedAverageWithNumberOfSales
        {
            get
            {
                return Organization.License.RatingWeightedAverage * NumberOfSales;
            }
        }

        public decimal KnowledgeIndexValueWeightedAverageWithNumberOfSalesWeightedAverage
        {
            get
            {
                return UserResourcePool.KnowledgeIndexValueWeightedAverageWithNumberOfSales == 0
                    ? 0
                    : KnowledgeIndexValueWeightedAverageWithNumberOfSales / UserResourcePool.KnowledgeIndexValueWeightedAverageWithNumberOfSales;
            }
        }

        public decimal KnowledgeIndexIncome
        {
            get
            {
                return UserResourcePool.KnowledgeIndexShare * KnowledgeIndexValueWeightedAverageWithNumberOfSalesWeightedAverage;
            }
        }

        #endregion

        #region - Total Cost Index -

        public decimal TotalCostIndexValueWeightedAverageWithNumberOfSales
        {
            get
            {
                return Organization.SalesPriceWeightedAverage * NumberOfSales;
            }
        }

        public decimal TotalCostIndexValueWeightedAverageWithNumberOfSalesWeightedAverage
        {
            get
            {
                return UserResourcePool.TotalCostIndexValueWeightedAverageWithNumberOfSales == 0
                    ? 0
                    : TotalCostIndexValueWeightedAverageWithNumberOfSales / UserResourcePool.TotalCostIndexValueWeightedAverageWithNumberOfSales;
            }
        }

        public decimal TotalCostIndexIncome
        {
            get
            {
                return UserResourcePool.TotalCostIndexShare * TotalCostIndexValueWeightedAverageWithNumberOfSalesWeightedAverage;
            }
        }

        #endregion

        #region - Quality Index -

        public decimal QualityIndexValueWeightedAverageWithNumberOfSales
        {
            get
            {
                return Organization.QualityRatingWeightedAverage * NumberOfSales;
            }
        }

        public decimal QualityIndexValueWeightedAverageWithNumberOfSalesWeightedAverage
        {
            get
            {
                return UserResourcePool.QualityIndexValueWeightedAverageWithNumberOfSales == 0
                    ? 0
                    : QualityIndexValueWeightedAverageWithNumberOfSales / UserResourcePool.QualityIndexValueWeightedAverageWithNumberOfSales;
            }
        }

        public decimal QualityIndexIncome
        {
            get
            {
                return UserResourcePool.QualityIndexShare * QualityIndexValueWeightedAverageWithNumberOfSalesWeightedAverage;
            }
        }

        #endregion

        #region - Employee Satisfaction Index -

        public decimal EmployeeSatisfactionIndexValueWeightedAverageWithNumberOfSales
        {
            get
            {
                return Organization.EmployeeSatisfactionRatingWeightedAverage * NumberOfSales;
            }
        }

        public decimal EmployeeSatisfactionIndexValueWeightedAverageWithNumberOfSalesWeightedAverage
        {
            get
            {
                return UserResourcePool.EmployeeSatisfactionIndexValueWeightedAverageWithNumberOfSales == 0
                    ? 0
                    : EmployeeSatisfactionIndexValueWeightedAverageWithNumberOfSales / UserResourcePool.EmployeeSatisfactionIndexValueWeightedAverageWithNumberOfSales;
            }
        }

        public decimal EmployeeSatisfactionIndexIncome
        {
            get
            {
                return UserResourcePool.EmployeeSatisfactionIndexShare * EmployeeSatisfactionIndexValueWeightedAverageWithNumberOfSalesWeightedAverage;
            }
        }

        #endregion

        #region - Customer Satisfaction Index -

        public decimal CustomerSatisfactionIndexValueWeightedAverageWithNumberOfSales
        {
            get
            {
                return Organization.CustomerSatisfactionRatingWeightedAverage * NumberOfSales;
            }
        }

        public decimal CustomerSatisfactionIndexValueWeightedAverageWithNumberOfSalesWeightedAverage
        {
            get
            {
                return UserResourcePool.CustomerSatisfactionIndexValueWeightedAverageWithNumberOfSales == 0
                    ? 0
                    : CustomerSatisfactionIndexValueWeightedAverageWithNumberOfSales / UserResourcePool.CustomerSatisfactionIndexValueWeightedAverageWithNumberOfSales;
            }
        }

        public decimal CustomerSatisfactionIndexIncome
        {
            get
            {
                return UserResourcePool.CustomerSatisfactionIndexShare * CustomerSatisfactionIndexValueWeightedAverageWithNumberOfSalesWeightedAverage;
            }
        }

        #endregion

        public decimal IndexIncome
        {
            get { return UserResourcePoolIndexOrganizationSet.Sum(item => item.IndexIncome); }
        }

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
                    + IndexIncome;
            }
        }

        public decimal TotalIncome
        {
            get { return TotalProfit + TotalResourcePoolIncome; }
        }

    }
}
