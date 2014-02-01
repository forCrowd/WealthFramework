namespace BusinessObjects
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;

    public class ResourcePool
    {
        public ResourcePool(UserDistributionIndexRatingAverage distributionIndexAverage, decimal resourcePoolRate, IEnumerable<Organization> organizationSet)
            : this(distributionIndexAverage, resourcePoolRate, organizationSet, null, null)
        { }

        public ResourcePool(UserDistributionIndexRatingAverage distributionIndexAverage, decimal resourcePoolRate, IEnumerable<Organization> organizationSet, IEnumerable<License> licenseSet)
            : this(distributionIndexAverage, resourcePoolRate, organizationSet, licenseSet, null)
        { }

        public ResourcePool(UserDistributionIndexRatingAverage distributionIndexRatingAverage, decimal resourcePoolRate, IEnumerable<Organization> organizationSet, IEnumerable<License> licenseSet, IEnumerable<Sector> sectorSet)
        {
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

        public IEnumerable<Organization> OrganizationSet { get; private set; }
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
            get { return OrganizationSet.Sum(organization => organization.NumberOfSales); }
        }

        public decimal TotalProductionCost
        {
            get { return OrganizationSet.Sum(organization => organization.TotalProductionCost); }
        }

        public decimal TotalSalesRevenue
        {
            get { return OrganizationSet.Sum(organization => organization.TotalSalesRevenue); }
        }

        public decimal TotalProfit
        {
            get { return OrganizationSet.Sum(organization => organization.TotalProfit); }
        }

        public decimal TotalResourcePoolTax
        {
            get { return OrganizationSet.Sum(organization => organization.TotalResourcePoolTax); }
        }

        public decimal TotalSalesRevenueIncludingResourcePoolTax
        {
            get { return OrganizationSet.Sum(organization => organization.TotalSalesRevenueIncludingResourcePoolTax); }
        }

        #region - Total Cost Index -

        public decimal TotalCostIndexShare
        {
            get { return TotalResourcePoolTax * DistributionIndexRatingAverage.TotalCostIndexRatingWeightedAverage; }
        }

        public decimal TotalCostIndexPercentageWithNumberOfSales
        {
            get { return OrganizationSet.Sum(organization => organization.TotalCostIndexPercentageWithNumberOfSales); }
        }

        public decimal TotalCostIndexIncome
        {
            get { return OrganizationSet.Sum(organization => organization.TotalCostIndexIncome); }
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
                return LicenseSet.Sum(license => license.UserRating);
            }
        }

        public decimal KnowledgeIndexPercentageWithNumberOfSales
        {
            get { return OrganizationSet.Sum(organization => organization.KnowledgeIndexPercentageWithNumberOfSales); }
        }

        public decimal KnowledgeIndexIncome
        {
            get { return OrganizationSet.Sum(organization => organization.KnowledgeIndexIncome); }
        }

        #endregion

        #region - Quality Index -

        public decimal QualityIndexShare
        {
            get { return TotalResourcePoolTax * DistributionIndexRatingAverage.QualityIndexRatingWeightedAverage; }
        }

        public decimal QualityUserRating
        {
            get { return OrganizationSet.Sum(organization => organization.QualityUserRating); }
        }

        public decimal QualityIndexPercentageWithNumberOfSales
        {
            get { return OrganizationSet.Sum(organization => organization.QualityIndexPercentageWithNumberOfSales); }
        }

        public decimal QualityIndexIncome
        {
            get { return OrganizationSet.Sum(organization => organization.QualityIndexIncome); }
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
                return SectorSet.Sum(sector => sector.UserRating);
            }
        }

        public decimal SectorIndexPercentageWithNumberOfSales
        {
            get { return OrganizationSet.Sum(organization => organization.SectorIndexPercentageWithNumberOfSales); }
        }

        public decimal SectorIndexIncome
        {
            get { return OrganizationSet.Sum(organization => organization.SectorIndexIncome); }
        }

        #endregion

        #region - Employee Satifaction Index -

        public decimal EmployeeSatisfactionIndexShare
        {
            get { return TotalResourcePoolTax * DistributionIndexRatingAverage.EmployeeSatisfactionIndexRatingWeightedAverage; }
        }
        
        public decimal EmployeeSatisfactionUserRating
        {
            get { return OrganizationSet.Sum(organization => organization.EmployeeSatisfactionUserRating); }
        }

        public decimal EmployeeSatisfactionIndexPercentageWithNumberOfSales
        {
            get { return OrganizationSet.Sum(organization => organization.EmployeeSatisfactionIndexPercentageWithNumberOfSales); }
        }

        public decimal EmployeeSatisfactionIndexIncome
        {
            get { return OrganizationSet.Sum(organization => organization.EmployeeSatisfactionIndexIncome); }
        }

        #endregion

        #region - Customer Satifaction Index -

        public decimal CustomerSatisfactionIndexShare
        {
            get { return TotalResourcePoolTax * DistributionIndexRatingAverage.CustomerSatisfactionIndexRatingWeightedAverage; }
        }
        
        public decimal CustomerSatisfactionUserRating
        {
            get { return OrganizationSet.Sum(organization => organization.CustomerSatisfactionUserRating); }
        }

        public decimal CustomerSatisfactionIndexPercentageWithNumberOfSales
        {
            get { return OrganizationSet.Sum(organization => organization.CustomerSatisfactionIndexPercentageWithNumberOfSales); }
        }

        public decimal CustomerSatisfactionIndexIncome
        {
            get { return OrganizationSet.Sum(organization => organization.CustomerSatisfactionIndexIncome); }
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
            get { return OrganizationSet.Sum(organization => organization.DistanceIndexPercentageWithNumberOfSales); }
        }

        public decimal DistanceIndexIncome
        {
            get { return OrganizationSet.Sum(organization => organization.DistanceIndexIncome); }
        }

        #endregion

        public decimal TotalResourcePoolIncome
        {
            get { return OrganizationSet.Sum(organization => organization.TotalResourcePoolIncome); }
        }

        public decimal TotalIncome
        {
            get { return OrganizationSet.Sum(organization => organization.TotalIncome); }
        }
    }
}
