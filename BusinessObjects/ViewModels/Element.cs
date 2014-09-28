using System.Collections.Generic;
using System.Linq;

namespace BusinessObjects.ViewModels
{
    public class Element
    {
        public Element() { }

        //public Element(BusinessObjects.Element element, UserResourcePool userResourcePool)
        public Element(BusinessObjects.Element element)
        {
            Id = element.Id;
            Name = element.Name;
            IsMainElement = element.IsMainElement;
            HasResourcePoolField = element.HasResourcePoolField;
            ResourcePoolFieldName = element.ResourcePoolFieldName;
            HasMultiplierField = element.HasMultiplierField;
            MultiplierFieldName = element.MultiplierFieldName;
            BasicElementFieldSet = element.BasicElementFieldSet.Select(item => new ElementField(item));
            ElementItemSet = element.ElementItemSet.Select(item => new ElementItem(item));
            //UserResourcePool = userResourcePool;
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsMainElement { get; set; }
        public bool HasResourcePoolField { get; set; }
        public string ResourcePoolFieldName { get; set; }
        public bool HasMultiplierField { get; set; }
        public string MultiplierFieldName { get; set; }
        public IEnumerable<ElementField> BasicElementFieldSet { get; set; }
        public IEnumerable<ElementItem> ElementItemSet { get; set; }
        // internal UserResourcePool UserResourcePool { get; private set; }
    }
}
