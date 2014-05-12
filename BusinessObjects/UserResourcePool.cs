namespace BusinessObjects
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;
    using BusinessObjects.Metadata;

    [MetadataType(typeof(UserResourcePoolMetadata))]
    public partial class UserResourcePool : BaseEntity
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ResourcePoolId { get; set; }
        public decimal ResourcePoolRate { get; set; }
        public decimal TotalCostIndexRating { get; set; }
        public decimal KnowledgeIndexRating { get; set; }
        public decimal QualityIndexRating { get; set; }
        public decimal SectorIndexRating { get; set; }
        public decimal EmployeeSatisfactionIndexRating { get; set; }
        public decimal CustomerSatisfactionIndexRating { get; set; }
        public decimal DistanceIndexRating { get; set; }
        
        
        

        public virtual User User { get; set; }
        public virtual ResourcePool ResourcePool { get; set; }

        /* */

        public string Name
        {
            get { return string.Format("{0} - {1}", User.Email, ResourcePool.Name); }
        }

        UserResourcePoolType userResourcePoolType = UserResourcePoolType.Public;

        public UserResourcePoolType UserResourcePoolType
        {
            get { return userResourcePoolType; }
            set { userResourcePoolType = value; }
        }

        public IEnumerable<UserOrganization> UserOrganizationSet
        {
            get { return User.UserOrganizationSet.Where(item => item.Organization.Sector.ResourcePool == ResourcePool); }
        }

        public IEnumerable<ViewModels.UserOrganizationViewModel> UserResourcePoolOrganizationDto2Set
        {
            get
            {
                return UserOrganizationSet.Select(item => new ViewModels.UserOrganizationViewModel()
                {
                    OrganizationName = item.Organization.Name,
                    OrganizationProductionCost = item.Organization.ProductionCost,
                    OrganizationSalesPrice = item.Organization.SalesPrice,
                    OrganizationProfitPercentage = item.Organization.ProfitPercentage,
                    OrganizationLicenseName = item.Organization.License.Name,

                    ResourcePoolTax = item.ResourcePoolTax,
                    SalesPriceIncludingResourcePoolTax = item.SalesPriceIncludingResourcePoolTax,
                    NumberOfSales = item.NumberOfSales,
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
            get { return UserOrganizationSet.Sum(item => item.ResourcePoolTax); }
            private set { }
        }

        public decimal SalesPriceIncludingResourcePoolTax
        {
            get { return UserOrganizationSet.Sum(item => item.SalesPriceIncludingResourcePoolTax); }
            private set { }
        }

        public int NumberOfSales
        {
            get { return UserOrganizationSet.Sum(item => item.NumberOfSales); }
            private set { }
        }

        public decimal TotalProductionCost
        {
            get { return UserOrganizationSet.Sum(item => item.TotalProductionCost); }
            private set { }
        }

        public decimal TotalSalesRevenue
        {
            get { return UserOrganizationSet.Sum(item => item.TotalSalesRevenue); }
            private set { }
        }

        public decimal TotalProfit
        {
            get { return UserOrganizationSet.Sum(item => item.TotalProfit); }
            private set { }
        }

        public decimal TotalResourcePoolTax
        {
            get { return UserOrganizationSet.Sum(item => item.TotalResourcePoolTax); }
            private set { }
        }

        public decimal TotalSalesRevenueIncludingResourcePoolTax
        {
            get { return UserOrganizationSet.Sum(item => item.TotalSalesRevenueIncludingResourcePoolTax); }
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
            get { return UserOrganizationSet.Sum(item => item.TotalCostIndexPercentageWithNumberOfSales); }
            private set { }
        }

        public decimal TotalCostIndexIncome
        {
            get { return UserOrganizationSet.Sum(item => item.TotalCostIndexIncome); }
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
                if (ResourcePool == null)
                    return 0;

                return UserResourcePoolType == UserResourcePoolType.Public
                    ? ResourcePool.LicenseSet.Sum(license => license.GetAverageRating())
                    : ResourcePool.LicenseSet.Sum(license => license.GetAverageRating(User.Id));
            }
            private set { }
        }

        public decimal KnowledgeIndexPercentageWithNumberOfSales
        {
            get { return UserOrganizationSet.Sum(item => item.KnowledgeIndexPercentageWithNumberOfSales); }
            private set { }
        }

        public decimal KnowledgeIndexIncome
        {
            get { return UserOrganizationSet.Sum(item => item.KnowledgeIndexIncome); }
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
                    ? ResourcePool.OrganizationSet.Sum(item => item.GetAverageQualityRating())
                    : ResourcePool.OrganizationSet.Sum(item => item.GetAverageQualityRating(User.Id));
            }
            private set { }
        }

        public decimal QualityIndexPercentageWithNumberOfSales
        {
            get { return UserOrganizationSet.Sum(item => item.QualityIndexPercentageWithNumberOfSales); }
            private set { }
        }

        public decimal QualityIndexIncome
        {
            get { return UserOrganizationSet.Sum(item => item.QualityIndexIncome); }
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
                if (ResourcePool == null)
                    return 0;

                return UserResourcePoolType == UserResourcePoolType.Public
                    ? ResourcePool.SectorSet.Sum(sector => sector.GetAverageRating())
                    : ResourcePool.SectorSet.Sum(sector => sector.GetAverageRating(User.Id));
            }
            private set { }
        }

        public decimal SectorIndexPercentageWithNumberOfSales
        {
            get { return UserOrganizationSet.Sum(item => item.SectorIndexPercentageWithNumberOfSales); }
        }

        public decimal SectorIndexIncome
        {
            get { return UserOrganizationSet.Sum(item => item.SectorIndexIncome); }
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
                    ? ResourcePool.OrganizationSet.Sum(item => item.GetAverageEmployeeSatisfactionRating())
                    : ResourcePool.OrganizationSet.Sum(item => item.GetAverageEmployeeSatisfactionRating(User.Id));
            }
            private set { }
        }

        public decimal EmployeeSatisfactionIndexPercentageWithNumberOfSales
        {
            get { return UserOrganizationSet.Sum(item => item.EmployeeSatisfactionIndexPercentageWithNumberOfSales); }
            private set { }
        }

        public decimal EmployeeSatisfactionIndexIncome
        {
            get { return UserOrganizationSet.Sum(item => item.EmployeeSatisfactionIndexIncome); }
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
                    ? ResourcePool.OrganizationSet.Sum(organization => organization.GetAverageCustomerSatisfactionRating())
                    : ResourcePool.OrganizationSet.Sum(organization => organization.GetAverageCustomerSatisfactionRating(User.Id));
            }
            private set { }
        }

        public decimal CustomerSatisfactionIndexPercentageWithNumberOfSales
        {
            get { return UserOrganizationSet.Sum(item => item.CustomerSatisfactionIndexPercentageWithNumberOfSales); }
            private set { }
        }

        public decimal CustomerSatisfactionIndexIncome
        {
            get { return UserOrganizationSet.Sum(item => item.CustomerSatisfactionIndexIncome); }
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
            get { return UserOrganizationSet.Sum(item => item.DistanceRating); }
            private set { }
        }

        public decimal DistanceIndexPercentageWithNumberOfSales
        {
            get { return UserOrganizationSet.Sum(item => item.DistanceIndexPercentageWithNumberOfSales); }
            private set { }
        }

        public decimal DistanceIndexIncome
        {
            get { return UserOrganizationSet.Sum(item => item.DistanceIndexIncome); }
            private set { }
        }

        #endregion

        public decimal TotalResourcePoolIncome
        {
            get { return UserOrganizationSet.Sum(item => item.TotalResourcePoolIncome); }
            private set { }
        }

        public decimal TotalIncome
        {
            get { return UserOrganizationSet.Sum(item => item.TotalIncome); }
            private set { }
        }
    }
}
