
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
            ElementFieldIndexShare = elementField.ElementFieldIndexShare;
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public byte ElementFieldType { get; set; }
        public decimal ElementFieldIndexShare { get; set; }
    }
}
