using System.Collections.Generic;
using System.Linq;

namespace BusinessObjects.ViewModels
{
    public class ElementField
    {
        public ElementField() { }

        public ElementField(BusinessObjects.ElementField elementField, User user)
        {
            Id = elementField.Id;
            ElementId = elementField.ElementId;
            Name = elementField.Name;
            ElementFieldType = elementField.ElementFieldType;

            switch ((ElementFieldTypes)elementField.ElementFieldType)
            {
                case ElementFieldTypes.Boolean:
                case ElementFieldTypes.Integer:
                case ElementFieldTypes.Decimal:
                case ElementFieldTypes.DateTime:
                case ElementFieldTypes.ResourcePool:
                case ElementFieldTypes.Multiplier:
                    {
                        ValueMultiplied = elementField.ValueMultiplied();
                        ValuePercentage = elementField.ValuePercentage();
                        break;
                    }
            }
            //ElementFieldIndexShare = elementField.ElementFieldIndexShare();

            //Element = new Element(elementField.Element, user);
            if (elementField.SelectedElement != null)
                SelectedElement = new Element(elementField.SelectedElement, user);
            ElementFieldIndexSet = elementField.ElementFieldIndexSet.Select(item => new ElementFieldIndex(item));
        }

        public int Id { get; set; }
        public int ElementId { get; set; }
        public string Name { get; set; }
        public byte ElementFieldType { get; set; }
        public decimal ValueMultiplied { get; set; }
        public decimal ValuePercentage { get; set; }
        //public decimal ElementFieldIndexShare { get; set; }

        //public Element Element { get; set; }
        public Element SelectedElement { get; set; }
        public IEnumerable<ElementFieldIndex> ElementFieldIndexSet { get; set; }
    }
}
