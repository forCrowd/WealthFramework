namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations.Schema;

    [DisplayName("User Element Item Element Field")]
    public class UserElementItemElementField : BaseEntity
    {
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        [Index("IX_UserIdElementItemElementFieldId", 1, IsUnique = true)]
        public int UserId { get; set; }

        [Index("IX_UserIdElementItemElementFieldId", 2, IsUnique = true)]
        public int ElementItemElementFieldId { get; set; }

        public decimal Rating { get; set; }

        public virtual User User { get; set; }

        public virtual ElementItemElementField ElementItemElementField { get; set; }
    }
}
