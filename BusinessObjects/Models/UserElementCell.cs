namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations.Schema;

    [DisplayName("User Element Cell")]
    public class UserElementCell : BaseEntity
    {
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        [Index("IX_UserIdElementCellId", 1, IsUnique = true)]
        public string UserId { get; set; }

        [Index("IX_UserIdElementCellId", 2, IsUnique = true)]
        public int ElementCellId { get; set; }

        public decimal Rating { get; set; }

        public virtual User User { get; set; }

        public virtual ElementCell ElementCell { get; set; }
    }
}
