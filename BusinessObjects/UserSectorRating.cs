namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using System.ComponentModel.DataAnnotations;

    public class UserSectorRating : BaseEntity
    {
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        public int UserId { get; set; }

        public short SectorId { get; set; }

        [Display(Name = "Rating")]
        public decimal Rating { get; set; }

        public virtual Sector Sector { get; set; }

        public virtual User User { get; set; }
    }
}
