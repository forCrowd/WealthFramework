namespace BusinessObjects.Metadata
{
    using System;
    using System.ComponentModel.DataAnnotations;

    public class UserResourcePoolOrganizationMetadata
    {
        [Display(Name = "User Id")]
        public object UserId { get; set; }
    
        [Display(Name = "Resource Pool - Organization Id")]
        public object ResourcePoolOrganizationId { get; set; }

        [Display(Name = "Number of Sales")]
        public object NumberOfSales { get; set; }
    
        [Display(Name = "Quality Rating")]
        public object QualityRating { get; set; }
    
        [Display(Name = "Employee Satisfaction Rating")]
        public object EmployeeSatisfactionRating { get; set; }

        [Display(Name = "Customer Satisfaction Rating")]
        public object CustomerSatisfactionRating { get; set; }

        [Display(Name = "Created On")]
        public object CreatedOn { get; set; }
    
        [Display(Name = "Modified On")]
        public object ModifiedOn { get; set; }
    
        [Display(Name = "Deleted On")]
        public object DeletedOn { get; set; }
    }
}
