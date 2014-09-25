namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    [DisplayName("Element Item Field")]
    [BusinessObjects.Attributes.DefaultProperty("Id")]
    // [ODataControllerAuthorization("Administrator")]
    public class ElementItemElementField : BaseEntity
    {
        public ElementItemElementField()
        {
            UserElementItemElementFieldSet = new HashSet<UserElementItemElementField>();
        }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        [Index("IX_ElementItemIdElementFieldId", 1, IsUnique = true)]
        public int ElementItemId { get; set; }

        [Index("IX_ElementItemIdElementFieldId", 2, IsUnique = true)]
        public int ElementFieldId { get; set; }

        public string StringValue { get; set; }
        public Nullable<bool> BooleanValue { get; set; }
        public Nullable<int> IntegerValue { get; set; }
        public Nullable<decimal> DecimalValue { get; set; }
        public Nullable<DateTime> DateTimeValue { get; set; }

        public virtual ElementItem ElementItem { get; set; }
        public virtual ElementField ElementField { get; set; }
        public virtual ICollection<UserElementItemElementField> UserElementItemElementFieldSet { get; set; }

        /* */

        public int RatingCount
        {
            get { return UserElementItemElementFieldSet.Count(); }
        }

        public decimal RatingAverage
        {
            get
            {
                return UserElementItemElementFieldSet.Any()
                    ? UserElementItemElementFieldSet.Average(item => item.Rating)
                    : 0;
            }
        }

        public decimal RatingPercentage
        {
            get
            {
                return ElementField.RatingAverage == 0
                    ? 0
                    : RatingAverage / ElementField.RatingAverage;
            }
        }
    }
}
