using System;
using System.Collections.Generic;
using System.Linq;

namespace BusinessObjects.ViewModels
{
    public class ElementCell
    {
        public ElementCell() { }

        public ElementCell(BusinessObjects.ElementCell elementCell, User user)
        {
            Id = elementCell.Id;
            ElementItemId = elementCell.ElementItemId;
            // TODO Try to handle this connection in front-end - How about breeze?
            ElementField = new ElementField(elementCell.ElementField, user);
            ElementFieldId = elementCell.ElementFieldId;
            ElementFieldType = elementCell.ElementField.ElementFieldType;
            StringValue = elementCell.StringValue;
            BooleanValue = elementCell.BooleanValue;
            IntegerValue = elementCell.IntegerValue;
            DecimalValue = elementCell.DecimalValue;
            DateTimeValue = elementCell.DateTimeValue;

            if (elementCell.SelectedElementItem != null)
                ElementItem = new ElementItem(elementCell.SelectedElementItem, user);

            if (elementCell.ElementField.ElementFieldType != (byte)ElementFieldTypes.String
                && elementCell.ElementField.ElementFieldType != (byte)ElementFieldTypes.Element)
            {
                ValueMultiplied = elementCell.ValueMultiplied();
                ValuePercentage = elementCell.ValuePercentage();
            }
            ElementFieldIndexIncome = elementCell.ElementFieldIndexIncome();

            UserElementCellSet = elementCell.UserElementCellSet
                .Where(item => item.User == user)
                .Select(item => new UserElementCell(item));
        }

        public int Id { get; set; }
        public int ElementItemId { get; set; }
        public ElementField ElementField { get; set; }
        public int ElementFieldId { get; set; }
        public byte ElementFieldType { get; set; }
        public string StringValue { get; set; }
        public Nullable<bool> BooleanValue { get; set; }
        public Nullable<int> IntegerValue { get; set; }
        public Nullable<decimal> DecimalValue { get; set; }
        public Nullable<DateTime> DateTimeValue { get; set; }
        public ElementItem ElementItem { get; set; }

        public decimal ValueMultiplied { get; set; }
        public decimal ValuePercentage { get; set; }
        public decimal ElementFieldIndexIncome { get; set; }

        public IEnumerable<UserElementCell> UserElementCellSet { get; set; }
    }
}
