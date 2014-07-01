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
            OrganizationSectorRatingPercentage = userOrganization.Organization.Sector.RatingPercentage;
            OrganizationLicenseRatingPercentage = userOrganization.Organization.License.RatingPercentage;
            OrganizationSalesPricePercentage = userOrganization.Organization.SalesPricePercentage;
            //OrganizationQualityRatingWeightedAverage = userOrganization.Organization.QualityRatingWeightedAverage;
            //OrganizationEmployeeSatisfactionRatingWeightedAverage = userOrganization.Organization.EmployeeSatisfactionRatingWeightedAverage;
            //OrganizationCustomerSatisfactionRatingWeightedAverage = userOrganization.Organization.CustomerSatisfactionRatingWeightedAverage;

            ResourcePoolTax = userOrganization.ResourcePoolTax;
            SalesPriceIncludingResourcePoolTax = userOrganization.SalesPriceIncludingResourcePoolTax;
            NumberOfSales = userOrganization.NumberOfSales;
            TotalProductionCost = userOrganization.TotalProductionCost;
            TotalSalesRevenue = userOrganization.TotalSalesRevenue;
            TotalProfit = userOrganization.TotalProfit;
            TotalResourcePoolTax = userOrganization.TotalResourcePoolTax;
            TotalSalesRevenueIncludingResourcePoolTax = userOrganization.TotalSalesRevenueIncludingResourcePoolTax;
            //SectorIndexValuePercentageWithNumberOfSales = userOrganization.SectorIndexValuePercentageWithNumberOfSales;
            //SectorIndexValuePercentageWithNumberOfSalesPercentage = userOrganization.SectorIndexValuePercentageWithNumberOfSalesPercentage;
            SectorIndexValueMultiplied = userOrganization.SectorIndexValueMultiplied;
            SectorIndexValuePercentage = userOrganization.SectorIndexValuePercentage;
            SectorIndexIncome = userOrganization.SectorIndexIncome;
            //KnowledgeIndexValuePercentageWithNumberOfSales = userOrganization.KnowledgeIndexValuePercentageWithNumberOfSales;
            //KnowledgeIndexValuePercentageWithNumberOfSalesPercentage = userOrganization.KnowledgeIndexValuePercentageWithNumberOfSalesPercentage;
            KnowledgeIndexValueMultiplied = userOrganization.KnowledgeIndexValueMultiplied;
            KnowledgeIndexValuePercentage = userOrganization.KnowledgeIndexValuePercentage;
            KnowledgeIndexIncome = userOrganization.KnowledgeIndexIncome;
            //TotalCostIndexValuePercentageWithNumberOfSales = userOrganization.TotalCostIndexValuePercentageWithNumberOfSales;
            //TotalCostIndexValuePercentageWithNumberOfSalesPercentage = userOrganization.TotalCostIndexValuePercentageWithNumberOfSalesPercentage;
            TotalCostIndexValueMultiplied = userOrganization.TotalCostIndexValueMultiplied;
            TotalCostIndexValuePercentage = userOrganization.TotalCostIndexValuePercentage;
            TotalCostIndexIncome = userOrganization.TotalCostIndexIncome;
            //QualityIndexValueWeightedAverageWithNumberOfSales = userOrganization.QualityIndexValueWeightedAverageWithNumberOfSales;
            //QualityIndexValueWeightedAverageWithNumberOfSalesWeightedAverage = userOrganization.QualityIndexValueWeightedAverageWithNumberOfSalesWeightedAverage;
            //QualityIndexIncome = userOrganization.QualityIndexIncome;
            //EmployeeSatisfactionIndexValueWeightedAverageWithNumberOfSales = userOrganization.EmployeeSatisfactionIndexValueWeightedAverageWithNumberOfSales;
            //EmployeeSatisfactionIndexValueWeightedAverageWithNumberOfSalesWeightedAverage = userOrganization.EmployeeSatisfactionIndexValueWeightedAverageWithNumberOfSalesWeightedAverage;
            //EmployeeSatisfactionIndexIncome = userOrganization.EmployeeSatisfactionIndexIncome;
            //CustomerSatisfactionIndexValueWeightedAverageWithNumberOfSales = userOrganization.CustomerSatisfactionIndexValueWeightedAverageWithNumberOfSales;
            //CustomerSatisfactionIndexValueWeightedAverageWithNumberOfSalesWeightedAverage = userOrganization.CustomerSatisfactionIndexValueWeightedAverageWithNumberOfSalesWeightedAverage;
            //CustomerSatisfactionIndexIncome = userOrganization.CustomerSatisfactionIndexIncome;
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
        public decimal OrganizationSectorRatingPercentage { get; set; }
        public decimal OrganizationLicenseRatingPercentage { get; set; }
        public decimal OrganizationSalesPricePercentage { get; set; }
        //public decimal OrganizationQualityRatingWeightedAverage { get; set; }
        //public decimal OrganizationEmployeeSatisfactionRatingWeightedAverage { get; set; }
        //public decimal OrganizationCustomerSatisfactionRatingWeightedAverage { get; set; }

        public decimal ResourcePoolTax { get; set; }
        public decimal SalesPriceIncludingResourcePoolTax { get; set; }
        public int NumberOfSales { get; set; }
        public decimal TotalProductionCost { get; set; }
        public decimal TotalSalesRevenue { get; set; }
        public decimal TotalProfit { get; set; }
        public decimal TotalResourcePoolTax { get; set; }
        public decimal TotalSalesRevenueIncludingResourcePoolTax { get; set; }

        //public decimal SectorIndexValuePercentageWithNumberOfSales { get; set; }
        //public decimal SectorIndexValuePercentageWithNumberOfSalesPercentage { get; set; }
        public decimal SectorIndexValueMultiplied { get; set; }
        public decimal SectorIndexValuePercentage { get; set; }
        public decimal SectorIndexIncome { get; set; }

        //public decimal KnowledgeIndexValuePercentageWithNumberOfSales { get; set; }
        //public decimal KnowledgeIndexValuePercentageWithNumberOfSalesPercentage { get; set; }
        public decimal KnowledgeIndexValueMultiplied { get; set; }
        public decimal KnowledgeIndexValuePercentage { get; set; }
        public decimal KnowledgeIndexIncome { get; set; }

        //public decimal TotalCostIndexValuePercentageWithNumberOfSales { get; set; }
        //public decimal TotalCostIndexValuePercentageWithNumberOfSalesPercentage { get; set; }
        public decimal TotalCostIndexValueMultiplied { get; set; }
        public decimal TotalCostIndexValuePercentage { get; set; }
        public decimal TotalCostIndexIncome { get; set; }

        //public decimal QualityIndexValueWeightedAverageWithNumberOfSales { get; set; }
        //public decimal QualityIndexValueWeightedAverageWithNumberOfSalesWeightedAverage { get; set; }
        //public decimal QualityIndexIncome { get; set; }

        //public decimal EmployeeSatisfactionIndexValueWeightedAverageWithNumberOfSales { get; set; }
        //public decimal EmployeeSatisfactionIndexValueWeightedAverageWithNumberOfSalesWeightedAverage { get; set; }
        //public decimal EmployeeSatisfactionIndexIncome { get; set; }

        //public decimal CustomerSatisfactionIndexValueWeightedAverageWithNumberOfSales { get; set; }
        //public decimal CustomerSatisfactionIndexValueWeightedAverageWithNumberOfSalesWeightedAverage { get; set; }
        //public decimal CustomerSatisfactionIndexIncome { get; set; }

        public decimal TotalResourcePoolIncome { get; set; }
        public decimal TotalIncome { get; set; }

        public IEnumerable<UserResourcePoolIndexOrganization> UserResourcePoolIndexOrganizationSet { get; set; }
    }
}
