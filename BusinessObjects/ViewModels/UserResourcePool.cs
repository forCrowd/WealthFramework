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
            ResourcePoolName = userResourcePool.ResourcePool.Name;
            ResourcePoolRate = userResourcePool.ResourcePoolRate;
            ResourcePoolRatePercentage = userResourcePool.ResourcePoolRatePercentage;
            UserResourcePoolRatingCount = userResourcePool.ResourcePool.UserResourcePoolSet.Count;
            ResourcePoolIndexSet = userResourcePool
                .ResourcePool
                .ResourcePoolIndexSet
                .Select(item => new ResourcePoolIndex(item));
            UserOrganizationSet = userResourcePool
                .UserOrganizationSet
                .Select(item => new UserOrganization(item));
            //ResourcePoolProductionCost = userResourcePool.ResourcePool.ProductionCost;
            ResourcePoolSalesPrice = userResourcePool.ResourcePool.SalesPrice;
            SalesPriceIncludingResourcePoolTax = userResourcePool.SalesPriceIncludingResourcePoolTax;
            NumberOfSales = userResourcePool.NumberOfSales;
            //TotalProfit = userResourcePool.TotalProfit;
            TotalResourcePoolTax = userResourcePool.TotalResourcePoolTax;
            TotalSalesRevenueIncludingResourcePoolTax = userResourcePool.TotalSalesRevenueIncludingResourcePoolTax;
            TotalIncome = userResourcePool.TotalIncome;
        }

        public int Id { get; set; }
        public string ResourcePoolName { get; set; }
        public decimal ResourcePoolRate { get; set; }
        public decimal ResourcePoolRatePercentage { get; set; }
        public int UserResourcePoolRatingCount { get; set; }
        public IEnumerable<ResourcePoolIndex> ResourcePoolIndexSet { get; set; }
        public IEnumerable<UserOrganization> UserOrganizationSet { get; set; }
        //public decimal ResourcePoolProductionCost { get; set; }
        public decimal ResourcePoolSalesPrice { get; set; }
        public decimal SalesPriceIncludingResourcePoolTax { get; set; }
        public int NumberOfSales { get; set; }
        //public decimal TotalProfit { get; set; }
        public decimal TotalResourcePoolTax { get; set; }
        public decimal TotalSalesRevenueIncludingResourcePoolTax { get; set; }
        public decimal TotalIncome { get; set; }
    }
}
