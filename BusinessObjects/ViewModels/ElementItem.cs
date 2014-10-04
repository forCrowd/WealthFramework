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
            ElementCellSet = elementItem.ElementCellSet.Select(item => new ElementCell(item));
            BasicElementCellSet = elementItem.BasicElementCellSet.Select(item => new ElementCell(item));
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
        public IEnumerable<ElementCell> ElementCellSet { get; set; }
        public IEnumerable<ElementCell> BasicElementCellSet { get; set; }
    }
}
