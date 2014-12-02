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

    [DisplayName("Element Cell")]
    [BusinessObjects.Attributes.DefaultProperty("Id")]
    // [ODataControllerAuthorization("Administrator")]
    public class ElementCell : BaseEntity
    {
        [Obsolete("Parameterless constructors used in Web - Controllers. Make them private them when possible")]
        public ElementCell()
            //: this(new ElementField(), new ElementItem())
        { }

        public ElementCell(ElementField field, ElementItem item)
        {
            Validations.ArgumentNullOrDefault(field, "field");
            Validations.ArgumentNullOrDefault(item, "item");

            ElementField = field;
            ElementItem = item;
            UserElementCellSet = new HashSet<UserElementCell>();
        }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        [Index("IX_ElementCellId", 1, IsUnique = true)]
        public int ElementItemId { get; set; }

        [Index("IX_ElementCellId", 2, IsUnique = true)]
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
        public virtual ICollection<UserElementCell> UserElementCellSet { get; set; }

        /* */

        public int RatingCount
        {
            get
            {
                switch (ElementField.ElementFieldType)
                {
                    case (byte)ElementFieldTypes.String:
                        return UserElementCellSet.Count();
                    case (byte)ElementFieldTypes.Boolean:
                    case (byte)ElementFieldTypes.Integer:
                    case (byte)ElementFieldTypes.DateTime:
                    case (byte)ElementFieldTypes.Decimal:
                        // There are no user level ratings for these field types
                        return 1;
                    case (byte)ElementFieldTypes.Element:
                        // TODO This property should never be used for this 'Element' field type?
                        return 0;
                    case (byte)ElementFieldTypes.ResourcePool:
                        // There are no user level ratings for these field types - same as decimal type
                        return 1;
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
                    case (byte)ElementFieldTypes.String:
                        return UserElementCellSet.Any()
                            ? UserElementCellSet.Average(item => item.Rating)
                            : 0;
                    case (byte)ElementFieldTypes.Boolean:
                        return BooleanValue.HasValue ? Convert.ToDecimal(BooleanValue.Value) : 0;
                    case (byte)ElementFieldTypes.Integer:
                        return IntegerValue.HasValue ? Convert.ToDecimal(IntegerValue.Value) : 0;
                    case (byte)ElementFieldTypes.Decimal:
                        return DecimalValue.HasValue ? DecimalValue.Value : 0;
                    case (byte)ElementFieldTypes.DateTime:
                        return DateTimeValue.HasValue ? Convert.ToDecimal(DateTimeValue.Value.Ticks) : 0;
                    case (byte)ElementFieldTypes.Element:
                        // TODO This property should never be used for this 'Element' field type?
                        return 0;
                    case (byte)ElementFieldTypes.ResourcePool:
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

                // Todo BE CAREFUL ABOUT THIS, IT ASSUMES ALL ELEMENT ITEMS HAVE THE SAME MULTIPLIER VALUE, IMPROVE LATER!
                var multiplierValue = mainElement.ElementItemSet.FirstOrDefault().MultiplierCellValue;

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
                    return ElementField.ElementFieldType == (byte)ElementFieldTypes.Element && SelectedElementItem != null
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

        #region - Methods -

        public ElementCell SetValue(string value)
        {
            StringValue = value;
            return this;
        }

        public ElementCell SetValue(bool value)
        {
            BooleanValue = value;
            return this;
        }

        public ElementCell SetValue(int value)
        {
            IntegerValue = value;
            return this;
        }

        public ElementCell SetValue(decimal value)
        {
            DecimalValue = value;
            return this;
        }

        public ElementCell SetValue(DateTime value)
        {
            DateTimeValue = value;
            return this;
        }

        public ElementCell SetValue(ElementItem value)
        {
            SelectedElementItem = value;
            return this;
        }

        public UserElementCell AddUserCell(User user, decimal rating)
        {
            Validations.ArgumentNullOrDefault(user, "user");

            if (UserElementCellSet.Any(item => item.User == user))
                throw new Exception("An element cell can't have more than one user element cell for the same user.");

            var userCell = new UserElementCell(user, this, rating);
            user.UserElementCellSet.Add(userCell);
            UserElementCellSet.Add(userCell);
            return userCell;
        }

        #endregion
    }
}
