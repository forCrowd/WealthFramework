using System.Collections.Generic;
using System.Linq;

namespace BusinessObjects.ViewModels
{
    public class ElementItem
    {
        public ElementItem() { }

        public ElementItem(BusinessObjects.ElementItem elementItem)
        {
            Id = elementItem.Id;
            Name = elementItem.Name;
            HasResourcePoolFieldItem = elementItem.HasResourcePoolFieldItem;
            ResourcePoolFieldItemValue = elementItem.ResourcePoolFieldItemValue;
            ResourcePoolAddition = elementItem.ResourcePoolAddition;
            ResourcePoolFieldItemValueIncludingResourcePoolAddition = elementItem.ResourcePoolFieldItemValueIncludingResourcePoolAddition;
            HasMultiplierFieldItem = elementItem.HasMultiplierFieldItem;
            MultiplierFieldItemValue = elementItem.MultiplierFieldItemValue;
            TotalResourcePoolFieldItemValue = elementItem.TotalResourcePoolFieldItemValue;
            TotalResourcePoolAddition = elementItem.TotalResourcePoolAddition;
            TotalResourcePoolFieldItemValueIncludingResourcePoolAddition = elementItem.TotalResourcePoolFieldItemValueIncludingResourcePoolAddition;
            TotalIncome = elementItem.TotalIncome;
            ElementItemElementFieldSet = elementItem.ElementItemElementFieldSet.Select(item => new ElementItemElementField(item));
            BasicElementItemElementFieldSet = elementItem.BasicElementItemElementFieldSet.Select(item => new ElementItemElementField(item));
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public bool HasResourcePoolFieldItem { get; set; }
        public decimal ResourcePoolFieldItemValue { get; set; }
        public decimal ResourcePoolAddition { get; set; }
        public decimal ResourcePoolFieldItemValueIncludingResourcePoolAddition { get; set; }
        public bool HasMultiplierFieldItem { get; set; }
        public decimal MultiplierFieldItemValue { get; set; }
        public decimal TotalResourcePoolFieldItemValue { get; set; }
        public decimal TotalResourcePoolAddition { get; set; }
        public decimal TotalResourcePoolFieldItemValueIncludingResourcePoolAddition { get; set; }
        public decimal TotalIncome { get; set; }

        // TODO Duplicate?
        public IEnumerable<ElementItemElementField> ElementItemElementFieldSet { get; set; }
        public IEnumerable<ElementItemElementField> BasicElementItemElementFieldSet { get; set; }
    }
}
