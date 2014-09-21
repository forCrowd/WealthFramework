namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    [DisplayName("Element Item Field")]
    // [BusinessObjects.Attributes.DefaultProperty("Name")]
    // [ODataControllerAuthorization("Administrator")]
    public class ElementItemElementField : BaseEntity
    {
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        [Index("IX_ElementItemIdElementFieldId", 1, IsUnique = true)]
        public int ElementItemId { get; set; }

        [Index("IX_ElementItemIdElementFieldId", 2, IsUnique = true)]
        public int ElementFieldId { get; set; }

        public string Value { get; set; }

        public virtual ElementItem ElementItem { get; set; }
        public virtual ElementField ElementField { get; set; }
    }
}
