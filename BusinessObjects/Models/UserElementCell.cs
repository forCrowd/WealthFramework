namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using Framework;
    using System;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations.Schema;

    [DisplayName("User Element Cell")]
    public class UserElementCell : BaseEntity
    {
        [Obsolete("Parameterless constructors used in Web - Controllers. Make them private them when possible")]
        public UserElementCell()
            //: this(new User(), new ElementCell(), 0)
        { }

        public UserElementCell(User user, ElementCell elementCell, decimal rating)
        {
            Validations.ArgumentNullOrDefault(user, "user");
            Validations.ArgumentNullOrDefault(elementCell, "elementCell");

            User = user;
            ElementCell = elementCell;
            Rating = rating;
        }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        [Index("IX_UserIdElementCellId", 1, IsUnique = true)]
        public int UserId { get; set; }

        [Index("IX_UserIdElementCellId", 2, IsUnique = true)]
        public int ElementCellId { get; set; }

        public decimal Rating { get; set; }

        public virtual User User { get; set; }

        public virtual ElementCell ElementCell { get; set; }
    }
}
