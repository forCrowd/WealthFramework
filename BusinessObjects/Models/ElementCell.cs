namespace forCrowd.WealthEconomy.BusinessObjects
{
    using forCrowd.WealthEconomy.Framework;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

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

        public int Id { get; set; }

        [Index("UX_ElementCell_ElementFieldId_ElementItemId", 1, IsUnique = true)]
        public int ElementFieldId { get; set; }

        [Index("UX_ElementCell_ElementFieldId_ElementItemId", 2, IsUnique = true)]
        public int ElementItemId { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public string StringValue { get; private set; }

        // TODO Doesn't have to be nullable but it requires a default value then which needs to be done
        // by manually editing migration file which is not necessary at the moment / SH - 03 Aug. '15
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public decimal? NumericValueTotal { get; private set; }

        // TODO Doesn't have to be nullable but it requires a default value then which needs to be done
        // by manually editing migration file which is not necessary at the moment / SH - 03 Aug. '15
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public int? NumericValueCount { get; private set; }

        /// <summary>
        /// In case this cell's field type is Element, this is the selected item for this cell.
        /// Other values are stored on UserElementCell, but since this one has FK, it's directly set on ElementCell.
        /// </summary>
        public int? SelectedElementItemId { get; set; }

        public virtual ElementItem ElementItem { get; set; }
        public virtual ElementField ElementField { get; set; }
        public virtual ElementItem SelectedElementItem { get; set; }
        public virtual ICollection<UserElementCell> UserElementCellSet { get; set; }

        public UserElementCell UserElementCell
        {
            get { return UserElementCellSet.SingleOrDefault(); }
        }

        #region - Methods -

        public ElementCell SetValue(string value)
        {
            SetValueHelper(ElementFieldDataType.String, null);
            GetUserCell().SetValue(value);
            return this;
        }

        public ElementCell SetValue(bool value)
        {
            SetValueHelper(ElementFieldDataType.Boolean, null);
            GetUserCell().SetValue(value);
            return this;
        }

        public ElementCell SetValue(int value)
        {
            SetValueHelper(ElementFieldDataType.Integer, null);
            GetUserCell().SetValue(value);
            return this;
        }

        public ElementCell SetValue(decimal value)
        {
            SetValueHelper(ElementFieldDataType.Decimal, null);
            GetUserCell().SetValue(value);
            return this;
        }

        public ElementCell SetValue(DateTime value)
        {
            SetValueHelper(ElementFieldDataType.DateTime, null);
            GetUserCell().SetValue(value);
            return this;
        }

        public ElementCell SetValue(ElementItem value)
        {
            SetValueHelper(ElementFieldDataType.Element, null);
            SelectedElementItem = value;
            return this;
        }

        void SetValueHelper(ElementFieldDataType valueType, User user)
        {
            // Validations

            // a. Field and value type
            var fieldType = (ElementFieldDataType)ElementField.DataType;

            // 1. Field's type & this operation's type has to match
            // 2. And if field type is DirectIncome or Multiplier, value type has to be Decimal
            if (fieldType != valueType
                && !(fieldType == ElementFieldDataType.DirectIncome
                || fieldType == ElementFieldDataType.Multiplier
                    && valueType == ElementFieldDataType.Decimal))
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
            if (UserElementCell != null)
                throw new Exception("An element cell can't have more than one user element cell for the same user.");

            var userCell = new UserElementCell(this);

            if (userCell.User != null)
                userCell.User.UserElementCellSet.Add(userCell);
            UserElementCellSet.Add(userCell);

            return userCell;
        }

        UserElementCell GetUserCell()
        {
            var userCell = UserElementCell;
            if (userCell == null)
                userCell = AddUserCell();

            return userCell;
        }

        #endregion
    }
}
