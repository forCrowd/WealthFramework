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
        {
            UserElementCellSet = new HashSet<UserElementCell>();
        }

        public ElementCell(ElementField field, ElementItem item)
            : this()
        {
            Validations.ArgumentNullOrDefault(field, "field");
            Validations.ArgumentNullOrDefault(item, "item");

            ElementField = field;
            ElementItem = item;
        }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [Display(Name = "Element Cell Id")]
        public int Id { get; set; }

        [Index("IX_ElementCellId", 1, IsUnique = true)]
        public int ElementItemId { get; set; }

        [Index("IX_ElementCellId", 2, IsUnique = true)]
        public int ElementFieldId { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public string StringValue { get; private set; }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public decimal? NumericValue { get; private set; }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public int? NumericValueCount { get; private set; }

        /// <summary>
        /// In case this cell's field type is Element, this is the selected item for this cell.
        /// Other values are stored on UserElementCell, but since this one has FK, it's directly set on ElementCell.
        /// </summary>
        [Display(Name = "Selected Element Item")]
        public int? SelectedElementItemId { get; set; }

        public virtual ElementItem ElementItem { get; set; }
        public virtual ElementField ElementField { get; set; }
        public virtual ElementItem SelectedElementItem { get; set; }
        public virtual ICollection<UserElementCell> UserElementCellSet { get; set; }

        public UserElementCell UserElementCell
        {
            get { return UserElementCellSet.SingleOrDefault(); }
        }

        public decimal? OtherUsersNumericValueTotal
        {
            get
            {
                if (!NumericValue.HasValue)
                    return null;

                var average = NumericValue.Value;
                var count = NumericValueCount.GetValueOrDefault(0);
                var total = average * count;

                if (UserElementCell != null)
                {
                    var fieldType = (ElementFieldTypes)ElementField.ElementFieldType;

                    switch (fieldType)
                    {
                        case ElementFieldTypes.Boolean:
                            total -= Convert.ToDecimal(UserElementCell.BooleanValue.GetValueOrDefault());
                            break;
                        case ElementFieldTypes.Integer:
                            total -= Convert.ToDecimal(UserElementCell.BooleanValue.GetValueOrDefault());
                            break;
                        case ElementFieldTypes.Decimal:
                        case ElementFieldTypes.DirectIncome:
                            total -= UserElementCell.DecimalValue.GetValueOrDefault();
                            break;
                        case ElementFieldTypes.DateTime:
                            total -= Convert.ToDecimal(UserElementCell.DateTimeValue.GetValueOrDefault());
                            break;
                        default:
                            throw new InvalidOperationException("Invalid field type: " + fieldType);
                    }
                }

                return total;
            }
        }

        public int OtherUsersNumericValueCount
        {
            get
            {
                var count = NumericValueCount.GetValueOrDefault(0);

                if (UserElementCell != null)
                {
                    var fieldType = (ElementFieldTypes)ElementField.ElementFieldType;

                    if ((fieldType == ElementFieldTypes.Boolean && UserElementCell.BooleanValue.HasValue)
                        || (fieldType == ElementFieldTypes.Integer && UserElementCell.IntegerValue.HasValue)
                        || (fieldType == ElementFieldTypes.Decimal && UserElementCell.DecimalValue.HasValue)
                        || (fieldType == ElementFieldTypes.DateTime && UserElementCell.DateTimeValue.HasValue))
                    {
                        count--;
                    }
                }

                return count;
            }
        }

        /* Obsolete starting from here? */

        public decimal Rating
        {
            get
            {
                // TODO Serialization issue?
                if (ElementField == null)
                    return 0;

                var fieldType = (ElementFieldTypes)ElementField.ElementFieldType;

                if (ElementField.UseFixedValue.Value)
                {
                    switch (fieldType)
                    {
                        case ElementFieldTypes.Boolean:
                            // return Convert.ToDecimal(BooleanValue.GetValueOrDefault());
                            return 0;
                        case ElementFieldTypes.Integer:
                            return 0;
                        //return Convert.ToDecimal(IntegerValue.GetValueOrDefault());
                        case ElementFieldTypes.Decimal:
                        case ElementFieldTypes.DirectIncome: // TODO Same as Decimal type? How about base & child types?
                            return 0;
                        //return DecimalValue.GetValueOrDefault();
                        default:
                            throw new InvalidOperationException("Invalid field type: " + fieldType);
                    }
                }
                else
                {
                    switch (fieldType)
                    {
                        case ElementFieldTypes.Boolean:
                        case ElementFieldTypes.Integer:
                        case ElementFieldTypes.Decimal:
                        case ElementFieldTypes.DirectIncome: // TODO Same as Decimal type? How about base & child types?
                            {
                                return NumericValue.HasValue
                                    ? NumericValue.Value
                                    : 0;
                            }
                        default:
                            throw new InvalidOperationException("Invalid field type: " + fieldType);
                    }
                }
            }
        }

        public decimal RatingMultiplied()
        {
            return Rating * ElementItem.MultiplierValue();
        }

        public decimal RatingPercentage()
        {
            var elementFieldValueMultiplied = ElementField.ValueMultiplied();

            return elementFieldValueMultiplied == 0
                ? 0
                : RatingMultiplied() / elementFieldValueMultiplied;
        }

        public decimal IndexIncome()
        {
            if (ElementField.ElementFieldIndex == null)
            {
                return ElementField.ElementFieldType == (byte)ElementFieldTypes.Element && SelectedElementItem != null
                    ? SelectedElementItem.IndexIncome()
                    : 0;
            }

            var value = RatingPercentage();

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

            return ElementField.ElementFieldIndex.IndexShare() * value;
        }

        #region - Methods -

        public ElementCell ClearValue()
        {
            return ClearValue(null);
        }

        public ElementCell ClearValue(User user)
        {
            FixedValueValidation(user);

            var fixedValue = ElementField.UseFixedValue.GetValueOrDefault(true);
            if (fixedValue)
                ClearFixedValues();
            else
                RemoveUserCell(user);

            return this;
        }

        //public ElementCell SetValue(string value)
        //{
        //    SetValueHelper(ElementFieldTypes.String, null);
        //    StringValue = value;
        //    return this;
        //}

        public ElementCell SetValue(string value)
        {
            SetValueHelper(ElementFieldTypes.String, null);
            GetUserCell().SetValue(value);
            return this;
        }

        public ElementCell SetValue(bool value)
        {
            SetValueHelper(ElementFieldTypes.Boolean, null);
            GetUserCell().SetValue(value);
            return this;
        }

        public ElementCell SetValue(int value)
        {
            SetValueHelper(ElementFieldTypes.Integer, null);
            GetUserCell().SetValue(value);
            return this;
        }

        public ElementCell SetValue(decimal value)
        {
            SetValueHelper(ElementFieldTypes.Decimal, null);
            GetUserCell().SetValue(value);
            return this;
        }

        public ElementCell SetValue(DateTime value)
        {
            SetValueHelper(ElementFieldTypes.DateTime, null);
            GetUserCell().SetValue(value);
            return this;
        }

        public ElementCell SetValue(ElementItem value)
        {
            SetValueHelper(ElementFieldTypes.Element, null);
            SelectedElementItem = value;
            return this;
        }

        void SetValueHelper(ElementFieldTypes valueType, User user)
        {
            // Validations

            // a. Field and value type
            var fieldType = (ElementFieldTypes)ElementField.ElementFieldType;

            // 1. Field's type & this operation's type has to match
            // 2. And if field type is DirectIncome or Multiplier, value type has to be Decimal
            if (fieldType != valueType
                && !(fieldType == ElementFieldTypes.DirectIncome
                || fieldType == ElementFieldTypes.Multiplier
                    && valueType == ElementFieldTypes.Decimal))
                throw new InvalidOperationException(string.Format("Invalid value, field and value types don't match - Field type: {0}, Value type: {1}",
                    fieldType,
                    valueType));

            // b. FixedValue
            //FixedValueValidation(user);

            // Clear, if FixedValue
            var fixedValue = ElementField.UseFixedValue.GetValueOrDefault(true);
            if (fixedValue)
                ClearFixedValues();
        }

        void FixedValueValidation(User user)
        {
            var fixedValue = ElementField.UseFixedValue.GetValueOrDefault(true);
            if (!fixedValue && user == null)
                throw new InvalidOperationException("Value can't be set without user parameter when FixedValue is false");
        }

        void ClearFixedValues()
        {
            //StringValue = null;
            //BooleanValue = null;
            //IntegerValue = null;
            //DecimalValue = null;
            //DateTimeValue = null;
            // TODO Do we need to set both?
            SelectedElementItemId = null;
            SelectedElementItem = null;
        }

        UserElementCell AddUserCell()
        {
            // Validations.ArgumentNullOrDefault(user, "user");

            //if (UserElementCellSet.Any(item => item.User == user))
            if (UserElementCell != null)
                throw new Exception("An element cell can't have more than one user element cell for the same user.");

            var userCell = new UserElementCell(this);

            if (userCell.User != null)
                userCell.User.UserElementCellSet.Add(userCell);
            //user.UserElementCellSet.Add(userCell);
            UserElementCellSet.Add(userCell);
            return userCell;
        }

        ElementCell RemoveUserCell(User user)
        {
            Validations.ArgumentNullOrDefault(user, "user");

            var userCell = UserElementCellSet.SingleOrDefault(item => item.User == user);
            if (userCell != null)
            {
                user.UserElementCellSet.Remove(userCell);
                UserElementCellSet.Remove(userCell);
            }
            return this;
        }

        UserElementCell GetUserCell()
        {
            // Validations.ArgumentNullOrDefault(user, "user");

            // var userCell = UserElementCellSet.SingleOrDefault(item => item.User == user);
            var userCell = UserElementCell;
            if (userCell == null)
                userCell = AddUserCell();

            return userCell;
        }

        UserElementCell GetUserCell(User user)
        {
            Validations.ArgumentNullOrDefault(user, "user");

            // var userCell = UserElementCellSet.SingleOrDefault(item => item.User == user);
            var userCell = UserElementCell;
            if (userCell == null)
                userCell = AddUserCell();

            return userCell;
        }

        #endregion
    }
}
