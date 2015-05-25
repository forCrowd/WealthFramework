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

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public decimal? RatingAverage { get; private set; }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public int? RatingCount { get; private set; }

        public UserElementCell UserElementCell
        {
            get
            {
                return UserElementCellSet.SingleOrDefault();

                // TODO Obsolete?

                //if (!System.Threading.Thread.CurrentPrincipal.Identity.IsAuthenticated)
                //    return null;

                var identity = System.Threading.Thread.CurrentPrincipal.Identity as System.Security.Claims.ClaimsIdentity;
                if (identity == null)
                {
                    return null;
                }
                var userClaim = identity.Claims.SingleOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier);
                if (userClaim == null)
                {
                    return null;
                }

                var userId = 0;
                int.TryParse(userClaim.Value, out userId);

                return UserElementCellSet.SingleOrDefault(item => item.UserId == userId);

                //try
                //{
                //    return UserElementCellSet.SingleOrDefault();
                //}
                //catch (Exception ex)
                //{
                //    throw new Exception("Count: " + UserElementCellSet.Count, ex);
                //}
            }
        }

        public decimal? OtherUsersRatingTotal
        {
            get
            {

                if (!RatingAverage.HasValue)
                    return null;

                var average = RatingAverage.Value;
                var count = RatingCount.GetValueOrDefault(0);
                var total = average * count;

                if (UserElementCell != null && UserElementCell.DecimalValue.HasValue)
                    total -= UserElementCell.DecimalValue.Value;

                return total;
            }
        }

        public decimal? OtherUsersRatingAverage
        {
            get
            {
                if (!OtherUsersRatingTotal.HasValue || OtherUsersRatingCount == 0)
                    return null;

                return OtherUsersRatingTotal.Value / OtherUsersRatingCount;
            }
        }

        public int OtherUsersRatingCount
        {
            get
            {
                var count = RatingCount.GetValueOrDefault(0);

                if (UserElementCell != null && UserElementCell.DecimalValue.HasValue)
                    count--;

                return count;
            }
        }

        /* */

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
                            return Convert.ToDecimal(BooleanValue.GetValueOrDefault());
                        case ElementFieldTypes.Integer:
                            return Convert.ToDecimal(IntegerValue.GetValueOrDefault());
                        case ElementFieldTypes.Decimal:
                        case ElementFieldTypes.DirectIncome: // TODO Same as Decimal type? How about base & child types?
                            return DecimalValue.GetValueOrDefault();
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
                                return RatingAverage.HasValue
                                    ? RatingAverage.Value
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
                && !(fieldType == ElementFieldTypes.DirectIncome
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
