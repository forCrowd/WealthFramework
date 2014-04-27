namespace BusinessObjects.Metadata
{
    using BusinessObjects.Metadata.Attributes;
    using System;
    using System.ComponentModel.DataAnnotations;

    [DefaultProperty("Name")]
    public class SectorMetadata
    {
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public object Id { get; set; }

        [Display(Name = "Sector")]
        [Required]
        [StringLength(50)]
        public object Name { get; set; }

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
