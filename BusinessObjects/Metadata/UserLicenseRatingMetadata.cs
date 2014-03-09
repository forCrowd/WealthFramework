namespace BusinessObjects.Metadata
{
    using System;
    using System.ComponentModel.DataAnnotations;

    public class UserLicenseRatingMetadata
    {
        [Display(Name = "User Id")]
        public object UserId { get; set; }
    
        [Display(Name = "License Id")]
        public object LicenseId { get; set; }
    
        [Display(Name = "Rating")]
        public object Rating { get; set; }
    
        [Display(Name = "Created On")]
        public object CreatedOn { get; set; }
    
        [Display(Name = "Modified On")]
        public object ModifiedOn { get; set; }
    
        [Display(Name = "Deleted On")]
        public object DeletedOn { get; set; }
    }
}
