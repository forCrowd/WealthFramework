using System.Collections.Generic;
using System.Linq;

namespace BusinessObjects.ViewModels
{
    public class UserResourcePool
    {
        public UserResourcePool() { }

        public UserResourcePool(BusinessObjects.UserResourcePool userResourcePool)
        {
            Id = userResourcePool.Id;
            ResourcePoolRate = userResourcePool.ResourcePoolRate;
            ResourcePoolRatePercentage = userResourcePool.ResourcePoolRatePercentage;
            UserResourcePoolRatingCount = userResourcePool.UserResourcePoolRatingCount;
            UserOrganizationSet = userResourcePool
                .UserOrganizationSet
                .Select(item => new UserOrganization(item));
            ResourcePoolProductionCost = userResourcePool.ResourcePool.ProductionCost;
            ResourcePoolSalesPrice = userResourcePool.ResourcePool.SalesPrice;
            SalesPriceIncludingResourcePoolTax = userResourcePool.SalesPriceIncludingResourcePoolTax;
            NumberOfSales = userResourcePool.NumberOfSales;
            TotalProfit = userResourcePool.TotalProfit;
            TotalResourcePoolTax = userResourcePool.TotalResourcePoolTax;
            TotalSalesRevenueIncludingResourcePoolTax = userResourcePool.TotalSalesRevenueIncludingResourcePoolTax;
            TotalCostIndexIncome = userResourcePool.TotalCostIndexIncome;
            KnowledgeIndexIncome = userResourcePool.KnowledgeIndexIncome;
            QualityIndexIncome = userResourcePool.QualityIndexIncome;
            SectorIndexIncome = userResourcePool.SectorIndexIncome;
            EmployeeSatisfactionIndexIncome = userResourcePool.EmployeeSatisfactionIndexIncome;
            CustomerSatisfactionIndexIncome = userResourcePool.CustomerSatisfactionIndexIncome;
            DistanceIndexIncome = userResourcePool.DistanceIndexIncome;
            TotalResourcePoolIncome = userResourcePool.TotalResourcePoolIncome;
            TotalIncome = userResourcePool.TotalIncome;
        }

        public int Id { get; set; }
        public decimal ResourcePoolRate { get; set; }
        public decimal ResourcePoolRatePercentage { get; set; }
        public int UserResourcePoolRatingCount { get; set; }
        public IEnumerable<UserOrganization> UserOrganizationSet { get; set; }
        public decimal ResourcePoolProductionCost { get; set; }
        public decimal ResourcePoolSalesPrice { get; set; }
        public decimal SalesPriceIncludingResourcePoolTax { get; set; }
        public int NumberOfSales { get; set; }
        public decimal TotalProfit { get; set; }
        public decimal TotalResourcePoolTax { get; set; }
        public decimal TotalSalesRevenueIncludingResourcePoolTax { get; set; }
        public decimal TotalCostIndexIncome { get; set; }
        public decimal KnowledgeIndexIncome { get; set; }
        public decimal QualityIndexIncome { get; set; }
        public decimal SectorIndexIncome { get; set; }
        public decimal EmployeeSatisfactionIndexIncome { get; set; }
        public decimal CustomerSatisfactionIndexIncome { get; set; }
        public decimal DistanceIndexIncome { get; set; }
        public decimal TotalResourcePoolIncome { get; set; }
        public decimal TotalIncome { get; set; }
    }
}
