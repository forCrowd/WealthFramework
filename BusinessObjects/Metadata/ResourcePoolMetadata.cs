namespace BusinessObjects.Metadata
{
    using BusinessObjects.Metadata.Attributes;
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [DefaultProperty("Name")]
    // [ODataControllerAuthorization("Administrator")]
    public class ResourcePoolMetadata
    {
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public object Id { get; set; }

        [Display(Name = "Resource Pool")]
        [Required]
        [StringLength(50)]
        public object Name { get; set; }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object ProductionCost { get; set; }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object SalesPrice { get; set; }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object Profit { get; set; }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object ProfitPercentage { get; set; }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [NotMapped]
        public object ProfitMargin { get; set; }

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
