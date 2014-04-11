namespace BusinessObjects
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;

    public partial class UserResourcePool
    {
        UserResourcePoolType userResourcePoolType = UserResourcePoolType.Private;

        public UserResourcePoolType UserResourcePoolType
        {
            get { return userResourcePoolType; }
            set { userResourcePoolType = value; }
        }

        public IEnumerable<Organization> OrganizationSet
        {
            get
            {
                if (ResourcePool == null)
                    return null;

                if (ResourcePool.ResourcePoolOrganizationSet == null || !ResourcePool.ResourcePoolOrganizationSet.Any())
                    return null;

                return ResourcePool.ResourcePoolOrganizationSet.Select(item => item.Organization);
            }

            private set { }
        }

        public IEnumerable<UserResourcePoolOrganization> UserResourcePoolOrganizationSet
        {
            get { return User.UserResourcePoolOrganizationSet.Where(item => item.ResourcePoolOrganization.ResourcePool == ResourcePool); }
        }

        public IEnumerable<UserResourcePoolOrganizationDto2> UserResourcePoolOrganizationDto2Set
        {
            get
            {
                return UserResourcePoolOrganizationSet.Select(item => new UserResourcePoolOrganizationDto2()
                    {
                        OrganizationName = item.Organization.Name,
                        OrganizationProductionCost = item.Organization.ProductionCost,
                        OrganizationSalesPrice = item.Organization.SalesPrice,
                        OrganizationProfitPercentage = item.Organization.ProfitPercentage,

                        ResourcePoolTax = item.ResourcePoolTax,
                        SalesPriceIncludingResourcePoolTax = item.SalesPriceIncludingResourcePoolTax,
                        TotalProductionCost = item.TotalProductionCost,
                        TotalSalesRevenue = item.TotalSalesRevenue,
                        TotalProfit = item.TotalProfit,
                        TotalResourcePoolTax = item.TotalResourcePoolTax,
                        TotalSalesRevenueIncludingResourcePoolTax = item.TotalSalesRevenueIncludingResourcePoolTax,
                        TotalCostIndexPercentage = item.TotalCostIndexPercentage,
                        TotalCostIndexPercentageWithNumberOfSales = item.TotalCostIndexPercentageWithNumberOfSales,
                        TotalCostIndexPercentageWithNumberOfSalesWeighted = item.TotalCostIndexPercentageWithNumberOfSalesWeighted,
                        TotalCostIndexIncome = item.TotalCostIndexIncome,
                        KnowledgeIndexPercentage = item.KnowledgeIndexPercentage,
                        KnowledgeIndexPercentageWithNumberOfSales = item.KnowledgeIndexPercentageWithNumberOfSales,
                        KnowledgeIndexPercentageWithNumberOfSalesWeighted = item.KnowledgeIndexPercentageWithNumberOfSalesWeighted,
                        KnowledgeIndexIncome = item.KnowledgeIndexIncome,
                        QualityIndexPercentage = item.QualityIndexPercentage,
                        QualityIndexPercentageWithNumberOfSales = item.QualityIndexPercentageWithNumberOfSales,
                        QualityIndexPercentageWithNumberOfSalesWeighted = item.QualityIndexPercentageWithNumberOfSalesWeighted,
                        QualityIndexIncome = item.QualityIndexIncome,
                        SectorIndexPercentage = item.SectorIndexPercentage,
                        SectorIndexPercentageWithNumberOfSales = item.SectorIndexPercentageWithNumberOfSales,
                        SectorIndexPercentageWithNumberOfSalesWeighted = item.SectorIndexPercentageWithNumberOfSalesWeighted,
                        SectorIndexIncome = item.SectorIndexIncome,
                        EmployeeSatisfactionIndexPercentage = item.EmployeeSatisfactionIndexPercentage,
                        EmployeeSatisfactionIndexPercentageWithNumberOfSales = item.EmployeeSatisfactionIndexPercentageWithNumberOfSales,
                        EmployeeSatisfactionIndexPercentageWithNumberOfSalesWeighted = item.EmployeeSatisfactionIndexPercentageWithNumberOfSalesWeighted,
                        EmployeeSatisfactionIndexIncome = item.EmployeeSatisfactionIndexIncome,
                        CustomerSatisfactionIndexPercentage = item.CustomerSatisfactionIndexPercentage,
                        CustomerSatisfactionIndexPercentageWithNumberOfSales = item.CustomerSatisfactionIndexPercentageWithNumberOfSales,
                        CustomerSatisfactionIndexPercentageWithNumberOfSalesWeighted = item.CustomerSatisfactionIndexPercentageWithNumberOfSalesWeighted,
                        CustomerSatisfactionIndexIncome = item.CustomerSatisfactionIndexIncome,
                        DistanceRating = item.DistanceRating,
                        DistanceIndexPercentage = item.DistanceIndexPercentage,
                        DistanceIndexPercentageWithNumberOfSales = item.DistanceIndexPercentageWithNumberOfSales,
                        DistanceIndexPercentageWithNumberOfSalesWeighted = item.DistanceIndexPercentageWithNumberOfSalesWeighted,
                        DistanceIndexIncome = item.DistanceIndexIncome,
                        TotalResourcePoolIncome = item.TotalResourcePoolIncome,
                        TotalIncome = item.TotalIncome
                    });
            }
            private set { }
        }

        public IEnumerable<License> LicenseSet { get { return OrganizationSet.Select(organization => organization.License); } }

        public IEnumerable<Sector> SectorSet { get { return OrganizationSet.Select(organization => organization.Sector); } }

        public IEnumerable<UserResourcePool> UserResourcePoolRatingSet
        {
            get
            {
                return UserResourcePoolType == UserResourcePoolType.Public
                    ? ResourcePool.UserResourcePoolSet
                    : ResourcePool.UserResourcePoolSet.Where(item => item.User == User);
            }
        }

        public int UserResourcePoolRatingCount
        {
            get { return UserResourcePoolRatingSet.Count(); }
            private set { }
        }

        public decimal ResourcePoolRatePercentage
        {
            get { return ResourcePoolRate / 100; }
            private set { }
        }

        #region - Ratings -

        [Display(Name = "Total Cost Index Average")]
        public decimal TotalCostIndexRatingAverage
        {
            get { return UserResourcePoolRatingSet.Average(rating => rating.TotalCostIndexRating); }
            private set { }
        }

        [Display(Name = "Knowledge Index Average")]
        public decimal KnowledgeIndexRatingAverage
        {
            get { return UserResourcePoolRatingSet.Average(rating => rating.KnowledgeIndexRating); }
            private set { }
        }

        [Display(Name = "Quality Index Average")]
        public decimal QualityIndexRatingAverage
        {
            get { return UserResourcePoolRatingSet.Average(rating => rating.QualityIndexRating); }
            private set { }
        }

        [Display(Name = "Sector Index Average")]
        public decimal SectorIndexRatingAverage
        {
            get { return UserResourcePoolRatingSet.Average(rating => rating.SectorIndexRating); }
            private set { }
        }

        [Display(Name = "Employee Satisfaction Index Average")]
        public decimal EmployeeSatisfactionIndexRatingAverage
        {
            get { return UserResourcePoolRatingSet.Average(rating => rating.EmployeeSatisfactionIndexRating); }
            private set { }
        }

        [Display(Name = "Customer Satisfaction Index Average")]
        public decimal CustomerSatisfactionIndexRatingAverage
        {
            get { return UserResourcePoolRatingSet.Average(rating => rating.CustomerSatisfactionIndexRating); }
            private set { }
        }

        [Display(Name = "Distance Index Average")]
        public decimal DistanceIndexRatingAverage
        {
            get { return UserResourcePoolRatingSet.Average(rating => rating.DistanceIndexRating); }
            private set { }
        }

        [Display(Name = "Total Index Rating")]
        public decimal TotalIndexRating
        {
            get
            {
                return TotalCostIndexRatingAverage
                    + KnowledgeIndexRatingAverage
                    + QualityIndexRatingAverage
                    + SectorIndexRatingAverage
                    + EmployeeSatisfactionIndexRatingAverage
                    + CustomerSatisfactionIndexRatingAverage
                    + DistanceIndexRatingAverage;
            }
            private set { }
        }

        [Display(Name = "Total Cost Index Weighted Average")]
        public decimal TotalCostIndexRatingWeightedAverage
        {
            get
            {
                if (TotalIndexRating == 0)
                    return 0;

                return TotalCostIndexRating / TotalIndexRating;
            }
            private set { }
        }

        [Display(Name = "Knowledge Index Weighted Average")]
        public decimal KnowledgeIndexRatingWeightedAverage
        {
            get
            {
                if (TotalIndexRating == 0)
                    return 0;

                return KnowledgeIndexRating / TotalIndexRating;
            }
            private set { }
        }

        [Display(Name = "Quality Index Weighted Average")]
        public decimal QualityIndexRatingWeightedAverage
        {
            get
            {
                if (TotalIndexRating == 0)
                    return 0;

                return QualityIndexRating / TotalIndexRating;
            }
            private set { }
        }

        [Display(Name = "Sector Index Weighted Average")]
        public decimal SectorIndexRatingWeightedAverage
        {
            get
            {
                if (TotalIndexRating == 0)
                    return 0;

                return SectorIndexRating / TotalIndexRating;
            }
            private set { }
        }

        [Display(Name = "Employee Satisfaction Index Weighted Average")]
        public decimal EmployeeSatisfactionIndexRatingWeightedAverage
        {
            get
            {
                if (TotalIndexRating == 0)
                    return 0;

                return EmployeeSatisfactionIndexRating / TotalIndexRating;
            }
            private set { }
        }

        [Display(Name = "Customer Satisfaction Index Weighted Average")]
        public decimal CustomerSatisfactionIndexRatingWeightedAverage
        {
            get
            {
                if (TotalIndexRating == 0)
                    return 0;

                return CustomerSatisfactionIndexRating / TotalIndexRating;
            }
            private set { }
        }

        [Display(Name = "Distance Index Weighted Average")]
        public decimal DistanceIndexRatingWeightedAverage
        {
            get
            {
                if (TotalIndexRating == 0)
                    return 0;

                return DistanceIndexRating / TotalIndexRating;
            }
            private set { }
        }

        #endregion

        #region - General -

        public decimal ResourcePoolTax
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.ResourcePoolTax); }
            private set { }
        }

        public decimal SalesPriceIncludingResourcePoolTax
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.SalesPriceIncludingResourcePoolTax); }
            private set { }
        }

        public int NumberOfSales
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.NumberOfSales); }
            private set { }
        }

        public decimal TotalProductionCost
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.TotalProductionCost); }
            private set { }
        }

        public decimal TotalSalesRevenue
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.TotalSalesRevenue); }
            private set { }
        }

        public decimal TotalProfit
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.TotalProfit); }
            private set { }
        }

        public decimal TotalResourcePoolTax
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.TotalResourcePoolTax); }
            private set { }
        }

        public decimal TotalSalesRevenueIncludingResourcePoolTax
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.TotalSalesRevenueIncludingResourcePoolTax); }
            private set { }
        }

        #endregion

        #region - Total Cost Index -

        public decimal TotalCostIndexShare
        {
            get { return TotalResourcePoolTax * TotalCostIndexRatingWeightedAverage; }
            private set { }
        }

        public decimal TotalCostIndexPercentageWithNumberOfSales
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.TotalCostIndexPercentageWithNumberOfSales); }
            private set { }
        }

        public decimal TotalCostIndexIncome
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.TotalCostIndexIncome); }
            private set { }
        }

        #endregion

        #region - Knowledge Index -

        public decimal KnowledgeIndexShare
        {
            get { return TotalResourcePoolTax * KnowledgeIndexRatingWeightedAverage; }
            private set { }
        }

        public decimal LicenseUserRating
        {
            get
            {
                if (LicenseSet == null)
                    return 0;

                return UserResourcePoolType == UserResourcePoolType.Public
                    ? LicenseSet.Sum(license => license.GetAverageUserRating())
                    : LicenseSet.Sum(license => license.GetAverageUserRating(User.Id));
            }
            private set { }
        }

        public decimal KnowledgeIndexPercentageWithNumberOfSales
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.KnowledgeIndexPercentageWithNumberOfSales); }
            private set { }
        }

        public decimal KnowledgeIndexIncome
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.KnowledgeIndexIncome); }
            private set { }
        }

        #endregion

        #region - Quality Index -

        public decimal QualityIndexShare
        {
            get { return TotalResourcePoolTax * QualityIndexRatingWeightedAverage; }
            private set { }
        }

        public decimal QualityUserRating
        {
            get
            {
                return UserResourcePoolType == UserResourcePoolType.Public
                    ? UserResourcePoolOrganizationSet.Sum(item => item.GetAverageQualityUserRating())
                    : UserResourcePoolOrganizationSet.Sum(item => item.GetAverageQualityUserRating(User.Id));
            }
            private set { }
        }

        public decimal QualityIndexPercentageWithNumberOfSales
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.QualityIndexPercentageWithNumberOfSales); }
            private set { }
        }

        public decimal QualityIndexIncome
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.QualityIndexIncome); }
            private set { }
        }

        #endregion

        #region - Sector Index -

        public decimal SectorIndexShare
        {
            get { return TotalResourcePoolTax * SectorIndexRatingWeightedAverage; }
            private set { }
        }

        public decimal SectorUserRating
        {
            get
            {
                if (SectorSet == null)
                    return 0;

                return UserResourcePoolType == UserResourcePoolType.Public
                    ? SectorSet.Sum(sector => sector.GetAverageUserRating())
                    : SectorSet.Sum(sector => sector.GetAverageUserRating(User.Id));
            }
            private set { }
        }

        public decimal SectorIndexPercentageWithNumberOfSales
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.SectorIndexPercentageWithNumberOfSales); }
        }

        public decimal SectorIndexIncome
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.SectorIndexIncome); }
            private set { }
        }

        #endregion

        #region - Employee Satifaction Index -

        public decimal EmployeeSatisfactionIndexShare
        {
            get { return TotalResourcePoolTax * EmployeeSatisfactionIndexRatingWeightedAverage; }
            private set { }
        }

        public decimal EmployeeSatisfactionUserRating
        {
            get
            {
                return UserResourcePoolType == UserResourcePoolType.Public
                    ? UserResourcePoolOrganizationSet.Sum(item => item.GetAverageEmployeeSatisfactionUserRating())
                    : UserResourcePoolOrganizationSet.Sum(item => item.GetAverageEmployeeSatisfactionUserRating(User.Id));
            }
            private set { }
        }

        public decimal EmployeeSatisfactionIndexPercentageWithNumberOfSales
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.EmployeeSatisfactionIndexPercentageWithNumberOfSales); }
            private set { }
        }

        public decimal EmployeeSatisfactionIndexIncome
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.EmployeeSatisfactionIndexIncome); }
            private set { }
        }

        #endregion

        #region - Customer Satifaction Index -

        public decimal CustomerSatisfactionIndexShare
        {
            get { return TotalResourcePoolTax * CustomerSatisfactionIndexRatingWeightedAverage; }
            private set { }
        }

        public decimal CustomerSatisfactionUserRating
        {
            get
            {
                return UserResourcePoolType == UserResourcePoolType.Public
                    ? UserResourcePoolOrganizationSet.Sum(organization => organization.GetAverageCustomerSatisfactionUserRating())
                    : UserResourcePoolOrganizationSet.Sum(organization => organization.GetAverageCustomerSatisfactionUserRating(User.Id));
            }
            private set { }
        }

        public decimal CustomerSatisfactionIndexPercentageWithNumberOfSales
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.CustomerSatisfactionIndexPercentageWithNumberOfSales); }
            private set { }
        }

        public decimal CustomerSatisfactionIndexIncome
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.CustomerSatisfactionIndexIncome); }
            private set { }
        }

        #endregion

        #region - Distance Index -

        public decimal DistanceIndexShare
        {
            get { return TotalResourcePoolTax * DistanceIndexRatingWeightedAverage; }
            private set { }
        }

        public decimal DistanceRating
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.DistanceRating); }
            private set { }
        }

        public decimal DistanceIndexPercentageWithNumberOfSales
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.DistanceIndexPercentageWithNumberOfSales); }
            private set { }
        }

        public decimal DistanceIndexIncome
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.DistanceIndexIncome); }
            private set { }
        }

        #endregion

        public decimal TotalResourcePoolIncome
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.TotalResourcePoolIncome); }
            private set { }
        }

        public decimal TotalIncome
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.TotalIncome); }
            private set { }
        }
    }
}
