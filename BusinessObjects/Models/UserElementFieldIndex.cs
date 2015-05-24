namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using Framework;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    [UserAware("UserId")]
    [DisplayName("User Element Field Index")]
    [BusinessObjects.Attributes.DefaultProperty("Id")]
    public class UserElementFieldIndex : BaseEntity
    {
        [Obsolete("Parameterless constructors used by OData & EF. Make them private when possible.")]
        public UserElementFieldIndex()
        { }

        public UserElementFieldIndex(User user, ElementFieldIndex elementFieldIndex, decimal rating) : this()
        {
            Validations.ArgumentNullOrDefault(user, "user");
            Validations.ArgumentNullOrDefault(elementFieldIndex, "elementFieldIndex");

            User = user;
            ElementFieldIndex = elementFieldIndex;
            Rating = rating;
        }

        //[DisplayOnListView(false)]
        //[DisplayOnEditView(false)]
        //public int Id { get; set; }

        //[Index("IX_UserIdElementFieldIndexId", 1, IsUnique = true)]
        [Key]
        [Column(Order = 1)]
        public int UserId { get; set; }

        //[Index("IX_UserIdElementFieldIndexId", 2, IsUnique = true)]
        [Key]
        [Column(Order = 2)]
        public int ElementFieldIndexId { get; set; }

        public decimal Rating { get; set; }

        public virtual User User { get; set; }
        public virtual ElementFieldIndex ElementFieldIndex { get; set; }

        public string Name
        {
            get { return string.Format("{0} - {1}", User.Email, ElementFieldIndex.Name); }
        }
    }
}
