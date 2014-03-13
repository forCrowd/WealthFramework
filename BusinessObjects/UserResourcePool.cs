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

        public IEnumerable<Organization> OrganizationSet { get { return ResourcePool.ResourcePoolOrganizationSet.Select(item => item.Organization); } }

        public IEnumerable<UserResourcePoolOrganization> UserResourcePoolOrganizationSet { get {  return User.UserResourcePoolOrganizationSet.Where(item => item.ResourcePoolOrganization.ResourcePool == ResourcePool); } }

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

        public decimal ResourcePoolRatePercentage
        {
            get {  return ResourcePoolRate / 100; }
        }

        #region - Ratings -

        [Display(Name = "Total Cost Index Average")]
        public decimal TotalCostIndexRatingAverage { get { return UserResourcePoolRatingSet.Average(rating => rating.TotalCostIndexRating); } }

        [Display(Name = "Knowledge Index Average")]
        public decimal KnowledgeIndexRatingAverage { get { return UserResourcePoolRatingSet.Average(rating => rating.KnowledgeIndexRating); } }

        [Display(Name = "Quality Index Average")]
        public decimal QualityIndexRatingAverage { get { return UserResourcePoolRatingSet.Average(rating => rating.QualityIndexRating); } }

        [Display(Name = "Sector Index Average")]
        public decimal SectorIndexRatingAverage { get { return UserResourcePoolRatingSet.Average(rating => rating.SectorIndexRating); } }

        [Display(Name = "Employee Satisfaction Index Average")]
        public decimal EmployeeSatisfactionIndexRatingAverage { get { return UserResourcePoolRatingSet.Average(rating => rating.EmployeeSatisfactionIndexRating); } }

        [Display(Name = "Customer Satisfaction Index Average")]
        public decimal CustomerSatisfactionIndexRatingAverage { get { return UserResourcePoolRatingSet.Average(rating => rating.CustomerSatisfactionIndexRating); } }

        [Display(Name = "Distance Index Average")]
        public decimal DistanceIndexRatingAverage { get { return UserResourcePoolRatingSet.Average(rating => rating.DistanceIndexRating); } }

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
        }

        #endregion

        #region - General -

        public decimal ResourcePoolTax
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.ResourcePoolTax); }
        }

        public decimal SalesPriceIncludingResourcePoolTax
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.SalesPriceIncludingResourcePoolTax); }
        }

        public int NumberOfSales
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.NumberOfSales); }
        }

        public decimal TotalProductionCost
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.TotalProductionCost); }
        }

        public decimal TotalSalesRevenue
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.TotalSalesRevenue); }
        }

        public decimal TotalProfit
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.TotalProfit); }
        }

        public decimal TotalResourcePoolTax
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.TotalResourcePoolTax); }
        }

        public decimal TotalSalesRevenueIncludingResourcePoolTax
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.TotalSalesRevenueIncludingResourcePoolTax); }
        }

        #endregion

        #region - Total Cost Index -

        public decimal TotalCostIndexShare
        {
            get { return TotalResourcePoolTax * TotalCostIndexRatingWeightedAverage; }
        }

        public decimal TotalCostIndexPercentageWithNumberOfSales
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.TotalCostIndexPercentageWithNumberOfSales); }
        }

        public decimal TotalCostIndexIncome
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.TotalCostIndexIncome); }
        }

        #endregion

        #region - Knowledge Index -

        public decimal KnowledgeIndexShare
        {
            get { return TotalResourcePoolTax * KnowledgeIndexRatingWeightedAverage; }
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
        }

        public decimal KnowledgeIndexPercentageWithNumberOfSales
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.KnowledgeIndexPercentageWithNumberOfSales); }
        }

        public decimal KnowledgeIndexIncome
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.KnowledgeIndexIncome); }
        }

        #endregion

        #region - Quality Index -

        public decimal QualityIndexShare
        {
            get { return TotalResourcePoolTax * QualityIndexRatingWeightedAverage; }
        }

        public decimal QualityUserRating
        {
            get
            {
                return UserResourcePoolType == UserResourcePoolType.Public
                    ? UserResourcePoolOrganizationSet.Sum(item => item.GetAverageQualityUserRating())
                    : UserResourcePoolOrganizationSet.Sum(item => item.GetAverageQualityUserRating(User.Id));
            }
        }

        public decimal QualityIndexPercentageWithNumberOfSales
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.QualityIndexPercentageWithNumberOfSales); }
        }

        public decimal QualityIndexIncome
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.QualityIndexIncome); }
        }

        #endregion

        #region - Sector Index -

        public decimal SectorIndexShare
        {
            get { return TotalResourcePoolTax * SectorIndexRatingWeightedAverage; }
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
        }

        public decimal SectorIndexPercentageWithNumberOfSales
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.SectorIndexPercentageWithNumberOfSales); }
        }

        public decimal SectorIndexIncome
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.SectorIndexIncome); }
        }

        #endregion

        #region - Employee Satifaction Index -

        public decimal EmployeeSatisfactionIndexShare
        {
            get { return TotalResourcePoolTax * EmployeeSatisfactionIndexRatingWeightedAverage; }
        }

        public decimal EmployeeSatisfactionUserRating
        {
            get
            {
                return UserResourcePoolType == UserResourcePoolType.Public
                    ? UserResourcePoolOrganizationSet.Sum(item => item.GetAverageEmployeeSatisfactionUserRating())
                    : UserResourcePoolOrganizationSet.Sum(item => item.GetAverageEmployeeSatisfactionUserRating(User.Id));
            }
        }

        public decimal EmployeeSatisfactionIndexPercentageWithNumberOfSales
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.EmployeeSatisfactionIndexPercentageWithNumberOfSales); }
        }

        public decimal EmployeeSatisfactionIndexIncome
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.EmployeeSatisfactionIndexIncome); }
        }

        #endregion

        #region - Customer Satifaction Index -

        public decimal CustomerSatisfactionIndexShare
        {
            get { return TotalResourcePoolTax * CustomerSatisfactionIndexRatingWeightedAverage; }
        }

        public decimal CustomerSatisfactionUserRating
        {
            get
            {
                return UserResourcePoolType == UserResourcePoolType.Public
                    ? UserResourcePoolOrganizationSet.Sum(organization => organization.GetAverageCustomerSatisfactionUserRating())
                    : UserResourcePoolOrganizationSet.Sum(organization => organization.GetAverageCustomerSatisfactionUserRating(User.Id));
            }
        }

        public decimal CustomerSatisfactionIndexPercentageWithNumberOfSales
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.CustomerSatisfactionIndexPercentageWithNumberOfSales); }
        }

        public decimal CustomerSatisfactionIndexIncome
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.CustomerSatisfactionIndexIncome); }
        }

        #endregion

        #region - Distance Index -

        public decimal DistanceIndexShare
        {
            get { return TotalResourcePoolTax * DistanceIndexRatingWeightedAverage; }
        }

        public decimal DistanceRating
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.DistanceRating); }
        }

        public decimal DistanceIndexPercentageWithNumberOfSales
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.DistanceIndexPercentageWithNumberOfSales); }
        }

        public decimal DistanceIndexIncome
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.DistanceIndexIncome); }
        }

        #endregion

        public decimal TotalResourcePoolIncome
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.TotalResourcePoolIncome); }
        }

        public decimal TotalIncome
        {
            get { return UserResourcePoolOrganizationSet.Sum(item => item.TotalIncome); }
        }
    }
}
