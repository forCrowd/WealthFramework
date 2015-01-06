using System.Collections.Generic;
using System.Linq;

namespace BusinessObjects.ViewModels
{
    public class ElementItem
    {
        public ElementItem() { }

        public ElementItem(BusinessObjects.ElementItem elementItem, User user)
        {
            Id = elementItem.Id;
            Name = elementItem.Name;
            HasResourcePoolCell = elementItem.HasResourcePoolCell;
            ResourcePoolCellValue = elementItem.ResourcePoolCellValue();
            ResourcePoolAddition = elementItem.ResourcePoolAddition();
            ResourcePoolValueIncludingAddition = elementItem.ResourcePoolValueIncludingAddition();
            HasMultiplierCell = elementItem.HasMultiplierCell;
            MultiplierCellValue = elementItem.MultiplierCellValue(user);
            ValueCount = elementItem.ValueCount();
            Value = elementItem.Value();
            //TotalRating = elementItem.TotalRating;
            TotalResourcePoolValue = elementItem.TotalResourcePoolValue(user);
            TotalResourcePoolAddition = elementItem.TotalResourcePoolAddition(user);
            TotalResourcePoolValueIncludingAddition = elementItem.TotalResourcePoolValueIncludingAddition(user);
            TotalIncome = elementItem.TotalIncome(user);
            ElementCellSet = elementItem.ElementCellSet
                .OrderBy(item => item.ElementField.SortOrder)
                .Select(item => new ElementCell(item, user));
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public bool HasResourcePoolCell { get; set; }
        public decimal ResourcePoolCellValue { get; set; }
        public decimal ResourcePoolAddition { get; set; }
        public decimal ResourcePoolValueIncludingAddition { get; set; }
        public bool HasMultiplierCell { get; set; }
        public decimal MultiplierCellValue { get; set; }
        public int ValueCount { get; set; }
        public decimal Value { get; set; }
        //public decimal TotalRating { get; set; }
        public decimal TotalResourcePoolValue { get; set; }
        public decimal TotalResourcePoolAddition { get; set; }
        public decimal TotalResourcePoolValueIncludingAddition { get; set; }
        public decimal TotalIncome { get; set; }

        // TODO Duplicate?
        public IEnumerable<ElementCell> ElementCellSet { get; set; }
    }
}
