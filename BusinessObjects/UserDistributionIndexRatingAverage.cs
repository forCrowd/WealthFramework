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
        
        [Display(Name = "Employee Index")]
        public decimal EmployeeIndexRating { get; set; }
        
        [Display(Name = "Customer Index")]
        public decimal CustomerIndexRating { get; set; }
        
        [Display(Name = "Distance Index")]
        public decimal DistanceIndexRating { get; set; }
    }
}
