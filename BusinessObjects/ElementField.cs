namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;

    [DisplayName("Element Field")]
    [BusinessObjects.Attributes.DefaultProperty("Name")]
    // [ODataControllerAuthorization("Administrator")]
    public class ElementField : BaseEntity
    {
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        public int ElementId { get; set; }

        [Display(Name = "Element Field")]
        [Required]
        [StringLength(50)]
        public string Name { get; set; }

        [Required]
        [Display(Name = "Element Field Type")]
        public byte ElementFieldType { get; set; }

        public virtual Element Element { get; set; }
    }
}
