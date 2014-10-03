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
        public Nullable<int> SelectedElementItemId { get; set; }

        public virtual ElementItem ElementItem { get; set; }
        public virtual ElementField ElementField { get; set; }
        public virtual ElementItem SelectedElementItem { get; set; }
        public virtual ICollection<UserElementItemElementField> UserElementItemElementFieldSet { get; set; }

        /* */

        public int RatingCount
        {
            get
            {
                switch (ElementField.ElementFieldType)
                {
                    case (byte)ElementFieldType.String:
                        return UserElementItemElementFieldSet.Count();
                    case (byte)ElementFieldType.Boolean:
                    case (byte)ElementFieldType.Integer:
                    case (byte)ElementFieldType.DateTime:
                    case (byte)ElementFieldType.Decimal:
                        // There are no user level ratings for these field types
                        return 1;
                    case (byte)ElementFieldType.Element:
                        // TODO This property should never be used for this 'Element' field type?
                        return 0;
                    default:
                        throw new ArgumentOutOfRangeException();
                }
            }
        }

        public decimal RatingAverage
        {
            get
            {
                switch (ElementField.ElementFieldType)
                {
                    case (byte)ElementFieldType.String:
                        return UserElementItemElementFieldSet.Any()
                            ? UserElementItemElementFieldSet.Average(item => item.Rating)
                            : 0;
                    case (byte)ElementFieldType.Boolean:
                        return BooleanValue.HasValue ? Convert.ToDecimal(BooleanValue.Value) : 0;
                    case (byte)ElementFieldType.Integer:
                        return IntegerValue.HasValue ? Convert.ToDecimal(IntegerValue.Value) : 0;
                    case (byte)ElementFieldType.Decimal:
                        return DecimalValue.HasValue ? DecimalValue.Value : 0;
                    case (byte)ElementFieldType.DateTime:
                        return DateTimeValue.HasValue ? Convert.ToDecimal(DateTimeValue.Value.Ticks) : 0;
                    case (byte)ElementFieldType.Element:
                        // TODO This property should never be used for this 'Element' field type?
                        return 0;
                    case (byte)ElementFieldType.ResourcePool:
                        {
                            // TODO This calculation is the same as Decimal type? Are we using the types in a wrong way?
                            return DecimalValue.HasValue ? DecimalValue.Value : 0;
                        }
                    default:
                        {
                            return 0;

                            // TODO Or throw an exception?
                            //throw new ArgumentOutOfRangeException();
                        }
                }
            }
        }

        public decimal RatingAverageMultiplied
        {
            get
            {
                var mainElement = ElementItem.Element.ResourcePool.MainElement;

                if (mainElement == null || !mainElement.HasMultiplierField)
                    return RatingAverage;

                // TODO BE CAREFUL ABOUT THIS, IT ASSUMES ALL ELEMENT ITEMS HAVE THE SAME MULTIPLIER VALUE, IMPROVE LATER!
                var multiplierValue = mainElement.ElementItemSet.FirstOrDefault().MultiplierFieldItemValue;

                return multiplierValue * RatingAverage;
            }
        }

        public decimal RatingPercentage
        {
            get
            {
                return ElementField.RatingAverageMultiplied == 0
                    ? 0
                    : RatingAverageMultiplied / ElementField.RatingAverageMultiplied;
            }
        }

        public decimal ResourcePoolIndexIncome
        {
            get
            {
                if (ElementField.ResourcePoolIndex == null)
                {
                    return ElementField.ElementFieldType == (byte)ElementFieldType.Element && SelectedElementItem != null
                        ? SelectedElementItem.ResourcePoolIndexIncome
                        : 0;
                }

                var value = RatingPercentage;

                switch (ElementField.ResourcePoolIndex.RatingSortType)
                {
                    case (byte)RatingSortType.HighestToLowest:
                        /* Do nothing */
                        break;
                    case (byte)RatingSortType.LowestToHighest:
                        value = 1 - value; break;
                    default:
                        throw new ArgumentOutOfRangeException();
                }

                return ElementField.ResourcePoolIndexShare * value;
            }
        }
    }
}
