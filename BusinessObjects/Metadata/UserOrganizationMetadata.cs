namespace BusinessObjects.Metadata
{
    using BusinessObjects.Metadata.Attributes;
    using System;
    using System.ComponentModel.DataAnnotations;

    [DefaultProperty("Name")]
    public class UserOrganizationMetadata
    {
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public object Id { get; set; }

        [Display(Name="Number of Sales")]
        
        public string NumberOfSales { get; set; }

        [Display(Name="Quality Rating")]
        
        public string QualityRating { get; set; }

        [Display(Name="Customer Satisfaction Rating")]
        
        public string CustomerSatisfactionRating { get; set; }

        [Display(Name="Employee Satisfaction Rating")]
        
        public string EmployeeSatisfactionRating { get; set; }

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
    }
}
