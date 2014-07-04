namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;

    [DisplayName("User Element Item")]
    public class UserElementItem : BaseEntity
    {
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        public int UserId { get; set; }

        public int ElementItemId { get; set; }

        public decimal Rating { get; set; }

        public virtual User User { get; set; }

        public virtual ElementItem ElementItem { get; set; }
    }
}
