using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using forCrowd.WealthEconomy.Framework;

namespace forCrowd.WealthEconomy.BusinessObjects.Entities
{
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
            Validations.ArgumentNullOrDefault(field, nameof(field));
            Validations.ArgumentNullOrDefault(item, nameof(item));

            ElementField = field;
            ElementItem = item;
        }

        public int Id { get; set; }

        [Index("UX_ElementCell_ElementFieldId_ElementItemId", 1, IsUnique = true)]
        public int ElementFieldId { get; set; }

        [Index("UX_ElementCell_ElementFieldId_ElementItemId", 2, IsUnique = true)]
        public int ElementItemId { get; set; }

        public string StringValue { get; set; }

        public decimal DecimalValueTotal { get; set; }
        public int DecimalValueCount { get; set; }

        /// <summary>
        /// In case this cell's field type is Element, this is the selected item for this cell.
        /// Other values are stored on UserElementCell, but since this one has FK, it's directly set on ElementCell.
        /// </summary>
        public int? SelectedElementItemId { get; set; }

        public virtual ElementItem ElementItem { get; set; }
        public virtual ElementField ElementField { get; set; }
        public virtual ElementItem SelectedElementItem { get; set; }
        public virtual ICollection<UserElementCell> UserElementCellSet { get; set; }

        public UserElementCell UserElementCell => UserElementCellSet.SingleOrDefault();

        #region - Methods -

        public ElementCell SetValue(string value)
        {
            SetValueHelper(ElementFieldDataType.String);
            StringValue = value;
            return this;
        }

        public void SetValue(decimal value)
        {
            SetValueHelper(ElementFieldDataType.Decimal);
            GetUserCell().SetValue(value);

            DecimalValueTotal = value; // Computed fields
            DecimalValueCount = 1; // Computed fields
        }

        public void SetValue(ElementItem value)
        {
            SetValueHelper(ElementFieldDataType.Element);
            SelectedElementItem = value;
        }

        private void SetValueHelper(ElementFieldDataType valueType)
        {
            // Validations

            // a. Field and value types have to match
            var fieldType = (ElementFieldDataType)ElementField.DataType;

            if (fieldType != valueType)
            {
                throw new InvalidOperationException(
                    $"Invalid value, field and value types don't match - Field type: {fieldType}, Value type: {valueType}");
            }

            // Clear, if FixedValue
            if (ElementField.UseFixedValue)
                ClearFixedValues();
        }

        private void ClearFixedValues()
        {
            //StringValue = null;
            //DecimalValue = null;
            // TODO Do we need to set both?
            SelectedElementItemId = null;
            SelectedElementItem = null;
        }

        private UserElementCell AddUserCell()
        {
            if (UserElementCell != null)
                throw new Exception("An element cell can't have more than one user element cell for the same user.");

            var userCell = new UserElementCell(this);

            userCell.User?.UserElementCellSet.Add(userCell);
            UserElementCellSet.Add(userCell);

            return userCell;
        }

        private UserElementCell GetUserCell()
        {
            var userCell = UserElementCell ?? AddUserCell();

            return userCell;
        }

        #endregion
    }
}
