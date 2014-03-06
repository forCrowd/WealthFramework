namespace BusinessObjects
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class UserOrganizationRating
    {
        [Display(Name = "Total Production Cost")]
        public decimal TotalProductionCost
        {
            get
            {
                if (Organization == null)
                    return 0;
                return Organization.ProductionCost * NumberOfSales;
            }
        }

        [Display(Name = "Total Sales Revenue")]
        public decimal TotalSalesRevenue
        {
            get
            {
                if (Organization == null)
                    return 0;
                return Organization.SalesPrice * NumberOfSales;
            }
        }

        [Display(Name = "Total Profit")] // a.k.a TotalSalesIncome?
        public decimal TotalProfit
        {
            get
            {
                if (Organization == null)
                    return 0;
                return Organization.Profit * NumberOfSales;
            }
        }

        [Display(Name = "Total CMRP Tax")]
        public decimal TotalResourcePoolTax
        {
            get
            {
                if (Organization == null)
                    return 0;
                return Organization.ResourcePoolTax * NumberOfSales;
            }
        }

        [Display(Name = "Total Sales Revenue incl. CMRP Tax")]
        public decimal TotalSalesRevenueIncludingResourcePoolTax
        {
            get
            {
                if (Organization == null)
                    return 0;
                return Organization.SalesPriceIncludingResourcePoolTax * NumberOfSales;
            }
        }

        #region - Total Cost Index -

        [Display(Name = "Total Cost Index with Nr of Sales")]
        public decimal TotalCostIndexPercentageWithNumberOfSales
        {
            get
            {
                if (Organization == null)
                    return 0;
                return Organization.TotalCostIndexPercentage * NumberOfSales;
            }
        }

        [Display(Name = "Total Cost Index with Nr of Sales Weighted")]
        public decimal TotalCostIndexPercentageWithNumberOfSalesWeighted
        {
            get
            {
                // TODO ?
                if (Organization == null)
                    return 0;
                if (Organization.ResourcePool == null)
                    return 0;
                if (Organization.ResourcePool.TotalCostIndexPercentageWithNumberOfSales == 0)
                    return 0;
                return TotalCostIndexPercentageWithNumberOfSales / Organization.ResourcePool.TotalCostIndexPercentageWithNumberOfSales;
            }
        }

        [Display(Name = "Total Cost Index Income")]
        public decimal TotalCostIndexIncome
        {
            get
            {
                // TODO ?
                if (Organization == null)
                    return 0;
                if (Organization.ResourcePool == null)
                    return 0;
                return Organization.ResourcePool.TotalCostIndexShare * TotalCostIndexPercentageWithNumberOfSalesWeighted;
            }
        }

        #endregion

        #region - Knowledge Index -

        [Display(Name = "Knowledge Index with Nr of Sales")]
        public decimal KnowledgeIndexPercentageWithNumberOfSales
        {
            get
            {
                if (Organization == null)
                    return 0;
                return Organization.KnowledgeIndexPercentage * NumberOfSales;
            }
        }

        [Display(Name = "Knowledge Index with Nr of Sales Weighted")]
        public decimal KnowledgeIndexPercentageWithNumberOfSalesWeighted
        {
            get
            {
                // TODO ?
                if (Organization == null)
                    return 0;
                if (Organization.ResourcePool == null)
                    return 0;
                if (Organization.ResourcePool.KnowledgeIndexPercentageWithNumberOfSales == 0)
                    return 0;
                return KnowledgeIndexPercentageWithNumberOfSales / Organization.ResourcePool.KnowledgeIndexPercentageWithNumberOfSales;
            }
        }

        [Display(Name = "Knowledge Index Income")]
        public decimal KnowledgeIndexIncome
        {
            get
            {
                // TODO ?
                if (Organization == null)
                    return 0;
                if (Organization.ResourcePool == null)
                    return 0;
                return Organization.ResourcePool.KnowledgeIndexShare * KnowledgeIndexPercentageWithNumberOfSalesWeighted;
            }
        }

        #endregion

        #region - Quality Index -

        [Display(Name = "Quality Index with Nr of Sales")]
        public decimal QualityIndexPercentageWithNumberOfSales
        {
            get
            {
                if (Organization == null)
                    return 0;
                return Organization.QualityIndexPercentage * NumberOfSales;
            }
        }

        [Display(Name = "Quality Index with Nr of Sales Weighted")]
        public decimal QualityIndexPercentageWithNumberOfSalesWeighted
        {
            get
            {
                // TODO ?
                if (Organization == null)
                    return 0;
                if (Organization.ResourcePool == null)
                    return 0;
                if (Organization.ResourcePool.QualityIndexPercentageWithNumberOfSales == 0)
                    return 0;
                return QualityIndexPercentageWithNumberOfSales / Organization.ResourcePool.QualityIndexPercentageWithNumberOfSales;
            }
        }

        [Display(Name = "Quality Index Income")]
        public decimal QualityIndexIncome
        {
            get
            {
                // TODO ?
                if (Organization == null)
                    return 0;
                if (Organization.ResourcePool == null)
                    return 0;
                return Organization.ResourcePool.QualityIndexShare * QualityIndexPercentageWithNumberOfSalesWeighted;
            }
        }

        #endregion

        #region - Sector Index -

        [Display(Name = "Sector Index with Nr of Sales")]
        public decimal SectorIndexPercentageWithNumberOfSales
        {
            get
            {
                if (Organization == null)
                    return 0;
                return Organization.SectorIndexPercentage * NumberOfSales;
            }
        }

        [Display(Name = "Sector Index with Nr of Sales Weighted")]
        public decimal SectorIndexPercentageWithNumberOfSalesWeighted
        {
            get
            {
                // TODO ?
                if (Organization == null)
                    return 0;
                if (Organization.ResourcePool == null)
                    return 0;
                if (Organization.ResourcePool.SectorIndexPercentageWithNumberOfSales == 0)
                    return 0;
                return SectorIndexPercentageWithNumberOfSales / Organization.ResourcePool.SectorIndexPercentageWithNumberOfSales;
            }
        }

        [Display(Name = "Sector Index Income")]
        public decimal SectorIndexIncome
        {
            get
            {
                // TODO ?
                if (Organization == null)
                    return 0;
                if (Organization.ResourcePool == null)
                    return 0;
                return Organization.ResourcePool.SectorIndexShare * SectorIndexPercentageWithNumberOfSalesWeighted;
            }
        }

        #endregion

        #region - Employee Satisfaction Index -

        [Display(Name = "Employee Satisfaction Index with Nr of Sales")]
        public decimal EmployeeSatisfactionIndexPercentageWithNumberOfSales
        {
            get
            {
                if (Organization == null)
                    return 0;
                return Organization.EmployeeSatisfactionIndexPercentage * NumberOfSales;
            }
        }

        [Display(Name = "Employee Satisfaction Index with Nr of Sales Weighted")]
        public decimal EmployeeSatisfactionIndexPercentageWithNumberOfSalesWeighted
        {
            get
            {
                // TODO ?
                if (Organization == null)
                    return 0;
                if (Organization.ResourcePool == null)
                    return 0;
                if (Organization.ResourcePool.EmployeeSatisfactionIndexPercentageWithNumberOfSales == 0)
                    return 0;
                return EmployeeSatisfactionIndexPercentageWithNumberOfSales / Organization.ResourcePool.EmployeeSatisfactionIndexPercentageWithNumberOfSales;
            }
        }

        [Display(Name = "Employee Satisfaction Index Income")]
        public decimal EmployeeSatisfactionIndexIncome
        {
            get
            {
                // TODO ?
                if (Organization == null)
                    return 0;
                if (Organization.ResourcePool == null)
                    return 0;
                return Organization.ResourcePool.EmployeeSatisfactionIndexShare * EmployeeSatisfactionIndexPercentageWithNumberOfSalesWeighted;
            }
        }

        #endregion

        #region - Customer Satisfaction Index -

        [Display(Name = "Customer Satisfaction Index with Nr of Sales")]
        public decimal CustomerSatisfactionIndexPercentageWithNumberOfSales
        {
            get
            {
                if (Organization == null)
                    return 0;
                return Organization.CustomerSatisfactionIndexPercentage * NumberOfSales;
            }
        }

        [Display(Name = "Customer Satisfaction Index with Nr of Sales Weighted")]
        public decimal CustomerSatisfactionIndexPercentageWithNumberOfSalesWeighted
        {
            get
            {
                // TODO ?
                if (Organization == null)
                    return 0;
                if (Organization.ResourcePool == null)
                    return 0;
                if (Organization.ResourcePool.CustomerSatisfactionIndexPercentageWithNumberOfSales == 0)
                    return 0;
                return CustomerSatisfactionIndexPercentageWithNumberOfSales / Organization.ResourcePool.CustomerSatisfactionIndexPercentageWithNumberOfSales;
            }
        }

        [Display(Name = "Customer Satisfaction Index Income")]
        public decimal CustomerSatisfactionIndexIncome
        {
            get
            {
                // TODO ?
                if (Organization == null)
                    return 0;
                if (Organization.ResourcePool == null)
                    return 0;
                return Organization.ResourcePool.CustomerSatisfactionIndexShare * CustomerSatisfactionIndexPercentageWithNumberOfSalesWeighted;
            }
        }

        #endregion

        #region - Distance Index -

        [Display(Name = "Distance Index with Nr of Sales")]
        public decimal DistanceIndexPercentageWithNumberOfSales
        {
            get
            {
                if (Organization == null)
                    return 0;
                return Organization.DistanceIndexPercentage * NumberOfSales;
            }
        }

        [Display(Name = "Distance Index with Nr of Sales Weighted")]
        public decimal DistanceIndexPercentageWithNumberOfSalesWeighted
        {
            get
            {
                // TODO ?
                if (Organization == null)
                    return 0;
                if (Organization.ResourcePool == null)
                    return 0;
                if (Organization.ResourcePool.DistanceIndexPercentageWithNumberOfSales == 0)
                    return 0;
                return DistanceIndexPercentageWithNumberOfSales / Organization.ResourcePool.DistanceIndexPercentageWithNumberOfSales;
            }
        }

        [Display(Name = "Distance Index Income")]
        public decimal DistanceIndexIncome
        {
            get
            {
                // TODO ?
                if (Organization == null)
                    return 0;
                if (Organization.ResourcePool == null)
                    return 0;
                return Organization.ResourcePool.DistanceIndexShare * DistanceIndexPercentageWithNumberOfSalesWeighted;
            }
        }

        #endregion

        [Display(Name = "Total CMRP Income")]
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
