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
            UserResourcePoolRatingCount = userResourcePool.ResourcePool.UserResourcePoolSet.Count;
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
            SectorIndexShare = userResourcePool.SectorIndexShare;
            KnowledgeIndexShare = userResourcePool.KnowledgeIndexShare;
            TotalCostIndexShare = userResourcePool.TotalCostIndexShare;
            QualityIndexShare = userResourcePool.QualityIndexShare;
            EmployeeSatisfactionIndexShare = userResourcePool.EmployeeSatisfactionIndexShare;
            CustomerSatisfactionIndexShare = userResourcePool.CustomerSatisfactionIndexShare;
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
        public decimal SectorIndexShare { get; set; }
        public decimal KnowledgeIndexShare { get; set; }
        public decimal TotalCostIndexShare { get; set; }
        public decimal QualityIndexShare { get; set; }
        public decimal EmployeeSatisfactionIndexShare { get; set; }
        public decimal CustomerSatisfactionIndexShare { get; set; }
        public decimal TotalIncome { get; set; }
    }
}
