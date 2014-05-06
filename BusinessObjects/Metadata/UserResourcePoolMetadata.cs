namespace BusinessObjects.Metadata
{
    using BusinessObjects.Metadata.Attributes;
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [DefaultProperty("Name")]
    public class UserResourcePoolMetadata
    {
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public object Id { get; set; }

        [Display(Name = "User Id")]
        public object UserId { get; set; }

        [Display(Name = "Resource Pool Id")]
        public object ResourcePoolId { get; set; }

        [Display(Name = "CMRP Rate")]
        
        public object ResourcePoolRate { get; set; }

        [Display(Name = "Total Cost Index")]
        
        public object TotalCostIndexRating { get; set; }

        [Display(Name = "Knowledge Index")]
        
        public object KnowledgeIndexRating { get; set; }

        [Display(Name = "Quality Index")]
        
        public object QualityIndexRating { get; set; }

        [Display(Name = "Sector Index")]
        
        public object SectorIndexRating { get; set; }

        [Display(Name = "Employee Satisfaction Index")]
        
        public object EmployeeSatisfactionIndexRating { get; set; }

        [Display(Name = "Customer Satisfaction Index")]
        
        public object CustomerSatisfactionIndexRating { get; set; }

        [Display(Name = "Distance Index")]
        
        public object DistanceIndexRating { get; set; }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object UserResourcePoolType { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object UserResourcePoolRatingCount { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object ResourcePoolRatePercentage { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object TotalCostIndexRatingAverage { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object KnowledgeIndexRatingAverage { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object QualityIndexRatingAverage { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object SectorIndexRatingAverage { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object EmployeeSatisfactionIndexRatingAverage { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object CustomerSatisfactionIndexRatingAverage { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object DistanceIndexRatingAverage { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object TotalIndexRating { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object TotalCostIndexRatingWeightedAverage { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object KnowledgeIndexRatingWeightedAverage { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object QualityIndexRatingWeightedAverage { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object SectorIndexRatingWeightedAverage { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object EmployeeSatisfactionIndexRatingWeightedAverage { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object CustomerSatisfactionIndexRatingWeightedAverage { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object DistanceIndexRatingWeightedAverage { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object ResourcePoolTax { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object SalesPriceIncludingResourcePoolTax { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object NumberOfSales { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object TotalProductionCost { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object TotalSalesRevenue { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object TotalProfit { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object TotalResourcePoolTax { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object TotalSalesRevenueIncludingResourcePoolTax { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object TotalCostIndexShare { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object TotalCostIndexPercentageWithNumberOfSales { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object TotalCostIndexIncome { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object KnowledgeIndexShare { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object LicenseUserRating { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object KnowledgeIndexPercentageWithNumberOfSales { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object KnowledgeIndexIncome { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object QualityIndexShare { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object QualityUserRating { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object QualityIndexPercentageWithNumberOfSales { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object QualityIndexIncome { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object SectorIndexShare { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object SectorUserRating { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object SectorIndexIncome { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object EmployeeSatisfactionIndexShare { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object EmployeeSatisfactionUserRating { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object EmployeeSatisfactionIndexPercentageWithNumberOfSales { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object EmployeeSatisfactionIndexIncome { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object CustomerSatisfactionIndexShare { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object CustomerSatisfactionUserRating { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object CustomerSatisfactionIndexPercentageWithNumberOfSales { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object CustomerSatisfactionIndexIncome { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object DistanceIndexShare { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object DistanceRating { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object DistanceIndexPercentageWithNumberOfSales { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object DistanceIndexIncome { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object TotalResourcePoolIncome { get; set; }
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object TotalIncome { get; set; }

        [Display(Name = "Created On")]
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public object CreatedOn { get; set; }

        [Display(Name = "Modified On")]
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public object ModifiedOn { get; set; }

        [Display(Name = "Deleted On")]
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public object DeletedOn { get; set; }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public object RowVersion { get; set; }
    }
}
