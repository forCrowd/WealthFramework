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

        // TODO These properties should only be set through SetValue()?
        [Display(Name = "String Value")]
        public string StringValue { get; set; }

        [Display(Name = "Boolean Value")]
        public bool? BooleanValue { get; set; }

        [Display(Name = "Integer Value")]
        public int? IntegerValue { get; set; }

        [Display(Name = "Decimal Value")]
        public decimal? DecimalValue { get; set; }

        [Display(Name = "Date Time Value")]
        public DateTime? DateTimeValue { get; set; }

        [Display(Name = "Selected Element Item")]
        public int? SelectedElementItemId { get; set; }

        public virtual ElementItem ElementItem { get; set; }
        public virtual ElementField ElementField { get; set; }
        public virtual ElementItem SelectedElementItem { get; set; }
        public virtual ICollection<UserElementCell> UserElementCellSet { get; set; }

        /* */

        decimal FixedValue
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
                        return DecimalValue.GetValueOrDefault();
                    case ElementFieldTypes.DateTime:
                        // TODO Check GetValueOrDefault() method for this type
                        return Convert.ToDecimal(DateTimeValue.GetValueOrDefault());
                    case ElementFieldTypes.String:
                    case ElementFieldTypes.Element:
                    case ElementFieldTypes.Multiplier:
                        // TODO At least for now
                        throw new InvalidOperationException("FixedValue property is not available for this field type");
                    default:
                        throw new ArgumentOutOfRangeException();
                }
            }
        }

        //public decimal Value()
        //{
        //    return Value(null);
        //}

        public decimal Value
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
                    case ElementFieldTypes.ResourcePool:
                    case ElementFieldTypes.Multiplier:
                        {
                            return ValueOld();
                        }
                    case ElementFieldTypes.String:
                    case ElementFieldTypes.Element:
                    default:
                        {
                            return 0;
                        }
                }
            }
        }

        public int ValueCount
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
                    case ElementFieldTypes.ResourcePool:
                    case ElementFieldTypes.Multiplier:
                        {
                            return ValueCountOld();
                        }
                    case ElementFieldTypes.String:
                    case ElementFieldTypes.Element:
                    default:
                        {
                            return 0;
                        }
                }
            }
        }

        public decimal ValueOld()
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
                    {
                        // Value filter user
                        User valueFilterUser = null;
                        if (ElementItem.Element.FilterSettings.ValueFilter == ResourcePoolFilterSettings.ValueFilters.OnlyCurrentUser)
                        {
                            valueFilterUser = ElementItem.Element.FilterSettings.CurrentUser;

                            if (valueFilterUser == null)
                                throw new InvalidOperationException("ResourcePool.FilterSettings.CurrentUser property must have a value when ValueFilter is using OnlyCurrentUser option");
                        }

                        return ElementField.UseFixedValue.Value
                            ? FixedValue
                            : valueFilterUser == null
                            ? UserElementCellSet.Any()
                            ? UserElementCellSet.Average(item => item.Value)
                            : 0
                            : UserElementCellSet.Any(item => item.User == valueFilterUser)
                            ? UserElementCellSet.Single(item => item.User == valueFilterUser).Value
                            : 0;
                    }
                case ElementFieldTypes.Multiplier:
                    {
                        var multiplierFilterUser = ElementItem.Element.FilterSettings.CurrentUser;

                        // TODO Use it or remove it?
                        //if (multiplierFilterUser == null)
                        //    throw new InvalidOperationException("ResourcePool.FilterSettings.CurrentUser property must have a value when retrieving Value() with Multiplier type field");

                        var multiplierCell = UserElementCellSet.SingleOrDefault(item => item.User == multiplierFilterUser);

                        return multiplierCell == null ? 0 : multiplierCell.Value;
                    }
                case ElementFieldTypes.String:
                case ElementFieldTypes.Element:
                    // TODO At least for now
                    throw new InvalidOperationException(string.Format("Value property is not available for this field type: {0}", fieldType));
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        //public decimal Value
        //{
        //    get
        //    {
        //        var fieldType = (ElementFieldTypes)ElementField.ElementFieldType;

        //        switch (fieldType)
        //        {
        //            case ElementFieldTypes.Boolean:
        //            case ElementFieldTypes.Integer:
        //            case ElementFieldTypes.Decimal:
        //            case ElementFieldTypes.DateTime:
        //            // TODO This calculation is the same as Decimal type? Are we using the types in a wrong way?
        //            case ElementFieldTypes.ResourcePool:
        //                {
        //                    return ElementField.FixedValue.Value
        //                        ? FixedValue
        //                        : UserElementCellSet.Any()
        //                        ? UserElementCellSet.Average(item => item.Value)
        //                        : 0;
        //                }
        //            case ElementFieldTypes.Multiplier:
        //                {
        //                    return UserElementCellSet.Any()
        //                        ? UserElementCellSet.Average(item => item.Value)
        //                        : 0;
        //                }
        //            case ElementFieldTypes.String:
        //            case ElementFieldTypes.Element:
        //                // TODO At least for now
        //                throw new InvalidOperationException("Value property is not available for this field type");
        //            default:
        //                throw new ArgumentOutOfRangeException();
        //        }
        //    }
        //}

        public int ValueCountOld()
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
                    return ElementField.UseFixedValue.Value
                        ? 1
                        : UserElementCellSet.Count();
                case ElementFieldTypes.String:
                case ElementFieldTypes.Element:
                    // TODO At least for now
                    throw new InvalidOperationException("ValueCount property is not available for this field type");
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }

        public decimal ValueMultiplied()
        {
            //var mainElement = ElementItem.Element.ResourcePool.MainElement;

            //if (mainElement == null || !mainElement.HasMultiplierField)
            //    return Value();

            //// Todo BE CAREFUL ABOUT THIS, IT ASSUMES ALL ELEMENT ITEMS HAVE THE SAME MULTIPLIER VALUE, IMPROVE IT LATER!
            //var multiplierValue = mainElement.ElementItemSet.FirstOrDefault().MultiplierValue(multiplierUser);

            //return multiplierValue * Value();

            //if (!ElementItem.Element.HasMultiplierField)
            //    return Value();

            return ValueOld() * ElementItem.MultiplierValue();
        }

        public decimal ValuePercentage()
        {
            var elementFieldValueMultiplied = ElementField.ValueMultiplied();

            return elementFieldValueMultiplied == 0
                ? 0
                : ValueMultiplied() / elementFieldValueMultiplied;
        }

        public decimal IndexIncome()
        {
            if (ElementField.ElementFieldIndex == null)
            {
                return ElementField.ElementFieldType == (byte)ElementFieldTypes.Element && SelectedElementItem != null
                    ? SelectedElementItem.IndexIncome()
                    : 0;
            }

            var value = ValuePercentage();

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

        public ElementCell SetValue(string value)
        {
            SetValueHelper(ElementFieldTypes.String, null);
            StringValue = value;
            return this;
        }

        public ElementCell SetValue(bool value)
        {
            return SetValue(value, null);
        }

        public ElementCell SetValue(bool value, User user)
        {
            SetValueHelper(ElementFieldTypes.Boolean, user);

            if (ElementField.UseFixedValue.Value)
                BooleanValue = value;
            else
                GetUserCell(user).SetValue(value);

            return this;
        }

        public ElementCell SetValue(int value)
        {
            return SetValue(value, null);
        }

        public ElementCell SetValue(int value, User user)
        {
            SetValueHelper(ElementFieldTypes.Integer, user);

            if (ElementField.UseFixedValue.Value)
                IntegerValue = value;
            else
                GetUserCell(user).SetValue(value);

            return this;
        }

        public ElementCell SetValue(decimal value)
        {
            return SetValue(value, null);
        }

        public ElementCell SetValue(decimal value, User user)
        {
            SetValueHelper(ElementFieldTypes.Decimal, user);

            if (ElementField.UseFixedValue.Value)
                DecimalValue = value;
            else
                GetUserCell(user).SetValue(value);

            return this;
        }

        public ElementCell SetValue(DateTime value)
        {
            return SetValue(value, null);
        }

        public ElementCell SetValue(DateTime value, User user)
        {
            SetValueHelper(ElementFieldTypes.DateTime, user);

            if (ElementField.UseFixedValue.Value)
                DateTimeValue = value;
            else
                GetUserCell(user).SetValue(value);

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

            if (fieldType != valueType
                && !(fieldType == ElementFieldTypes.ResourcePool
                    || fieldType == ElementFieldTypes.Multiplier
                    && valueType == ElementFieldTypes.Decimal))
                throw new InvalidOperationException(string.Format("Invalid value, field and value types don't match - Field type: {0}, Value type: {1}",
                    fieldType,
                    valueType));

            // b. FixedValue
            FixedValueValidation(user);

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
            StringValue = null;
            BooleanValue = null;
            IntegerValue = null;
            DecimalValue = null;
            DateTimeValue = null;
            // TODO Do we need to set both?
            SelectedElementItemId = null;
            SelectedElementItem = null;
        }

        UserElementCell AddUserCell(User user)
        {
            Validations.ArgumentNullOrDefault(user, "user");

            if (UserElementCellSet.Any(item => item.User == user))
                throw new Exception("An element cell can't have more than one user element cell for the same user.");

            var userCell = new UserElementCell(user, this);
            user.UserElementCellSet.Add(userCell);
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

        UserElementCell GetUserCell(User user)
        {
            Validations.ArgumentNullOrDefault(user, "user");

            var userCell = UserElementCellSet.SingleOrDefault(item => item.User == user);
            if (userCell == null)
                userCell = AddUserCell(user);

            return userCell;
        }

        #endregion
    }
}
