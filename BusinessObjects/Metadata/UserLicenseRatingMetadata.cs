namespace BusinessObjects.Metadata
{
    using BusinessObjects.Metadata.Attributes;
    using System;
    using System.ComponentModel.DataAnnotations;

    [DefaultProperty("Name")]
    public class UserLicenseRatingMetadata
    {
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public object Id { get; set; }

        [Display(Name = "User Id")]
        public object UserId { get; set; }
    
        [Display(Name = "License Id")]
        public object LicenseId { get; set; }
    
        [Display(Name = "Rating")]
        
        public object Rating { get; set; }

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
