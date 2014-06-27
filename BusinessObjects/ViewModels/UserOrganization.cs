using System.Collections.Generic;
using System.Linq;

namespace BusinessObjects.ViewModels
{
    public class UserOrganization
    {
        public UserOrganization() { }

        public UserOrganization(BusinessObjects.UserOrganization userOrganization)
        {
            OrganizationName = userOrganization.Organization.Name;
            OrganizationProductionCost = userOrganization.Organization.ProductionCost;
            OrganizationSalesPrice = userOrganization.Organization.SalesPrice;
            OrganizationProfitPercentage = userOrganization.Organization.ProfitPercentage;
            OrganizationLicenseName = userOrganization.Organization.License.Name;
            OrganizationSectorRatingWeightedAverage = userOrganization.Organization.Sector.RatingWeightedAverage;
            OrganizationLicenseRatingWeightedAverage = userOrganization.Organization.License.RatingWeightedAverage;
            OrganizationSalesPriceWeightedAverage = userOrganization.Organization.SalesPriceWeightedAverage;
            OrganizationQualityRatingWeightedAverage = userOrganization.Organization.QualityRatingWeightedAverage;
            OrganizationEmployeeSatisfactionRatingWeightedAverage = userOrganization.Organization.EmployeeSatisfactionRatingWeightedAverage;
            OrganizationCustomerSatisfactionRatingWeightedAverage = userOrganization.Organization.CustomerSatisfactionRatingWeightedAverage;

            ResourcePoolTax = userOrganization.ResourcePoolTax;
            SalesPriceIncludingResourcePoolTax = userOrganization.SalesPriceIncludingResourcePoolTax;
            NumberOfSales = userOrganization.NumberOfSales;
            TotalProductionCost = userOrganization.TotalProductionCost;
            TotalSalesRevenue = userOrganization.TotalSalesRevenue;
            TotalProfit = userOrganization.TotalProfit;
            TotalResourcePoolTax = userOrganization.TotalResourcePoolTax;
            TotalSalesRevenueIncludingResourcePoolTax = userOrganization.TotalSalesRevenueIncludingResourcePoolTax;
            SectorIndexValueWeightedAverageWithNumberOfSales = userOrganization.SectorIndexValueWeightedAverageWithNumberOfSales;
            SectorIndexValueWeightedAverageWithNumberOfSalesWeightedAverage = userOrganization.SectorIndexValueWeightedAverageWithNumberOfSalesWeightedAverage;
            SectorIndexIncome = userOrganization.SectorIndexIncome;
            KnowledgeIndexValueWeightedAverageWithNumberOfSales = userOrganization.KnowledgeIndexValueWeightedAverageWithNumberOfSales;
            KnowledgeIndexValueWeightedAverageWithNumberOfSalesWeightedAverage = userOrganization.KnowledgeIndexValueWeightedAverageWithNumberOfSalesWeightedAverage;
            KnowledgeIndexIncome = userOrganization.KnowledgeIndexIncome;
            TotalCostIndexValueWeightedAverageWithNumberOfSales = userOrganization.TotalCostIndexValueWeightedAverageWithNumberOfSales;
            TotalCostIndexValueWeightedAverageWithNumberOfSalesWeightedAverage = userOrganization.TotalCostIndexValueWeightedAverageWithNumberOfSalesWeightedAverage;
            TotalCostIndexIncome = userOrganization.TotalCostIndexIncome;
            QualityIndexValueWeightedAverageWithNumberOfSales = userOrganization.QualityIndexValueWeightedAverageWithNumberOfSales;
            QualityIndexValueWeightedAverageWithNumberOfSalesWeightedAverage = userOrganization.QualityIndexValueWeightedAverageWithNumberOfSalesWeightedAverage;
            QualityIndexIncome = userOrganization.QualityIndexIncome;
            EmployeeSatisfactionIndexValueWeightedAverageWithNumberOfSales = userOrganization.EmployeeSatisfactionIndexValueWeightedAverageWithNumberOfSales;
            EmployeeSatisfactionIndexValueWeightedAverageWithNumberOfSalesWeightedAverage = userOrganization.EmployeeSatisfactionIndexValueWeightedAverageWithNumberOfSalesWeightedAverage;
            EmployeeSatisfactionIndexIncome = userOrganization.EmployeeSatisfactionIndexIncome;
            CustomerSatisfactionIndexValueWeightedAverageWithNumberOfSales = userOrganization.CustomerSatisfactionIndexValueWeightedAverageWithNumberOfSales;
            CustomerSatisfactionIndexValueWeightedAverageWithNumberOfSalesWeightedAverage = userOrganization.CustomerSatisfactionIndexValueWeightedAverageWithNumberOfSalesWeightedAverage;
            CustomerSatisfactionIndexIncome = userOrganization.CustomerSatisfactionIndexIncome;
            TotalResourcePoolIncome = userOrganization.TotalResourcePoolIncome;
            TotalIncome = userOrganization.TotalIncome;

            UserResourcePoolIndexOrganizationSet = userOrganization
                .UserResourcePoolIndexOrganizationSet
                .Select(item => new UserResourcePoolIndexOrganization(item));
        }

