namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;

    [BusinessObjects.Attributes.DefaultProperty("Name")]
    // [ODataControllerAuthorization("Administrator")]
    public class Element : BaseEntity
    {
        public Element()
        {
            ElementItemSet = new HashSet<ElementItem>();
        }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        public int ResourcePoolId { get; set; }

        [Display(Name = "Element")]
        [Required]
        [StringLength(50)]
        public string Name { get; set; }

        public virtual ResourcePool ResourcePool { get; set; }
        public virtual ICollection<ElementItem> ElementItemSet { get; set; }
    }
}
