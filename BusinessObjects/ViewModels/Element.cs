using System.Collections.Generic;
using System.Linq;

namespace BusinessObjects.ViewModels
{
    public class Element
    {
        public Element() { }

        public Element(BusinessObjects.Element element, int userId)
        {
            Id = element.Id;
            Name = element.Name;
            IsMainElement = element.IsMainElement;
            HasResourcePoolField = element.HasResourcePoolField;
            ResourcePoolFieldName = element.ResourcePoolFieldName;
            HasMultiplierField = element.HasMultiplierField;
            MultiplierFieldName = element.MultiplierFieldName;
            ElementFieldSet = element.ElementFieldSet.Select(item => new ElementField(item));
            BasicElementFieldSet = element.BasicElementFieldSet.Select(item => new ElementField(item));
            ElementItemSet = element.ElementItemSet
                //.Take(2) // TODO For testing
                .Select(item => new ElementItem(item, userId));
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsMainElement { get; set; }
        public bool HasResourcePoolField { get; set; }
        public string ResourcePoolFieldName { get; set; }
        public bool HasMultiplierField { get; set; }
        public string MultiplierFieldName { get; set; }

        // TODO Duplicate?
        public IEnumerable<ElementField> ElementFieldSet { get; set; }
        public IEnumerable<ElementField> BasicElementFieldSet { get; set; }

        public IEnumerable<ElementItem> ElementItemSet { get; set; }
    }
}
