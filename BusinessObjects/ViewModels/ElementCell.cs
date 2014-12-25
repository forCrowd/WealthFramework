using System;
using System.Collections.Generic;
using System.Linq;

namespace BusinessObjects.ViewModels
{
    public class ElementCell
    {
        public ElementCell() { }

        public ElementCell(BusinessObjects.ElementCell elementCell, int userId)
        {
            Id = elementCell.Id;
            ElementItemId = elementCell.ElementItemId;
            ElementFieldId = elementCell.ElementFieldId;
            ElementFieldType = elementCell.ElementField.ElementFieldType;
            StringValue = elementCell.StringValue;
            BooleanValue = elementCell.BooleanValue;
            IntegerValue = elementCell.IntegerValue;
            DecimalValue = elementCell.DecimalValue;
            DateTimeValue = elementCell.DateTimeValue;

            if (elementCell.SelectedElementItem != null)
                SelectedElementItem = new ElementItem(elementCell.SelectedElementItem, userId);

            if (elementCell.ElementField.ElementFieldType != (byte)ElementFieldTypes.String
                && elementCell.ElementField.ElementFieldType != (byte)ElementFieldTypes.Element)
            {
                RatingAverageMultiplied = elementCell.RatingAverageMultiplied;
                RatingPercentage = elementCell.RatingPercentage;
            }
            ElementFieldIndexIncome = elementCell.ElementFieldIndexIncome;

            UserElementCellSet = elementCell.UserElementCellSet
                .Where(item => item.UserId == userId)
                .Select(item => new UserElementCell(item));
        }

        public int Id { get; set; }
        public int ElementItemId { get; set; }
        public int ElementFieldId { get; set; }
        public byte ElementFieldType { get; set; }
        public string StringValue { get; set; }
        public Nullable<bool> BooleanValue { get; set; }
        public Nullable<int> IntegerValue { get; set; }
        public Nullable<decimal> DecimalValue { get; set; }
        public Nullable<DateTime> DateTimeValue { get; set; }
        public ElementItem SelectedElementItem { get; set; }

        public decimal RatingAverageMultiplied { get; set; }
        public decimal RatingPercentage { get; set; }
        public decimal ElementFieldIndexIncome { get; set; }

        public IEnumerable<UserElementCell> UserElementCellSet { get; set; }
    }
}
