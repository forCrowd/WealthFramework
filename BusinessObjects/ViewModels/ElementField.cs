
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
            ElementFieldIndexShare = elementField.ElementFieldIndexShare(user);
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public byte ElementFieldType { get; set; }
        public decimal ElementFieldIndexShare { get; set; }
    }
}
