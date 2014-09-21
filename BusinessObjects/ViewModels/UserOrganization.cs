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
            OrganizationSalesPricePercentage = userOrganization.Organization.SalesPricePercentage;

            ResourcePoolTax = userOrganization.ResourcePoolTax;
            SalesPriceIncludingResourcePoolTax = userOrganization.SalesPriceIncludingResourcePoolTax;
            NumberOfSales = userOrganization.NumberOfSales;
            TotalProductionCost = userOrganization.TotalProductionCost;
            TotalSalesRevenue = userOrganization.TotalSalesRevenue;
            TotalProfit = userOrganization.TotalProfit;
            TotalResourcePoolTax = userOrganization.TotalResourcePoolTax;
            TotalSalesRevenueIncludingResourcePoolTax = userOrganization.TotalSalesRevenueIncludingResourcePoolTax;
            IndexIncome = userOrganization.IndexIncome;
            TotalIncome = userOrganization.TotalIncome;

            UserResourcePoolIndexOrganizationSet = userOrganization
                .UserResourcePoolIndexOrganizationSet
                .Select(item => new UserResourcePoolIndexOrganization(item));
        }

        public string OrganizationName { get; set; }
        public decimal OrganizationProductionCost { get; set; }
        public decimal OrganizationSalesPrice { get; set; }
        public decimal OrganizationProfitPercentage { get; set; }
        public decimal OrganizationSalesPricePercentage { get; set; }

        public decimal ResourcePoolTax { get; set; }
        public decimal SalesPriceIncludingResourcePoolTax { get; set; }
        public int NumberOfSales { get; set; }
        public decimal TotalProductionCost { get; set; }
        public decimal TotalSalesRevenue { get; set; }
        public decimal TotalProfit { get; set; }
        public decimal TotalResourcePoolTax { get; set; }
        public decimal TotalSalesRevenueIncludingResourcePoolTax { get; set; }
        public decimal IndexIncome { get; set; }
        public decimal TotalIncome { get; set; }

        public IEnumerable<UserResourcePoolIndexOrganization> UserResourcePoolIndexOrganizationSet { get; set; }
    }
}
