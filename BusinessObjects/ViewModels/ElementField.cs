
namespace BusinessObjects.ViewModels
{
    public class ElementField
    {
        public ElementField() { }

        public ElementField(BusinessObjects.ElementField elementField)
        {
            Id = elementField.Id;
            Name = elementField.Name;
            ElementFieldType = elementField.ElementFieldType;
            ResourcePoolIndexShare = elementField.ResourcePoolIndexShare;
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public byte ElementFieldType { get; set; }
        public decimal ResourcePoolIndexShare { get; set; }
    }
}
