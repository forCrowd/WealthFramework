namespace BusinessObjects.Metadata
{
    using System;
    using System.ComponentModel.DataAnnotations;
    
    public class OrganizationMetadata
    {
        [Display(Name = "Organization")]
        public object Id { get; set; }

        [Display(Name = "Sector")]
        public object SectorId { get; set; }
    
        [Display(Name = "Organization")]
        public object Name { get; set; }
    
        [Display(Name = "Production Cost")]
        public object ProductionCost { get; set; }
    
        [Display(Name = "Sales Price")]
        public object SalesPrice { get; set; }
    
        [Display(Name = "License")]
        public object LicenseId { get; set; }
    
        [Display(Name = "Created On")]
        public object CreatedOn { get; set; }
    
        [Display(Name = "Modified On")]
        public object ModifiedOn { get; set; }
    
        [Display(Name = "Deleted On")]
        public object DeletedOn { get; set; }
    }
}
