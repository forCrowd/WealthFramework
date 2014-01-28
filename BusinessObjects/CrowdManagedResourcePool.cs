namespace BusinessObjects
{
    using System;
    using System.Linq;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public class CrowdManagedResourcePool
    {
        public CrowdManagedResourcePool(ICollection<Organization> organizationSet)
        {
            OrganizationSet = organizationSet;

            foreach (var organization in OrganizationSet)
                organization.ResourcePool = this;
        }

        [Display(Name = "CMRP Percentage")]
        // TODO Make this dynamic
        public decimal CMRPPercentage
        {
            get { return 1.01M; }
        }

        public IEnumerable<Organization> OrganizationSet { get; private set; }

        public decimal ProductionCost
        {
            get { return OrganizationSet.Sum(organization => organization.ProductionCost); }
        }
        public decimal SalesPriceSum
        {
            get { return OrganizationSet.Sum(organization => organization.SalesPrice); }
        }
        public decimal SalesPriceAverage
        {
            get { return OrganizationSet.Average(organization => organization.SalesPrice); }
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

        public decimal CMRPTax
        {
            get { return OrganizationSet.Sum(organization => organization.CMRPTax); }
        }

        public decimal SalesPriceIncludingCMRPTax
        {
            get { return OrganizationSet.Sum(organization => organization.SalesPriceIncludingCMRPTax); }
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

        public decimal TotalCMRPTax
        {
            get { return OrganizationSet.Sum(organization => organization.TotalCMRPTax); }
        }

        public decimal TotalSalesRevenueIncludingCMRPTax
        {
            get { return OrganizationSet.Sum(organization => organization.TotalSalesRevenueIncludingCMRPTax); }
        }

        public decimal TotalCostIndexPercentageWithNumberOfSalesSum
        {
            get { return OrganizationSet.Sum(organization => organization.TotalCostIndexPercentageWithNumberOfSales); }
        }

        public decimal TotalCostIndexIncome
        {
            get { return OrganizationSet.Sum(organization => organization.TotalCostIndexIncome); }
        }

        public decimal TotalIncome
        {
            get { return OrganizationSet.Sum(organization => organization.TotalIncome); }
        }
    }
}
