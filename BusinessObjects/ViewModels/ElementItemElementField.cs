
using System;
namespace BusinessObjects.ViewModels
{
    public class ElementItemElementField
    {
        public ElementItemElementField() { }

        public ElementItemElementField(BusinessObjects.ElementItemElementField elementItemElementField)
        {
            Id = elementItemElementField.Id;
            ElementItemId = elementItemElementField.ElementItemId;
            ElementFieldId = elementItemElementField.ElementFieldId;
            ElementFieldType = elementItemElementField.ElementField.ElementFieldType;
            StringValue = elementItemElementField.StringValue;
            BooleanValue = elementItemElementField.BooleanValue;
            IntegerValue = elementItemElementField.IntegerValue;
            DecimalValue = elementItemElementField.DecimalValue;
            DateTimeValue = elementItemElementField.DateTimeValue;

            ResourcePoolIndexIncome = elementItemElementField.ResourcePoolIndexIncome;
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

        public decimal ResourcePoolIndexIncome { get; set; }
    }
}
