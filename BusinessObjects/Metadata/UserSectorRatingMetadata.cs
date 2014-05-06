namespace BusinessObjects.Metadata
{
    using BusinessObjects.Metadata.Attributes;
    using System;
    using System.ComponentModel.DataAnnotations;
    
    public class UserSectorRatingMetadata
    {
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public object Id { get; set; }

        [Display(Name = "User Id")]
        public object UserId { get; set; }
    
        [Display(Name = "Sector Id")]
        public object SectorId { get; set; }
    
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

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public object RowVersion { get; set; }
    }
}
