namespace forCrowd.WealthEconomy.BusinessObjects
{
    using forCrowd.WealthEconomy.BusinessObjects.Attributes;
    using forCrowd.WealthEconomy.Framework;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    [UserAware("UserId")]
    [DisplayName("User Element Field Index")]
    [forCrowd.WealthEconomy.BusinessObjects.Attributes.DefaultProperty("Id")]
    public class UserElementField : BaseEntity
    {
        [Obsolete("Parameterless constructors used by OData & EF. Make them private when possible.")]
        public UserElementField()
        { }

        public UserElementField(User user, ElementField elementField, decimal rating)
            : this()
        {
            Validations.ArgumentNullOrDefault(user, "user");
            Validations.ArgumentNullOrDefault(elementField, "elementField");

            User = user;
            ElementField = elementField;
            Rating = rating;
        }

        [Key]
        [Column(Order = 1)]
        public int UserId { get; set; }

        [Key]
        [Column(Order = 2)]
        public int ElementFieldId { get; set; }

        public decimal Rating { get; set; }

        public virtual User User { get; set; }
        public virtual ElementField ElementField { get; set; }
    }
}
