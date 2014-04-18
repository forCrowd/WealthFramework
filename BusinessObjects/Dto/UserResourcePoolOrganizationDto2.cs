namespace BusinessObjects
{
    public class UserResourcePoolOrganizationDto2
    {
        public string OrganizationName { get; set; }
        public decimal OrganizationProductionCost { get; set; }
        public decimal OrganizationSalesPrice { get; set; }
        public decimal OrganizationProfitPercentage { get; set; }
        public string OrganizationLicenseName { get; set; }

        public decimal ResourcePoolTax { get; set; }
        public decimal SalesPriceIncludingResourcePoolTax { get; set; }
        public int NumberOfSales { get; set; }
        public decimal TotalProductionCost { get; set; }
        public decimal TotalSalesRevenue { get; set; }
        public decimal TotalProfit { get; set; }
        public decimal TotalResourcePoolTax { get; set; }
        public decimal TotalSalesRevenueIncludingResourcePoolTax { get; set; }
        public decimal TotalCostIndexPercentage { get; set; }
        public decimal TotalCostIndexPercentageWithNumberOfSales { get; set; }
        public decimal TotalCostIndexPercentageWithNumberOfSalesWeighted { get; set; }
        public decimal TotalCostIndexIncome { get; set; }
        public decimal KnowledgeIndexPercentage { get; set; }
        public decimal KnowledgeIndexPercentageWithNumberOfSales { get; set; }
        public decimal KnowledgeIndexPercentageWithNumberOfSalesWeighted { get; set; }
        public decimal KnowledgeIndexIncome { get; set; }
        public decimal QualityIndexPercentage { get; set; }
        public decimal QualityIndexPercentageWithNumberOfSales { get; set; }
        public decimal QualityIndexPercentageWithNumberOfSalesWeighted { get; set; }
        public decimal QualityIndexIncome { get; set; }
        public decimal SectorIndexPercentage { get; set; }
        public decimal SectorIndexPercentageWithNumberOfSales { get; set; }
        public decimal SectorIndexPercentageWithNumberOfSalesWeighted { get; set; }
        public decimal SectorIndexIncome { get; set; }
        public decimal EmployeeSatisfactionIndexPercentage { get; set; }
        public decimal EmployeeSatisfactionIndexPercentageWithNumberOfSales { get; set; }
        public decimal EmployeeSatisfactionIndexPercentageWithNumberOfSalesWeighted { get; set; }
        public decimal EmployeeSatisfactionIndexIncome { get; set; }
        public decimal CustomerSatisfactionIndexPercentage { get; set; }
        public decimal CustomerSatisfactionIndexPercentageWithNumberOfSales { get; set; }
        public decimal CustomerSatisfactionIndexPercentageWithNumberOfSalesWeighted { get; set; }
        public decimal CustomerSatisfactionIndexIncome { get; set; }
        public decimal DistanceRating { get; set; }
        public decimal DistanceIndexPercentage { get; set; }
        public decimal DistanceIndexPercentageWithNumberOfSales { get; set; }
        public decimal DistanceIndexPercentageWithNumberOfSalesWeighted { get; set; }
        public decimal DistanceIndexIncome { get; set; }
        public decimal TotalResourcePoolIncome { get; set; }
        public decimal TotalIncome { get; set; }
    }
}
