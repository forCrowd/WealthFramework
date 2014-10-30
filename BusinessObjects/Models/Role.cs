namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using Microsoft.AspNet.Identity.EntityFramework;
    using System.ComponentModel.DataAnnotations;

    public class Role : IdentityRole<int, UserRole>, IEntity
    {
        public Role() { }
        public Role(string name) { Name = name; }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public System.DateTime CreatedOn { get; set; }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public System.DateTime ModifiedOn { get; set; }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public System.DateTime? DeletedOn { get; set; }

        [Timestamp]
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public byte[] RowVersion { get; set; }
    }
}
