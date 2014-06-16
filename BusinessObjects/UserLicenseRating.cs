namespace BusinessObjects
{
    using BusinessObjects.Metadata.Attributes;
    using System.ComponentModel.DataAnnotations;

    [DefaultProperty("Name")]
    public partial class UserLicenseRating : BaseEntity
    {
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        public int UserId { get; set; }

        public short LicenseId { get; set; }

        [Display(Name = "Rating")]
        public decimal Rating { get; set; }
        
        public virtual License License { get; set; }
        
        public virtual User User { get; set; }
    }
}
