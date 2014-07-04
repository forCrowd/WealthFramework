namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;

    [DisplayName("User CMRP Index Element Item")]
    public class UserResourcePoolIndexElementItem : BaseEntity
    {
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        public int UserResourcePoolIndexId { get; set; }

        public int ElementItemId { get; set; }

        public decimal Rating { get; set; }

        public virtual UserResourcePoolIndex UserResourcePoolIndex { get; set; }

        public virtual ElementItem ElementItem { get; set; }
    }
}
