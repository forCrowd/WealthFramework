namespace BusinessObjects.Metadata
{
    using BusinessObjects.Metadata.Attributes;
    using System;
    using System.ComponentModel.DataAnnotations;

    [DefaultProperty("Name")]
    [ODataControllerAuthorization("Administrator")]
    public class LicenseMetadata
    {
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public object Id { get; set; }

        [Display(Name="License")]
        [Required]
        [StringLength(50)]
        public object Name { get; set; }

        [DisplayOnListView(false)]
        [Required]
        public object Text { get; set; }

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
