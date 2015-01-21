using System.Collections.Generic;
using System.Linq;

namespace BusinessObjects.ViewModels
{
    public class Element
    {
        public Element() { }

        public Element(BusinessObjects.Element element, User user)
        {
            Id = element.Id;
            Name = element.Name;
            IsMainElement = element.IsMainElement;

            HasResourcePoolField = element.HasResourcePoolField;
            ResourcePoolFieldName = element.ResourcePoolFieldName;
            ResourcePoolValue = element.ResourcePoolValue();
            ResourcePoolAddition = element.ResourcePoolAddition();
            ResourcePoolValueIncludingAddition = element.ResourcePoolValueIncludingAddition();

            HasMultiplierField = element.HasMultiplierField;
            MultiplierFieldName = element.MultiplierFieldName;
            MultiplierValue = element.MultiplierValue();

            //ValueCount = elementItem.ValueCount();
            //Value = elementItem.Value();

            TotalResourcePoolValue = element.TotalResourcePoolValue();
            TotalResourcePoolAddition = element.TotalResourcePoolAddition();
            TotalResourcePoolValueIncludingAddition = element.TotalResourcePoolValueIncludingAddition();
            TotalIncome = element.TotalIncome();

            ElementFieldSet = element.ElementFieldSet
                .OrderBy(item => item.SortOrder)
                .Select(item => new ElementField(item));
            ElementItemSet = element.ElementItemSet
                .Select(item => new ElementItem(item, user));
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsMainElement { get; set; }

        public bool HasResourcePoolField { get; set; }
        public string ResourcePoolFieldName { get; set; }
        public decimal ResourcePoolValue { get; set; }
        public decimal ResourcePoolAddition { get; set; }
        public decimal ResourcePoolValueIncludingAddition { get; set; }

        public bool HasMultiplierField { get; set; }
        public string MultiplierFieldName { get; set; }
        public decimal MultiplierValue { get; set; }

        //ValueCount = elementItem.ValueCount();
        //    Value = elementItem.Value();

        public decimal TotalResourcePoolValue { get; set; }
        public decimal TotalResourcePoolAddition { get; set; }
        public decimal TotalResourcePoolValueIncludingAddition { get; set; }
        public decimal TotalIncome { get; set; }

        public IEnumerable<ElementField> ElementFieldSet { get; set; }
        public IEnumerable<ElementItem> ElementItemSet { get; set; }
    }
}
