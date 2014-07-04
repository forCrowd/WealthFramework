namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;

    [DisplayName("Organization Element Item")]
    [BusinessObjects.Attributes.DefaultProperty("Name")]
    // [ODataControllerAuthorization("Administrator")]
    public class OrganizationElementItem : BaseEntity
    {
        public OrganizationElementItem()
        {
        }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        public int OrganizationId { get; set; }

        public int ElementItemId { get; set; }

        public virtual Organization Organization { get; set; }
        public virtual ElementItem ElementItem { get; set; }
    }
}
