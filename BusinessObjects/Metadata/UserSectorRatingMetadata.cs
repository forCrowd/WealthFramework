namespace BusinessObjects.Metadata
{
    using System;
    using System.ComponentModel.DataAnnotations;
    
    public class UserSectorRatingMetadata
    {
        [Display(Name = "User Id")]
        public object UserId { get; set; }
    
        [Display(Name = "Sector Id")]
        public object SectorId { get; set; }
    
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
