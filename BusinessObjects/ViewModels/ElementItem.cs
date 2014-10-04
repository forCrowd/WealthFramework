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
            HasResourcePoolCell = elementItem.HasResourcePoolCell;
            ResourcePoolCellValue = elementItem.ResourcePoolCellValue;
            ResourcePoolAddition = elementItem.ResourcePoolAddition;
            ResourcePoolValueIncludingAddition = elementItem.ResourcePoolValueIncludingAddition;
            HasMultiplierCell = elementItem.HasMultiplierCell;
            MultiplierCellValue = elementItem.MultiplierCellValue;
            TotalResourcePoolValue = elementItem.TotalResourcePoolValue;
            TotalResourcePoolAddition = elementItem.TotalResourcePoolAddition;
            TotalResourcePoolValueIncludingAddition = elementItem.TotalResourcePoolValueIncludingAddition;
            TotalIncome = elementItem.TotalIncome;
            ElementCellSet = elementItem.ElementCellSet.Select(item => new ElementCell(item));
            BasicElementCellSet = elementItem.BasicElementCellSet.Select(item => new ElementCell(item));
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public bool HasResourcePoolCell { get; set; }
        public decimal ResourcePoolCellValue { get; set; }
        public decimal ResourcePoolAddition { get; set; }
        public decimal ResourcePoolValueIncludingAddition { get; set; }
        public bool HasMultiplierCell { get; set; }
        public decimal MultiplierCellValue { get; set; }
        public decimal TotalResourcePoolValue { get; set; }
        public decimal TotalResourcePoolAddition { get; set; }
        public decimal TotalResourcePoolValueIncludingAddition { get; set; }
        public decimal TotalIncome { get; set; }

        // TODO Duplicate?
        public IEnumerable<ElementCell> ElementCellSet { get; set; }
        public IEnumerable<ElementCell> BasicElementCellSet { get; set; }
    }
}
