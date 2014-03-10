namespace BusinessObjects.Metadata
{
    using System;
    using System.ComponentModel.DataAnnotations;
    
    public class ResourcePoolMetadata
    {
        [Display(Name = "Resource Pool")]
        public object Name { get; set; }

        [Display(Name = "Created On")]
        public object CreatedOn { get; set; }
    
        [Display(Name = "Modified On")]
        public object ModifiedOn { get; set; }
    
        [Display(Name = "Deleted On")]
        public object DeletedOn { get; set; }
    }
}
