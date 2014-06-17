namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    [DefaultProperty("Name")]
    public partial class UserResourcePool : BaseEntity
    {
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        [Index("IX_UserIdResourcePoolId", 1, IsUnique = true)]
        public int UserId { get; set; }

        [Index("IX_UserIdResourcePoolId", 2, IsUnique = true)]
        public int ResourcePoolId { get; set; }

        [Display(Name = "CMRP Rate")]
        public decimal ResourcePoolRate { get; set; }

        [Display(Name = "Total Cost Index")]
        public decimal TotalCostIndexRating { get; set; }

        [Display(Name = "Knowledge Index")]
        public decimal KnowledgeIndexRating { get; set; }

        [Display(Name = "Quality Index")]
        public decimal QualityIndexRating { get; set; }

        [Display(Name = "Sector Index")]
        public decimal SectorIndexRating { get; set; }

        [Display(Name = "Employee Satisfaction Index")]
        public decimal EmployeeSatisfactionIndexRating { get; set; }

        [Display(Name = "Customer Satisfaction Index")]
        public decimal CustomerSatisfactionIndexRating { get; set; }

        [Display(Name = "Distance Index")]
        public decimal DistanceIndexRating { get; set; }

        public virtual User User { get; set; }

        public virtual ResourcePool ResourcePool { get; set; }

        #region - General -

        public string Name
        {
            get { return string.Format("{0} - {1}", User.Email, ResourcePool.Name); }
        }

        // A bit weird navigation property.
        // To prevent this (or ideally), there needs to be a foreign key between this class and UserOrganization (UserResourcePoolId on UserOrganization).
        public IEnumerable<UserOrganization> UserOrganizationSet
        {
            get
            {
                return User
                    .UserOrganizationSet
                    .Where(item => item.Organization.Sector.ResourcePool == ResourcePool);
            }
        }

        public decimal ResourcePoolRatePercentage
        {
            get { return ResourcePoolRate / 100; }
        }

        public decimal ResourcePoolTax
        {
            get { return UserOrganizationSet.Sum(item => item.ResourcePoolTax); }
        }

        public decimal SalesPriceIncludingResourcePoolTax
        {
            get { return UserOrganizationSet.Sum(item => item.SalesPriceIncludingResourcePoolTax); }
        }

        public int NumberOfSales
        {
            get { return UserOrganizationSet.Sum(item => item.NumberOfSales); }

        }
        
        public decimal TotalProductionCost
        {
            get { return UserOrganizationSet.Sum(item => item.TotalProductionCost); }
        }
        
        public decimal TotalSalesRevenue
        {
            get { return UserOrganizationSet.Sum(item => item.TotalSalesRevenue); }
        }

        public decimal TotalProfit
        {
            get { return UserOrganizationSet.Sum(item => item.TotalProfit); }
        }
        
        public decimal TotalResourcePoolTax
        {
            get { return UserOrganizationSet.Sum(item => item.TotalResourcePoolTax); }
        }
        
        public decimal TotalSalesRevenueIncludingResourcePoolTax
        {
            get { return UserOrganizationSet.Sum(item => item.TotalSalesRevenueIncludingResourcePoolTax); }
        }
        
        public decimal TotalResourcePoolIncome
        {
            get { return UserOrganizationSet.Sum(item => item.TotalResourcePoolIncome); }
        }
        
        public decimal TotalIncome
        {
            get { return UserOrganizationSet.Sum(item => item.TotalIncome); }
        }

        #endregion

        #region - Total Cost Index -
        
        public decimal TotalCostIndexRatingWeightedAverage
        {
            get
            {
                if (ResourcePool.TotalIndexRating == 0)
                    return 0;

                return TotalCostIndexRating / ResourcePool.TotalIndexRating;
            }
        }

        public decimal TotalCostIndexShare
        {
            get { return TotalResourcePoolTax * TotalCostIndexRatingWeightedAverage; }
        }
        
        public decimal TotalCostIndexPercentageWithNumberOfSales
        {
            get { return UserOrganizationSet.Sum(item => item.TotalCostIndexPercentageWithNumberOfSales); }
        }
        
        public decimal TotalCostIndexIncome
        {
            get { return UserOrganizationSet.Sum(item => item.TotalCostIndexIncome); }
        }

        #endregion

        #region - Knowledge Index -
        
        public decimal KnowledgeIndexRatingWeightedAverage
        {
            get
            {
                if (ResourcePool.TotalIndexRating == 0)
                    return 0;

                return KnowledgeIndexRating / ResourcePool.TotalIndexRating;
            }
        }
        
        public decimal KnowledgeIndexShare
        {
            get { return TotalResourcePoolTax * KnowledgeIndexRatingWeightedAverage; }
        }
        
        public decimal KnowledgeIndexPercentageWithNumberOfSales
        {
            get { return UserOrganizationSet.Sum(item => item.KnowledgeIndexPercentageWithNumberOfSales); }
        }

        public decimal KnowledgeIndexIncome
        {
            get { return UserOrganizationSet.Sum(item => item.KnowledgeIndexIncome); }
        }

        #endregion

        #region - Quality Index -

        public decimal QualityIndexRatingWeightedAverage
        {
            get
            {
                if (ResourcePool.TotalIndexRating == 0)
                    return 0;

                return QualityIndexRating / ResourcePool.TotalIndexRating;
            }
        }
        
        public decimal QualityIndexShare
        {
            get { return TotalResourcePoolTax * QualityIndexRatingWeightedAverage; }
        }
        
        public decimal QualityIndexPercentageWithNumberOfSales
        {
            get { return UserOrganizationSet.Sum(item => item.QualityIndexPercentageWithNumberOfSales); }
        }

        public decimal QualityIndexIncome
        {
            get { return UserOrganizationSet.Sum(item => item.QualityIndexIncome); }
        }

        #endregion

        #region - Sector Index -
        
        public decimal SectorIndexRatingWeightedAverage
        {
            get
            {
                if (ResourcePool.TotalIndexRating == 0)
                    return 0;

                return SectorIndexRating / ResourcePool.TotalIndexRating;
            }
        }

        public decimal SectorIndexShare
        {
            get { return TotalResourcePoolTax * SectorIndexRatingWeightedAverage; }
        }

        public decimal SectorIndexPercentageWithNumberOfSales
        {
            get { return UserOrganizationSet.Sum(item => item.SectorIndexPercentageWithNumberOfSales); }
        }

        public decimal SectorIndexIncome
        {
            get { return UserOrganizationSet.Sum(item => item.SectorIndexIncome); }
        }

        #endregion

        #region - Employee Satifaction Index -

        public decimal EmployeeSatisfactionIndexRatingWeightedAverage
        {
            get
            {
                if (ResourcePool.TotalIndexRating == 0)
                    return 0;

                return EmployeeSatisfactionIndexRating / ResourcePool.TotalIndexRating;
            }
        }

        public decimal EmployeeSatisfactionIndexShare
        {
            get { return TotalResourcePoolTax * EmployeeSatisfactionIndexRatingWeightedAverage; }
        }
        
        public decimal EmployeeSatisfactionIndexPercentageWithNumberOfSales
        {
            get { return UserOrganizationSet.Sum(item => item.EmployeeSatisfactionIndexPercentageWithNumberOfSales); }
        }

        public decimal EmployeeSatisfactionIndexIncome
        {
            get { return UserOrganizationSet.Sum(item => item.EmployeeSatisfactionIndexIncome); }
        }

        #endregion

        #region - Customer Satifaction Index -

        public decimal CustomerSatisfactionIndexRatingWeightedAverage
        {
            get
            {
                if (ResourcePool.TotalIndexRating == 0)
                    return 0;

                return CustomerSatisfactionIndexRating / ResourcePool.TotalIndexRating;
            }
        }
        
        public decimal CustomerSatisfactionIndexShare
        {
            get { return TotalResourcePoolTax * CustomerSatisfactionIndexRatingWeightedAverage; }
        }
        
        public decimal CustomerSatisfactionIndexPercentageWithNumberOfSales
        {
            get { return UserOrganizationSet.Sum(item => item.CustomerSatisfactionIndexPercentageWithNumberOfSales); }
        }
        
        public decimal CustomerSatisfactionIndexIncome
        {
            get { return UserOrganizationSet.Sum(item => item.CustomerSatisfactionIndexIncome); }
        }

        #endregion

        #region - Distance Index -

        public decimal DistanceIndexRatingWeightedAverage
        {
            get
            {
                if (ResourcePool.TotalIndexRating == 0)
                    return 0;

                return DistanceIndexRating / ResourcePool.TotalIndexRating;
            }
        }

        public decimal DistanceIndexShare
        {
            get { return TotalResourcePoolTax * DistanceIndexRatingWeightedAverage; }
        }

        public decimal DistanceRating
        {
            get { return UserOrganizationSet.Sum(item => item.DistanceRating); }
        }

        public decimal DistanceIndexPercentageWithNumberOfSales
        {
            get { return UserOrganizationSet.Sum(item => item.DistanceIndexPercentageWithNumberOfSales); }
        }

        public decimal DistanceIndexIncome
        {
            get { return UserOrganizationSet.Sum(item => item.DistanceIndexIncome); }
        }

        #endregion
    }
}
