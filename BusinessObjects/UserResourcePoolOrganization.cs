namespace BusinessObjects
{
    using System.Linq;
    using System.ComponentModel.DataAnnotations;

    public partial class UserResourcePoolOrganization
    {
        public UserResourcePool UserResourcePool
        {
            get { return User.UserResourcePoolSet.Single(item => item.ResourcePool == ResourcePoolOrganization.ResourcePool); }
        }

        public Organization Organization
        {
            get { return ResourcePoolOrganization.Organization; }
        }

        [Display(Name = "CMRP Tax")]
        public decimal ResourcePoolTax
        {
            get
            {
                return Organization.SalesPrice * UserResourcePool.ResourcePoolRatePercentage;
            }
        }

        [Display(Name = "Sales Price incl. CMRP Tax")]
        public decimal SalesPriceIncludingResourcePoolTax
        {
            get { return Organization.SalesPrice + ResourcePoolTax; }
        }

        [Display(Name = "Total Production Cost")]
        public decimal TotalProductionCost
        {
            get
            {
                return Organization.ProductionCost * NumberOfSales;
            }
        }

        [Display(Name = "Total Sales Revenue")]
        public decimal TotalSalesRevenue
        {
            get
            {
                return Organization.SalesPrice * NumberOfSales;
            }
        }

        [Display(Name = "Total Profit")] // a.k.a TotalSalesIncome?
        public decimal TotalProfit
        {
            get
            {
                return Organization.Profit * NumberOfSales;
            }
        }

        [Display(Name = "Total CMRP Tax")]
        public decimal TotalResourcePoolTax
        {
            get
            {
                return ResourcePoolTax * NumberOfSales;
            }
        }

        [Display(Name = "Total Sales Revenue incl. CMRP Tax")]
        public decimal TotalSalesRevenueIncludingResourcePoolTax
        {
            get
            {
                return SalesPriceIncludingResourcePoolTax * NumberOfSales;
            }
        }

        #region - Total Cost Index -

        [Display(Name = "Total Cost Index Percentage")]
        public decimal TotalCostIndexPercentage
        {
            get
            {
                if (UserResourcePool.ResourcePool.SalesPrice == 0)
                    return 0;

                return 1 - (Organization.SalesPrice / UserResourcePool.ResourcePool.SalesPrice);
            }
        }

        [Display(Name = "Total Cost Index with Nr of Sales")]
        public decimal TotalCostIndexPercentageWithNumberOfSales
        {
            get
            {
                return TotalCostIndexPercentage * NumberOfSales;
            }
        }

        [Display(Name = "Total Cost Index with Nr of Sales Weighted")]
        public decimal TotalCostIndexPercentageWithNumberOfSalesWeighted
        {
            get
            {
                if (UserResourcePool.TotalCostIndexPercentageWithNumberOfSales == 0)
                    return 0;

                return TotalCostIndexPercentageWithNumberOfSales / UserResourcePool.TotalCostIndexPercentageWithNumberOfSales;
            }
        }

        [Display(Name = "Total Cost Index Income")]
        public decimal TotalCostIndexIncome
        {
            get
            {
                return UserResourcePool.TotalCostIndexShare * TotalCostIndexPercentageWithNumberOfSalesWeighted;
            }
        }

        #endregion

        #region - Knowledge Index -

        [Display(Name = "Knowledge Index Percentage")]
        public decimal KnowledgeIndexPercentage
        {
            get
            {
                if (UserResourcePool.LicenseUserRating == 0)
                    return 0;

                var rating = UserResourcePool.UserResourcePoolType == UserResourcePoolType.Public
                    ? Organization.License.GetAverageUserRating()
                    : Organization.License.GetAverageUserRating(UserResourcePool.User.Id);

                return rating / UserResourcePool.LicenseUserRating;
            }
        }

        [Display(Name = "Knowledge Index with Nr of Sales")]
        public decimal KnowledgeIndexPercentageWithNumberOfSales
        {
            get
            {
                return KnowledgeIndexPercentage * NumberOfSales;
            }
        }

        [Display(Name = "Knowledge Index with Nr of Sales Weighted")]
        public decimal KnowledgeIndexPercentageWithNumberOfSalesWeighted
        {
            get
            {
                if (UserResourcePool.KnowledgeIndexPercentageWithNumberOfSales == 0)
                    return 0;

                return KnowledgeIndexPercentageWithNumberOfSales / UserResourcePool.KnowledgeIndexPercentageWithNumberOfSales;
            }
        }

        [Display(Name = "Knowledge Index Income")]
        public decimal KnowledgeIndexIncome
        {
            get
            {
                return UserResourcePool.KnowledgeIndexShare * KnowledgeIndexPercentageWithNumberOfSalesWeighted;
            }
        }

        #endregion

        #region - Quality Index -

        public decimal GetAverageQualityUserRating()
        {
            return GetAverageQualityUserRating(0);
        }

        public decimal GetAverageQualityUserRating(int userId)
        {
            var ratings = userId > 0
                ? UserResourcePool.UserResourcePoolOrganizationSet.Where(rating => rating.UserId == userId)
                : UserResourcePool.UserResourcePoolOrganizationSet;

            if (!ratings.Any())
                return 0;

            return ratings.Average(rating => rating.QualityRating);
        }

        [Display(Name = "Quality Index Percentage")]
        public decimal QualityIndexPercentage
        {
            get
            {
                if (UserResourcePool.QualityUserRating == 0)
                    return 0;

                var rating = UserResourcePool.UserResourcePoolType == UserResourcePoolType.Public
                    ? GetAverageQualityUserRating()
                    : GetAverageQualityUserRating(UserResourcePool.User.Id);

                return rating / UserResourcePool.QualityUserRating;
            }
        }

        [Display(Name = "Quality Index with Nr of Sales")]
        public decimal QualityIndexPercentageWithNumberOfSales
        {
            get
            {
                return QualityIndexPercentage * NumberOfSales;
            }
        }

        [Display(Name = "Quality Index with Nr of Sales Weighted")]
        public decimal QualityIndexPercentageWithNumberOfSalesWeighted
        {
            get
            {
                if (UserResourcePool.QualityIndexPercentageWithNumberOfSales == 0)
                    return 0;

                return QualityIndexPercentageWithNumberOfSales / UserResourcePool.QualityIndexPercentageWithNumberOfSales;
            }
        }

        [Display(Name = "Quality Index Income")]
        public decimal QualityIndexIncome
        {
            get
            {
                return UserResourcePool.QualityIndexShare * QualityIndexPercentageWithNumberOfSalesWeighted;
            }
        }

        #endregion

        #region - Sector Index -

        [Display(Name = "Sector Index Percentage")]
        public decimal SectorIndexPercentage
        {
            get
            {
                if (UserResourcePool.SectorUserRating == 0)
                    return 0;

                var rating = UserResourcePool.UserResourcePoolType == UserResourcePoolType.Public
                    ? Organization.Sector.GetAverageUserRating()
                    : Organization.Sector.GetAverageUserRating(UserResourcePool.User.Id);

                return rating / UserResourcePool.SectorUserRating;
            }
        }

        [Display(Name = "Sector Index with Nr of Sales")]
        public decimal SectorIndexPercentageWithNumberOfSales
        {
            get
            {
                return SectorIndexPercentage * NumberOfSales;
            }
        }

        [Display(Name = "Sector Index with Nr of Sales Weighted")]
        public decimal SectorIndexPercentageWithNumberOfSalesWeighted
        {
            get
            {
                if (UserResourcePool.SectorIndexPercentageWithNumberOfSales == 0)
                    return 0;

                return SectorIndexPercentageWithNumberOfSales / UserResourcePool.SectorIndexPercentageWithNumberOfSales;
            }
        }

        [Display(Name = "Sector Index Income")]
        public decimal SectorIndexIncome
        {
            get
            {
                return UserResourcePool.SectorIndexShare * SectorIndexPercentageWithNumberOfSalesWeighted;
            }
        }

        #endregion

        #region - Employee Satisfaction Index -

        public decimal GetAverageEmployeeSatisfactionUserRating()
        {
            return GetAverageEmployeeSatisfactionUserRating(0);
        }

        public decimal GetAverageEmployeeSatisfactionUserRating(int userId)
        {
            var ratings = userId > 0
                ? UserResourcePool.UserResourcePoolOrganizationSet.Where(rating => rating.UserId == userId)
                : UserResourcePool.UserResourcePoolOrganizationSet;

            if (!ratings.Any())
                return 0;

            return ratings.Average(rating => rating.EmployeeSatisfactionRating);
        }

        [Display(Name = "Employee Satisfaction Index Percentage")]
        public decimal EmployeeSatisfactionIndexPercentage
        {
            get
            {
                // TODO ?
                if (UserResourcePool == null)
                    return 0;

                if (UserResourcePool.EmployeeSatisfactionUserRating == 0)
                    return 0;

                var rating = UserResourcePool.UserResourcePoolType == UserResourcePoolType.Public
                    ? GetAverageEmployeeSatisfactionUserRating()
                    : GetAverageEmployeeSatisfactionUserRating(UserResourcePool.User.Id);

                return rating / UserResourcePool.EmployeeSatisfactionUserRating;
            }
        }

        [Display(Name = "Employee Satisfaction Index with Nr of Sales")]
        public decimal EmployeeSatisfactionIndexPercentageWithNumberOfSales
        {
            get
            {
                return EmployeeSatisfactionIndexPercentage * NumberOfSales;
            }
        }

        [Display(Name = "Employee Satisfaction Index with Nr of Sales Weighted")]
        public decimal EmployeeSatisfactionIndexPercentageWithNumberOfSalesWeighted
        {
            get
            {
                if (UserResourcePool.EmployeeSatisfactionIndexPercentageWithNumberOfSales == 0)
                    return 0;

                return EmployeeSatisfactionIndexPercentageWithNumberOfSales / UserResourcePool.EmployeeSatisfactionIndexPercentageWithNumberOfSales;
            }
        }

        [Display(Name = "Employee Satisfaction Index Income")]
        public decimal EmployeeSatisfactionIndexIncome
        {
            get
            {
                return UserResourcePool.EmployeeSatisfactionIndexShare * EmployeeSatisfactionIndexPercentageWithNumberOfSalesWeighted;
            }
        }

        #endregion

        #region - Customer Satisfaction Index -

        public decimal GetAverageCustomerSatisfactionUserRating()
        {
            return GetAverageCustomerSatisfactionUserRating(0);
        }

        public decimal GetAverageCustomerSatisfactionUserRating(int userId)
        {
            var ratings = userId > 0
                ? UserResourcePool.UserResourcePoolOrganizationSet.Where(rating => rating.UserId == userId)
                : UserResourcePool.UserResourcePoolOrganizationSet;

            if (!ratings.Any())
                return 0;

            return ratings.Average(rating => rating.CustomerSatisfactionRating);
        }

        [Display(Name = "Customer Satisfaction Index Percentage")]
        public decimal CustomerSatisfactionIndexPercentage
        {
            get
            {
                if (UserResourcePool.CustomerSatisfactionUserRating == 0)
                    return 0;

                var rating = UserResourcePool.UserResourcePoolType == UserResourcePoolType.Public
                    ? GetAverageCustomerSatisfactionUserRating()
                    : GetAverageCustomerSatisfactionUserRating(UserResourcePool.User.Id);

                return rating / UserResourcePool.CustomerSatisfactionUserRating;
            }
        }

        [Display(Name = "Customer Satisfaction Index with Nr of Sales")]
        public decimal CustomerSatisfactionIndexPercentageWithNumberOfSales
        {
            get
            {
                return CustomerSatisfactionIndexPercentage * NumberOfSales;
            }
        }

        [Display(Name = "Customer Satisfaction Index with Nr of Sales Weighted")]
        public decimal CustomerSatisfactionIndexPercentageWithNumberOfSalesWeighted
        {
            get
            {
                if (UserResourcePool.CustomerSatisfactionIndexPercentageWithNumberOfSales == 0)
                    return 0;

                return CustomerSatisfactionIndexPercentageWithNumberOfSales / UserResourcePool.CustomerSatisfactionIndexPercentageWithNumberOfSales;
            }
        }

        [Display(Name = "Customer Satisfaction Index Income")]
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

        [Display(Name = "Distance Index Percentage")]
        public decimal DistanceIndexPercentage
        {
            get
            {
                // TODO ?
                if (UserResourcePool == null)
                    return 0;

                if (UserResourcePool.DistanceRating == 0)
                    return 0;

                return DistanceRating / UserResourcePool.DistanceRating;
            }
        }

        [Display(Name = "Distance Index with Nr of Sales")]
        public decimal DistanceIndexPercentageWithNumberOfSales
        {
            get
            {
                return DistanceIndexPercentage * NumberOfSales;
            }
        }

        [Display(Name = "Distance Index with Nr of Sales Weighted")]
        public decimal DistanceIndexPercentageWithNumberOfSalesWeighted
        {
            get
            {
                if (UserResourcePool.DistanceIndexPercentageWithNumberOfSales == 0)
                    return 0;

                return DistanceIndexPercentageWithNumberOfSales / UserResourcePool.DistanceIndexPercentageWithNumberOfSales;
            }
        }

        [Display(Name = "Distance Index Income")]
        public decimal DistanceIndexIncome
        {
            get
            {
                return UserResourcePool.DistanceIndexShare * DistanceIndexPercentageWithNumberOfSalesWeighted;
            }
        }

        #endregion

        [Display(Name = "Total CMRP Income")]
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

        [Display(Name = "Total Income (Profit + CMRP)")]
        public decimal TotalIncome
        {
            get { return TotalProfit + TotalResourcePoolIncome; }
        }
    }
}
