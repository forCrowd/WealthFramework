namespace BusinessObjects
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    public class UserDistributionIndexRatingAverage
    {
        // TODO Get the parameters by constructor?
        
        [Display(Name = "Rating Count")]
        public int RatingCount { get; set; }

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

        [Display(Name="Total Index Rating")]
        public decimal TotalIndexRating
        {
            get
            {
                return TotalCostIndexRating
                    + KnowledgeIndexRating
                    + QualityIndexRating
                    + SectorIndexRating
                    + EmployeeSatisfactionIndexRating
                    + CustomerSatisfactionIndexRating
                    + DistanceIndexRating;
            }
        }

        [Display(Name = "Total Cost Index Weighted Average")]
        public decimal TotalCostIndexRatingWeightedAverage
        {
            get
            {
                if (TotalIndexRating == 0)
                    return 0;
                return TotalCostIndexRating / TotalIndexRating;
            }
        }

        [Display(Name = "Knowledge Index Weighted Average")]
        public decimal KnowledgeIndexRatingWeightedAverage
        {
            get
            {
                if (TotalIndexRating == 0)
                    return 0;
                return KnowledgeIndexRating / TotalIndexRating;
            }
        }

        [Display(Name = "Quality Index Weighted Average")]
        public decimal QualityIndexRatingWeightedAverage
        {
            get
            {
                if (TotalIndexRating == 0)
                    return 0;
                return QualityIndexRating / TotalIndexRating;
            }
        }

        [Display(Name = "Sector Index Weighted Average")]
        public decimal SectorIndexRatingWeightedAverage
        {
            get
            {
                if (TotalIndexRating == 0)
                    return 0;
                return SectorIndexRating / TotalIndexRating;
            }
        }

        [Display(Name = "Employee Satisfaction Index Weighted Average")]
        public decimal EmployeeSatisfactionIndexRatingWeightedAverage
        {
            get
            {
                if (TotalIndexRating == 0)
                    return 0;
                return EmployeeSatisfactionIndexRating / TotalIndexRating;
            }
        }

        [Display(Name = "Customer Satisfaction Index Weighted Average")]
        public decimal CustomerSatisfactionIndexRatingWeightedAverage
        {
            get
            {
                if (TotalIndexRating == 0)
                    return 0;
                return CustomerSatisfactionIndexRating / TotalIndexRating;
            }
        }

        [Display(Name = "Distance Index Weighted Average")]
        public decimal DistanceIndexRatingWeightedAverage
        {
            get
            {
                if (TotalIndexRating == 0)
                    return 0;
                return DistanceIndexRating / TotalIndexRating;
            }
        }
    }
}
