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
                        return 1; // There are no user level ratings
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

        public decimal RatingPercentage
        {
            get
            {
                return ElementField.RatingAverage == 0
                    ? 0
                    : RatingAverage / ElementField.RatingAverage;
            }
        }

        public decimal RatingPercentageMultiplied
        {
            get
            {
                var mainElement = ElementItem.Element.ResourcePool.MainElement;

                if (!mainElement.HasMultiplierField)
                    return 0;

                // TODO BE CAREFUL ABOUT THIS, IT ASSUMES ALL ELEMENT ITEMS HAVE THE SAME MULTIPLIER VALUE, IMPROVE LATER!
                var multiplierValue = mainElement.ElementItemSet.FirstOrDefault().MultiplierFieldItemValue;

                return multiplierValue * RatingPercentage;
            }
        }

        public decimal RatingPercentageMultipliedPercentage
        {
            get
            {
                return ElementField.RatingPercentageMultiplied == 0
                    ? 0
                    : RatingPercentageMultiplied / ElementField.RatingPercentageMultiplied;
            }
        }

        public decimal ResourcePoolIndexIncome
        {
            get
            {
                if (ElementField.ResourcePoolIndex == null)
                    return 0;

                var value = RatingPercentageMultipliedPercentage;

                switch (ElementField.ResourcePoolIndex.RatingSortType)
                {
                    case (byte)RatingSortType.HighestToLowest:
                        /* Do nothing */ break;
                    case (byte)RatingSortType.LowestToHighest:
                        value = 1 - value; break;
                    default:
                        throw new ArgumentOutOfRangeException();
                }

                return ElementField.ResourcePoolIndexShare * value;
            }
        }

        //public decimal ResourcePoolAddition
        //{
        //    get
        //    {
        //        // TODO Is it correct to throw an exception over here? How about serialization?

        //        //if (!ElementField.IsResourcePoolField)
        //        //    throw new ArgumentException("Invalid element field: IsResourcePoolField = false", "elementItemElementField");

        //        //if (ElementField.ElementFieldType != (byte)ElementFieldType.Decimal)
        //        //    throw new ArgumentException(string.Format("Invalid element field type: {0}", ElementField.ElementFieldType), "elementItemElementField");

        //        return DecimalValue.HasValue
        //            ? DecimalValue.Value * ElementField.Element.ResourcePool.ResourcePoolRatePercentage
        //            : 0;
        //    }
        //}

        //public decimal ValueIncludingResourcePoolAddition
        //{
        //    get
        //    {
        //        return DecimalValue.HasValue
        //            ? DecimalValue.Value + ResourcePoolAddition
        //            : 0;
        //    }
        //}
    }
}
