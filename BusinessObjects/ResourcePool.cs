namespace BusinessObjects
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;

    public class ResourcePool
    {
        public ResourcePool(User user, ResourcePoolType type, UserDistributionIndexRatingAverage distributionIndexAverage, decimal resourcePoolRate, IEnumerable<Organization> organizationSet)
            : this(user, type, distributionIndexAverage, resourcePoolRate, organizationSet, null, null)
        { }

        public ResourcePool(User user, ResourcePoolType type, UserDistributionIndexRatingAverage distributionIndexAverage, decimal resourcePoolRate, IEnumerable<Organization> organizationSet, IEnumerable<License> licenseSet)
            : this(user, type, distributionIndexAverage, resourcePoolRate, organizationSet, licenseSet, null)
        { }

        public ResourcePool(User user, ResourcePoolType type, UserDistributionIndexRatingAverage distributionIndexRatingAverage, decimal resourcePoolRate, IEnumerable<Organization> organizationSet, IEnumerable<License> licenseSet, IEnumerable<Sector> sectorSet)
        {
            // Validate
            if (user == null)
                throw new ArgumentNullException("user");

            // User
            User = user;

            // Resource pool type
            ResourcePoolType = type;

            // Distribution index rating average
            DistributionIndexRatingAverage = distributionIndexRatingAverage;

            // Resource pool rate
            ResourcePoolRate = resourcePoolRate;

            // Organization set
            OrganizationSet = organizationSet;

            foreach (var organization in OrganizationSet)
                organization.ResourcePool = this;

            // Licence set
            if (licenseSet != null)
            {
                LicenseSet = licenseSet;

                foreach (var license in LicenseSet)
                    license.ResourcePool = this;
            }

            // Sector set
            if (sectorSet != null)
            {
                SectorSet = sectorSet;

                foreach (var sector in SectorSet)
                    sector.ResourcePool = this;
            }
        }

        public User User { get; private set; }
        public ResourcePoolType ResourcePoolType { get; private set; }
        public IEnumerable<Organization> OrganizationSet { get; private set; }
        public IEnumerable<UserOrganizationRating> UserOrganizationRatingSet { get { return User.UserOrganizationRatingSet.Where(item => OrganizationSet.Any(organization => item.OrganizationId == organization.Id)); } }
        public IEnumerable<License> LicenseSet { get; private set; }
        public IEnumerable<Sector> SectorSet { get; private set; }
        public UserDistributionIndexRatingAverage DistributionIndexRatingAverage { get; private set; }

        [Display(Name = "CMRP Rate")]
        public decimal ResourcePoolRate { get; private set; }

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
            get { return OrganizationSet.Average(organization => organization.ProfitPercentage); }
        }

        public decimal ProfitMargin
        {
            get { return OrganizationSet.Average(organization => organization.ProfitMargin); }
        }

        public decimal ResourcePoolTax
        {
            get { return OrganizationSet.Sum(organization => organization.ResourcePoolTax); }
        }

        public decimal SalesPriceIncludingResourcePoolTax
        {
            get { return OrganizationSet.Sum(organization => organization.SalesPriceIncludingResourcePoolTax); }
        }

        public int NumberOfSales
        {
            get { return UserOrganizationRatingSet.Sum(item => item.NumberOfSales); }
        }

        public decimal TotalProductionCost
        {
            get { return UserOrganizationRatingSet.Sum(item => item.TotalProductionCost); }
        }

        public decimal TotalSalesRevenue
        {
            get { return UserOrganizationRatingSet.Sum(item => item.TotalSalesRevenue); }
        }

        public decimal TotalProfit
        {
            get { return UserOrganizationRatingSet.Sum(item => item.TotalProfit); }
        }

        public decimal TotalResourcePoolTax
        {
            get { return UserOrganizationRatingSet.Sum(item => item.TotalResourcePoolTax); }
        }

        public decimal TotalSalesRevenueIncludingResourcePoolTax
        {
            get { return UserOrganizationRatingSet.Sum(item => item.TotalSalesRevenueIncludingResourcePoolTax); }
        }

        #region - Total Cost Index -

        public decimal TotalCostIndexShare
        {
            get { return TotalResourcePoolTax * DistributionIndexRatingAverage.TotalCostIndexRatingWeightedAverage; }
        }

        public decimal TotalCostIndexPercentageWithNumberOfSales
        {
            get { return UserOrganizationRatingSet.Sum(item => item.TotalCostIndexPercentageWithNumberOfSales); }
        }

        public decimal TotalCostIndexIncome
        {
            get { return UserOrganizationRatingSet.Sum(item => item.TotalCostIndexIncome); }
        }

        #endregion

        #region - Knowledge Index -

        public decimal KnowledgeIndexShare
        {
            get { return TotalResourcePoolTax * DistributionIndexRatingAverage.KnowledgeIndexRatingWeightedAverage; }
        }

        public decimal LicenseUserRating
        {
            get
            {
                if (LicenseSet == null)
                    return 0;
                
                return ResourcePoolType == ResourcePoolType.Public
                    ? LicenseSet.Sum(license => license.GetAverageUserRating())
                    : LicenseSet.Sum(license => license.GetAverageUserRating(User.Id));
            }
        }

        public decimal KnowledgeIndexPercentageWithNumberOfSales
        {
            get { return UserOrganizationRatingSet.Sum(item => item.KnowledgeIndexPercentageWithNumberOfSales); }
        }

        public decimal KnowledgeIndexIncome
        {
            get { return UserOrganizationRatingSet.Sum(item => item.KnowledgeIndexIncome); }
        }

        #endregion

        #region - Quality Index -

        public decimal QualityIndexShare
        {
            get { return TotalResourcePoolTax * DistributionIndexRatingAverage.QualityIndexRatingWeightedAverage; }
        }

        public decimal QualityUserRating
        {
            get
            {
                return ResourcePoolType == ResourcePoolType.Public
                    ? OrganizationSet.Sum(organization => organization.GetAverageQualityUserRating())
                    : OrganizationSet.Sum(organization => organization.GetAverageQualityUserRating(User.Id));
            }
        }

        public decimal QualityIndexPercentageWithNumberOfSales
        {
            get { return UserOrganizationRatingSet.Sum(item => item.QualityIndexPercentageWithNumberOfSales); }
        }

        public decimal QualityIndexIncome
        {
            get { return UserOrganizationRatingSet.Sum(item => item.QualityIndexIncome); }
        }
        
        #endregion

        #region - Sector Index -

        public decimal SectorIndexShare
        {
            get { return TotalResourcePoolTax * DistributionIndexRatingAverage.SectorIndexRatingWeightedAverage; }
        }

        public decimal SectorUserRating
        {
            get
            {
                if (SectorSet == null)
                    return 0;

                return ResourcePoolType == ResourcePoolType.Public
                    ? SectorSet.Sum(sector => sector.GetAverageUserRating())
                    : SectorSet.Sum(sector => sector.GetAverageUserRating(User.Id));
            }
        }

        public decimal SectorIndexPercentageWithNumberOfSales
        {
            get { return UserOrganizationRatingSet.Sum(item => item.SectorIndexPercentageWithNumberOfSales); }
        }

        public decimal SectorIndexIncome
        {
            get { return UserOrganizationRatingSet.Sum(item => item.SectorIndexIncome); }
        }

        #endregion

        #region - Employee Satifaction Index -

        public decimal EmployeeSatisfactionIndexShare
        {
            get { return TotalResourcePoolTax * DistributionIndexRatingAverage.EmployeeSatisfactionIndexRatingWeightedAverage; }
        }
        
        public decimal EmployeeSatisfactionUserRating
        {
            get
            {
                return ResourcePoolType == ResourcePoolType.Public
                    ? OrganizationSet.Sum(organization => organization.GetAverageEmployeeSatisfactionUserRating())
                    : OrganizationSet.Sum(organization => organization.GetAverageEmployeeSatisfactionUserRating(User.Id));
            }
        }

        public decimal EmployeeSatisfactionIndexPercentageWithNumberOfSales
        {
            get { return UserOrganizationRatingSet.Sum(item => item.EmployeeSatisfactionIndexPercentageWithNumberOfSales); }
        }

        public decimal EmployeeSatisfactionIndexIncome
        {
            get { return UserOrganizationRatingSet.Sum(item => item.EmployeeSatisfactionIndexIncome); }
        }

        #endregion

        #region - Customer Satifaction Index -

        public decimal CustomerSatisfactionIndexShare
        {
            get { return TotalResourcePoolTax * DistributionIndexRatingAverage.CustomerSatisfactionIndexRatingWeightedAverage; }
        }
        
        public decimal CustomerSatisfactionUserRating
        {
            get
            {
                return ResourcePoolType == ResourcePoolType.Public
                    ? OrganizationSet.Sum(organization => organization.GetAverageCustomerSatisfactionUserRating())
                    : OrganizationSet.Sum(organization => organization.GetAverageCustomerSatisfactionUserRating(User.Id));
            }
        }

        public decimal CustomerSatisfactionIndexPercentageWithNumberOfSales
        {
            get { return UserOrganizationRatingSet.Sum(item => item.CustomerSatisfactionIndexPercentageWithNumberOfSales); }
        }

        public decimal CustomerSatisfactionIndexIncome
        {
            get { return UserOrganizationRatingSet.Sum(item => item.CustomerSatisfactionIndexIncome); }
        }

        #endregion

        #region - Distance Index -

        public decimal DistanceIndexShare
        {
            get { return TotalResourcePoolTax * DistributionIndexRatingAverage.DistanceIndexRatingWeightedAverage; }
        }

        public decimal DistanceRating
        {
            get { return OrganizationSet.Sum(organization => organization.DistanceRating); }
        }

        public decimal DistanceIndexPercentageWithNumberOfSales
        {
            get { return UserOrganizationRatingSet.Sum(item => item.DistanceIndexPercentageWithNumberOfSales); }
        }

        public decimal DistanceIndexIncome
        {
            get { return UserOrganizationRatingSet.Sum(item => item.DistanceIndexIncome); }
        }

        #endregion

        public decimal TotalResourcePoolIncome
        {
            get { return UserOrganizationRatingSet.Sum(item => item.TotalResourcePoolIncome); }
        }

        public decimal TotalIncome
        {
            get { return UserOrganizationRatingSet.Sum(item => item.TotalIncome); }
        }
    }
}
