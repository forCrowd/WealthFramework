
using System;
namespace BusinessObjects.ViewModels
{
    public class ElementCell
    {
        public ElementCell() { }

        public ElementCell(BusinessObjects.ElementCell elementCell)
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
                SelectedElementItem = new ElementItem(elementCell.SelectedElementItem);

            RatingAverageMultiplied = elementCell.RatingAverageMultiplied;
            RatingPercentage = elementCell.RatingPercentage;
            ResourcePoolIndexIncome = elementCell.ResourcePoolIndexIncome;
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
        public decimal ResourcePoolIndexIncome { get; set; }
    }
}
