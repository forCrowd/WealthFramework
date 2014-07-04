namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;

    [DisplayName("CMRP Organization Element")]
    [BusinessObjects.Attributes.DefaultProperty("Name")]
    // [ODataControllerAuthorization("Administrator")]
    public class ResourcePoolOrganizationElement : BaseEntity
    {
        public ResourcePoolOrganizationElement()
        {
        }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        public int ResourcePoolId { get; set; }

        public int ElementId { get; set; }

        public virtual ResourcePool ResourcePool { get; set; }
        public virtual Element Element { get; set; }
    }
}
