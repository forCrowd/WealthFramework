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
            Name = elementField.Name;
            ElementFieldType = elementField.ElementFieldType;
            ElementFieldIndexShare = elementField.ElementFieldIndexShare();

            if (elementField.SelectedElement != null)
                SelectedElement = new Element(elementField.SelectedElement, user);
            ElementFieldIndexSet = elementField.ElementFieldIndexSet.Select(item => new ElementFieldIndex(item));
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public byte ElementFieldType { get; set; }
        public decimal ElementFieldIndexShare { get; set; }

        public Element SelectedElement { get; set; }
        public IEnumerable<ElementFieldIndex> ElementFieldIndexSet { get; set; }
    }
}
