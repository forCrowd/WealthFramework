namespace BusinessObjects
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public partial class Organization
    {
        // TODO ?
        internal CrowdManagedResourcePool ResourcePool { get; set; }

        /// <summary>
        /// a.k.a. Markup
        /// </summary>
        public decimal Profit
        {
            get { return SalesPrice - ProductionCost; }
        }

        /// <summary>
        /// a.k.a Markup percentage
        /// </summary>
        [Display(Name = "Profit Percentage")]
        public decimal ProfitPercentage
        {
            get
            {
                if (Profit == 0)
                    return 0;
                return Profit / ProductionCost;
            }
        }

        [Display(Name = "Profit Margin")]
        public decimal ProfitMargin
        {
            get
            {
                if (Profit == 0)
                    return 0;
                return Profit / SalesPrice;
            }
        }

        [Display(Name = "CMRP Tax")]
        public decimal CMRPTax
        {
            get
            {
                if (SalesPrice == 0)
                    return 0;
                if (ResourcePool == null)
                    return 0;
                return SalesPrice * ResourcePool.CMRPPercentage;
            }
        }

        [Display(Name = "Sales Price incld. CMRP Tax")]
        public decimal SalesPriceIncludingCMRPTax
        {
            get { return SalesPrice + CMRPTax; }
        }

        [Display(Name = "Total Production Cost")]
        public decimal TotalProductionCost
        {
            get { return ProductionCost * NumberOfSales; }
        }

        [Display(Name = "Total Sales Revenue")]
        public decimal TotalSalesRevenue
        {
            get { return SalesPrice * NumberOfSales; }
        }

        [Display(Name = "Total Profit")] // a.k.a TotalSalesIncome?
        public decimal TotalProfit
        {
            get { return Profit * NumberOfSales; }
        }

        [Display(Name = "Total CMRP Tax")]
        public decimal TotalCMRPTax
        {
            get { return CMRPTax * NumberOfSales; }
        }

        [Display(Name = "Total Sales Revenue incl. CMRP Tax")]
        public decimal TotalSalesRevenueIncludingCMRPTax
        {
            get { return SalesPriceIncludingCMRPTax * NumberOfSales; }
        }

        [Display(Name = "Total Cost Index Difference")]
        public decimal TotalCostIndexDifference
        {
            get
            {
                if (ResourcePool == null)
                    return 0;
                return ResourcePool.SalesPriceSum - SalesPrice;
            }
        }

        [Display(Name = "Total Cost Index Percentage")]
        public decimal TotalCostIndexPercentage
        {
            get
            {
                if (ResourcePool == null)
                    return 0;
                if (ResourcePool.SalesPriceSum == 0)
                    return 0;
                return 1 - (SalesPrice / ResourcePool.SalesPriceSum);
            }
        }

        [Display(Name = "Total Cost Index with Nr of Sales")]
        public decimal TotalCostIndexPercentageWithNumberOfSales
        {
            get { return TotalCostIndexPercentage * NumberOfSales; }
        }

        [Display(Name = "Total Cost Index with Nr of Sales Weighted")]
        public decimal TotalCostIndexPercentageWithNumberOfSalesWeighted
        {
            get
            {
                if (ResourcePool == null)
                    return 0;
                if (ResourcePool.TotalCostIndexPercentageWithNumberOfSalesSum == 0)
                    return 0;
                return TotalCostIndexPercentageWithNumberOfSales / ResourcePool.TotalCostIndexPercentageWithNumberOfSalesSum;
            }
        }

        [Display(Name = "Total Cost Index Income")]
        public decimal TotalCostIndexIncome
        {
            get
            {
                if (ResourcePool == null)
                    return 0;
                return ResourcePool.TotalCMRPTax * TotalCostIndexPercentageWithNumberOfSalesWeighted;
            }
        }

        [Display(Name = "Total Income")]
        public decimal TotalIncome
        {
            get { return TotalProfit + TotalCostIndexIncome; }
        }
    }
}
