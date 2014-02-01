namespace BusinessObjects
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class Organization
    {
        // TODO ?
        internal ResourcePool ResourcePool { get; set; }

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
        public decimal ResourcePoolTax
        {
            get
            {
                if (SalesPrice == 0)
                    return 0;
                // TODO ?
                if (ResourcePool == null)
                    return 0;
                return SalesPrice * ResourcePool.ResourcePoolRate;
            }
        }

        [Display(Name = "Sales Price incl. CMRP Tax")]
        public decimal SalesPriceIncludingResourcePoolTax
        {
            get { return SalesPrice + ResourcePoolTax; }
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
        public decimal TotalResourcePoolTax
        {
            get { return ResourcePoolTax * NumberOfSales; }
        }

        [Display(Name = "Total Sales Revenue incl. CMRP Tax")]
        public decimal TotalSalesRevenueIncludingResourcePoolTax
        {
            get { return SalesPriceIncludingResourcePoolTax * NumberOfSales; }
        }

        [Display(Name = "Total Cost Index Difference")]
        public decimal TotalCostIndexDifference
        {
            get
            {
                // TODO ?
                if (ResourcePool == null)
                    return 0;
                return ResourcePool.SalesPrice - SalesPrice;
            }
        }

        #region - Total Cost Index -

        [Display(Name = "Total Cost Index Percentage")]
        public decimal TotalCostIndexPercentage
        {
            get
            {
                // TODO ?
                if (ResourcePool == null)
                    return 0;
                if (ResourcePool.SalesPrice == 0)
                    return 0;
                return 1 - (SalesPrice / ResourcePool.SalesPrice);
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
                // TODO ?
                if (ResourcePool == null)
                    return 0;
                if (ResourcePool.TotalCostIndexPercentageWithNumberOfSales == 0)
                    return 0;
                return TotalCostIndexPercentageWithNumberOfSales / ResourcePool.TotalCostIndexPercentageWithNumberOfSales;
            }
        }

        [Display(Name = "Total Cost Index Income")]
        public decimal TotalCostIndexIncome
        {
            get
            {
                // TODO ?
                if (ResourcePool == null)
                    return 0;
                return ResourcePool.TotalCostIndexShare * TotalCostIndexPercentageWithNumberOfSalesWeighted;
            }
        }

        #endregion

        #region - Knowledge Index -

        [Display(Name = "Knowledge Index Percentage")]
        public decimal KnowledgeIndexPercentage
        {
            get
            {
                // TODO ?
                if (ResourcePool == null)
                    return 0;
                if (ResourcePool.LicenseUserRating == 0)
                    return 0;
                return License.UserRating / ResourcePool.LicenseUserRating;
            }
        }

        [Display(Name = "Knowledge Index with Nr of Sales")]
        public decimal KnowledgeIndexPercentageWithNumberOfSales
        {
            get { return KnowledgeIndexPercentage * NumberOfSales; }
        }

        [Display(Name = "Knowledge Index with Nr of Sales Weighted")]
        public decimal KnowledgeIndexPercentageWithNumberOfSalesWeighted
        {
            get
            {
                // TODO ?
                if (ResourcePool == null)
                    return 0;
                if (ResourcePool.KnowledgeIndexPercentageWithNumberOfSales == 0)
                    return 0;
                return KnowledgeIndexPercentageWithNumberOfSales / ResourcePool.KnowledgeIndexPercentageWithNumberOfSales;
            }
        }

        [Display(Name = "Knowledge Index Income")]
        public decimal KnowledgeIndexIncome
        {
            get
            {
                // TODO ?
                if (ResourcePool == null)
                    return 0;
                return ResourcePool.KnowledgeIndexShare * KnowledgeIndexPercentageWithNumberOfSalesWeighted;
            }
        }
        
        #endregion

        #region - Quality Index -

        public decimal QualityUserRating
        {
            get
            {
                if (UserOrganizationRatingSet.Count == 0)
                    return 0;
                return UserOrganizationRatingSet.Average(rating => rating.QualityRating);
            }
        }

        [Display(Name = "Quality Index Percentage")]
        public decimal QualityIndexPercentage
        {
            get
            {
                // TODO ?
                if (ResourcePool == null)
                    return 0;
                if (ResourcePool.QualityUserRating == 0)
                    return 0;
                return QualityUserRating / ResourcePool.QualityUserRating;
            }
        }

        [Display(Name = "Quality Index with Nr of Sales")]
        public decimal QualityIndexPercentageWithNumberOfSales
        {
            get { return QualityIndexPercentage * NumberOfSales; }
        }

        [Display(Name = "Quality Index with Nr of Sales Weighted")]
        public decimal QualityIndexPercentageWithNumberOfSalesWeighted
        {
            get
            {
                // TODO ?
                if (ResourcePool == null)
                    return 0;
                if (ResourcePool.QualityIndexPercentageWithNumberOfSales == 0)
                    return 0;
                return QualityIndexPercentageWithNumberOfSales / ResourcePool.QualityIndexPercentageWithNumberOfSales;
            }
        }

        [Display(Name = "Quality Index Income")]
        public decimal QualityIndexIncome
        {
            get
            {
                // TODO ?
                if (ResourcePool == null)
                    return 0;
                return ResourcePool.QualityIndexShare * QualityIndexPercentageWithNumberOfSalesWeighted;
            }
        }

        #endregion

        #region - Sector Index -

        [Display(Name = "Sector Index Percentage")]
        public decimal SectorIndexPercentage
        {
            get
            {
                // TODO ?
                if (ResourcePool == null)
                    return 0;
                if (ResourcePool.SectorUserRating == 0)
                    return 0;
                return Sector.UserRating / ResourcePool.SectorUserRating;
            }
        }

        [Display(Name = "Sector Index with Nr of Sales")]
        public decimal SectorIndexPercentageWithNumberOfSales
        {
            get { return SectorIndexPercentage * NumberOfSales; }
        }

        [Display(Name = "Sector Index with Nr of Sales Weighted")]
        public decimal SectorIndexPercentageWithNumberOfSalesWeighted
        {
            get
            {
                // TODO ?
                if (ResourcePool == null)
                    return 0;
                if (ResourcePool.SectorIndexPercentageWithNumberOfSales == 0)
                    return 0;
                return SectorIndexPercentageWithNumberOfSales / ResourcePool.SectorIndexPercentageWithNumberOfSales;
            }
        }

        [Display(Name = "Sector Index Income")]
        public decimal SectorIndexIncome
        {
            get
            {
                // TODO ?
                if (ResourcePool == null)
                    return 0;
                return ResourcePool.SectorIndexShare * SectorIndexPercentageWithNumberOfSalesWeighted;
            }
        }

        #endregion

        #region - Employee Satisfaction Index -

        public decimal EmployeeSatisfactionUserRating
        {
            get
            {
                if (UserOrganizationRatingSet.Count == 0)
                    return 0;
                return UserOrganizationRatingSet.Average(rating => rating.EmployeeSatisfactionRating);
            }
        }

        [Display(Name = "Employee Satisfaction Index Percentage")]
        public decimal EmployeeSatisfactionIndexPercentage
        {
            get
            {
                // TODO ?
                if (ResourcePool == null)
                    return 0;
                if (ResourcePool.EmployeeSatisfactionUserRating == 0)
                    return 0;
                return EmployeeSatisfactionUserRating / ResourcePool.EmployeeSatisfactionUserRating;
            }
        }

        [Display(Name = "Employee Satisfaction Index with Nr of Sales")]
        public decimal EmployeeSatisfactionIndexPercentageWithNumberOfSales
        {
            get { return EmployeeSatisfactionIndexPercentage * NumberOfSales; }
        }

        [Display(Name = "Employee Satisfaction Index with Nr of Sales Weighted")]
        public decimal EmployeeSatisfactionIndexPercentageWithNumberOfSalesWeighted
        {
            get
            {
                // TODO ?
                if (ResourcePool == null)
                    return 0;
                if (ResourcePool.EmployeeSatisfactionIndexPercentageWithNumberOfSales == 0)
                    return 0;
                return EmployeeSatisfactionIndexPercentageWithNumberOfSales / ResourcePool.EmployeeSatisfactionIndexPercentageWithNumberOfSales;
            }
        }

        [Display(Name = "Employee Satisfaction Index Income")]
        public decimal EmployeeSatisfactionIndexIncome
        {
            get
            {
                // TODO ?
                if (ResourcePool == null)
                    return 0;
                return ResourcePool.EmployeeSatisfactionIndexShare * EmployeeSatisfactionIndexPercentageWithNumberOfSalesWeighted;
            }
        }

        #endregion

        #region - Customer Satisfaction Index -

        public decimal CustomerSatisfactionUserRating
        {
            get
            {
                if (UserOrganizationRatingSet.Count == 0)
                    return 0;
                return UserOrganizationRatingSet.Average(rating => rating.CustomerSatisfactionRating);
            }
        }

        [Display(Name = "Customer Satisfaction Index Percentage")]
        public decimal CustomerSatisfactionIndexPercentage
        {
            get
            {
                // TODO ?
                if (ResourcePool == null)
                    return 0;
                if (ResourcePool.CustomerSatisfactionUserRating == 0)
                    return 0;
                return CustomerSatisfactionUserRating / ResourcePool.CustomerSatisfactionUserRating;
            }
        }

        [Display(Name = "Customer Satisfaction Index with Nr of Sales")]
        public decimal CustomerSatisfactionIndexPercentageWithNumberOfSales
        {
            get { return CustomerSatisfactionIndexPercentage * NumberOfSales; }
        }

        [Display(Name = "Customer Satisfaction Index with Nr of Sales Weighted")]
        public decimal CustomerSatisfactionIndexPercentageWithNumberOfSalesWeighted
        {
            get
            {
                // TODO ?
                if (ResourcePool == null)
                    return 0;
                if (ResourcePool.CustomerSatisfactionIndexPercentageWithNumberOfSales == 0)
                    return 0;
                return CustomerSatisfactionIndexPercentageWithNumberOfSales / ResourcePool.CustomerSatisfactionIndexPercentageWithNumberOfSales;
            }
        }

        [Display(Name = "Customer Satisfaction Index Income")]
        public decimal CustomerSatisfactionIndexIncome
        {
            get
            {
                // TODO ?
                if (ResourcePool == null)
                    return 0;
                return ResourcePool.CustomerSatisfactionIndexShare * CustomerSatisfactionIndexPercentageWithNumberOfSalesWeighted;
            }
        }

        #endregion

        #region - Distance Index -

        /// <summary>
        /// TODO Distance Index has no calculation at the moment
        /// </summary>
        public decimal DistanceRating
        {
            get { return 1; }
        }

        [Display(Name = "Distance Index Percentage")]
        public decimal DistanceIndexPercentage
        {
            get
            {
                // TODO ?
                if (ResourcePool == null)
                    return 0;
                if (ResourcePool.DistanceRating == 0)
                    return 0;
                return DistanceRating / ResourcePool.DistanceRating;
            }
        }

        [Display(Name = "Distance Index with Nr of Sales")]
        public decimal DistanceIndexPercentageWithNumberOfSales
        {
            get { return DistanceIndexPercentage * NumberOfSales; }
        }

        [Display(Name = "Distance Index with Nr of Sales Weighted")]
        public decimal DistanceIndexPercentageWithNumberOfSalesWeighted
        {
            get
            {
                // TODO ?
                if (ResourcePool == null)
                    return 0;
                if (ResourcePool.DistanceIndexPercentageWithNumberOfSales == 0)
                    return 0;
                return DistanceIndexPercentageWithNumberOfSales / ResourcePool.DistanceIndexPercentageWithNumberOfSales;
            }
        }

        [Display(Name = "Distance Index Income")]
        public decimal DistanceIndexIncome
        {
            get
            {
                // TODO ?
                if (ResourcePool == null)
                    return 0;
                return ResourcePool.DistanceIndexShare * DistanceIndexPercentageWithNumberOfSalesWeighted;
            }
        }

        #endregion

        [Display(Name="Total CMRP Income")]
        public decimal TotalResourcePoolIncome
        {
            get
            {
                return TotalCostIndexIncome
                    + KnowledgeIndexIncome
                    + QualityIndexIncome
                    + SectorIndexIncome
                    + EmployeeSatisfactionIndexIncome
                    + CustomerSatisfactionIndexIncome
                    + DistanceIndexIncome;
            }
        }

        [Display(Name = "Total Income")]
        public decimal TotalIncome
        {
            get { return TotalProfit + TotalResourcePoolIncome; }
        }
    }
}
