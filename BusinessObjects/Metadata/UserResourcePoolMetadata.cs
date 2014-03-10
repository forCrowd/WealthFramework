namespace BusinessObjects.Metadata
{
    using System;
    using System.ComponentModel.DataAnnotations;

    public class UserResourcePoolMetadata
    {
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

        [Display(Name = "Created On")]
        public object CreatedOn { get; set; }

        [Display(Name = "Modified On")]
        public object ModifiedOn { get; set; }

        [Display(Name = "Deleted On")]
        public object DeletedOn { get; set; }
    }
}