        public string OrganizationName { get; set; }
        public decimal OrganizationProductionCost { get; set; }
        public decimal OrganizationSalesPrice { get; set; }
        public decimal OrganizationProfitPercentage { get; set; }
        public string OrganizationLicenseName { get; set; }
        public decimal OrganizationSectorRatingWeightedAverage { get; set; }
        public decimal OrganizationLicenseRatingWeightedAverage { get; set; }
        public decimal OrganizationSalesPriceWeightedAverage { get; set; }
        public decimal OrganizationQualityRatingWeightedAverage { get; set; }
        public decimal OrganizationEmployeeSatisfactionRatingWeightedAverage { get; set; }
        public decimal OrganizationCustomerSatisfactionRatingWeightedAverage { get; set; }

        public decimal ResourcePoolTax { get; set; }
        public decimal SalesPriceIncludingResourcePoolTax { get; set; }
        public int NumberOfSales { get; set; }
        public decimal TotalProductionCost { get; set; }
        public decimal TotalSalesRevenue { get; set; }
        public decimal TotalProfit { get; set; }
        public decimal TotalResourcePoolTax { get; set; }
        public decimal TotalSalesRevenueIncludingResourcePoolTax { get; set; }

        public decimal SectorIndexValueWeightedAverageWithNumberOfSales { get; set; }
        public decimal SectorIndexValueWeightedAverageWithNumberOfSalesWeightedAverage { get; set; }
        public decimal SectorIndexIncome { get; set; }

        public decimal KnowledgeIndexValueWeightedAverageWithNumberOfSales { get; set; }
        public decimal KnowledgeIndexValueWeightedAverageWithNumberOfSalesWeightedAverage { get; set; }
        public decimal KnowledgeIndexIncome { get; set; }

        public decimal TotalCostIndexValueWeightedAverageWithNumberOfSales { get; set; }
        public decimal TotalCostIndexValueWeightedAverageWithNumberOfSalesWeightedAverage { get; set; }
        public decimal TotalCostIndexIncome { get; set; }

        public decimal QualityIndexValueWeightedAverageWithNumberOfSales { get; set; }
        public decimal QualityIndexValueWeightedAverageWithNumberOfSalesWeightedAverage { get; set; }
        public decimal QualityIndexIncome { get; set; }

        public decimal EmployeeSatisfactionIndexValueWeightedAverageWithNumberOfSales { get; set; }
        public decimal EmployeeSatisfactionIndexValueWeightedAverageWithNumberOfSalesWeightedAverage { get; set; }
        public decimal EmployeeSatisfactionIndexIncome { get; set; }

        public decimal CustomerSatisfactionIndexValueWeightedAverageWithNumberOfSales { get; set; }
        public decimal CustomerSatisfactionIndexValueWeightedAverageWithNumberOfSalesWeightedAverage { get; set; }
        public decimal CustomerSatisfactionIndexIncome { get; set; }

        public decimal TotalResourcePoolIncome { get; set; }
        public decimal TotalIncome { get; set; }

        public IEnumerable<UserResourcePoolIndexOrganization> UserResourcePoolIndexOrganizationSet { get; set; }
    }
}
