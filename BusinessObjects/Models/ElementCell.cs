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
        [Obsolete("Parameterless constructors used by OData & EF. Make them private when possible.")]
        public ElementCell()
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
        public bool? BooleanValue { get; set; }
        public int? IntegerValue { get; set; }
        public decimal? DecimalValue { get; set; }
        public DateTime? DateTimeValue { get; set; }
        public int? SelectedElementItemId { get; set; }

        public virtual ElementItem ElementItem { get; set; }
        public virtual ElementField ElementField { get; set; }
        public virtual ElementItem SelectedElementItem { get; set; }
        public virtual ICollection<UserElementCell> UserElementCellSet { get; set; }

        /* */

        public decimal Rating
        {
            get
            {
                var fieldType = (ElementFieldTypes)ElementField.ElementFieldType;

                switch (fieldType)
                {
                    case ElementFieldTypes.Boolean:
                        return Convert.ToDecimal(BooleanValue.GetValueOrDefault());
                    case ElementFieldTypes.Integer:
                        return Convert.ToDecimal(IntegerValue.GetValueOrDefault());
                    case ElementFieldTypes.Decimal:
                    // TODO This calculation is the same as Decimal type? Are we using the types in a wrong way?
                    case ElementFieldTypes.ResourcePool:
                    case ElementFieldTypes.Multiplier:
                        return DecimalValue.GetValueOrDefault();
                    case ElementFieldTypes.DateTime:
                        // TODO Check GetValueOrDefault() method for this type
                        return Convert.ToDecimal(DateTimeValue.GetValueOrDefault());
                    case ElementFieldTypes.String:
                    case ElementFieldTypes.Element:
                        // TODO At least for now
                        throw new InvalidOperationException("Rating property is not available for this field type");
                    default:
                        throw new ArgumentOutOfRangeException();
                }
            }
        }

        public int RatingCount
        {
            get
            {
                var fieldType = (ElementFieldTypes)ElementField.ElementFieldType;

                switch (fieldType)
                {
                    case ElementFieldTypes.Boolean:
                    case ElementFieldTypes.Integer:
                    case ElementFieldTypes.DateTime:
                    case ElementFieldTypes.Decimal:
                    // TODO This calculation is the same as Decimal type? Are we using the types in a wrong way?
                    case ElementFieldTypes.ResourcePool:
                    case ElementFieldTypes.Multiplier:
                        return ElementField.FixedValue
                            ? 1
                            : UserElementCellSet.Count();
                    case ElementFieldTypes.String:
                    case ElementFieldTypes.Element:
                        // TODO At least for now
                        throw new InvalidOperationException("RatingCount property is not available for this field type");
                    default:
                        throw new ArgumentOutOfRangeException();
                }
            }
        }

        public decimal RatingAverage
        {
            get
            {
                var fieldType = (ElementFieldTypes)ElementField.ElementFieldType;

                switch (fieldType)
                {
                    case ElementFieldTypes.Boolean:
                    case ElementFieldTypes.Integer:
                    case ElementFieldTypes.Decimal:
                    case ElementFieldTypes.DateTime:
                    // TODO This calculation is the same as Decimal type? Are we using the types in a wrong way?
                    case ElementFieldTypes.ResourcePool:
                    case ElementFieldTypes.Multiplier:
                        {
                            return ElementField.FixedValue
                                ? Rating
                                : UserElementCellSet.Any()
                                ? UserElementCellSet.Average(item => item.Rating)
                                : 0;
                        }
                    case ElementFieldTypes.String:
                    case ElementFieldTypes.Element:
                        // TODO At least for now
                        throw new InvalidOperationException("RatingAverage property is not available for this field type");
                    default:
                        throw new ArgumentOutOfRangeException();
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

        public decimal ElementFieldIndexIncome
        {
            get
            {
                if (ElementField.ElementFieldIndex == null)
                {
                    return ElementField.ElementFieldType == (byte)ElementFieldTypes.Element && SelectedElementItem != null
                        ? SelectedElementItem.ElementFieldIndexIncome
                        : 0;
                }

                var value = RatingPercentage;

                switch (ElementField.ElementFieldIndex.RatingSortType)
                {
                    case (byte)RatingSortType.HighestToLowest:
                        /* Do nothing */
                        break;
                    case (byte)RatingSortType.LowestToHighest:
                        value = 1 - value; break;
                    default:
                        throw new ArgumentOutOfRangeException();
                }

                return ElementField.ElementFieldIndexShare * value;
            }
        }

        #region - Methods -

        public ElementCell SetValue(string value)
        {
            StringValue = value;
            return this;
        }

        public ElementCell SetValue(bool? value)
        {
            BooleanValue = value;
            return this;
        }

        public ElementCell SetValue(int? value)
        {
            IntegerValue = value;
            return this;
        }

        public ElementCell SetValue(decimal? value)
        {
            DecimalValue = value;
            return this;
        }

        public ElementCell SetValue(DateTime? value)
        {
            DateTimeValue = value;
            return this;
        }

        public ElementCell SetValue(ElementItem value)
        {
            SelectedElementItem = value;
            return this;
        }

        public UserElementCell AddUserCell(User user)
        {
            Validations.ArgumentNullOrDefault(user, "user");

            if (UserElementCellSet.Any(item => item.User == user))
                throw new Exception("An element cell can't have more than one user element cell for the same user.");

            var userCell = new UserElementCell(user, this);
            user.UserElementCellSet.Add(userCell);
            UserElementCellSet.Add(userCell);
            return userCell;
        }

        #endregion
    }
}
