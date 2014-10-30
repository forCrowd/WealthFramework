namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using Microsoft.AspNet.Identity.EntityFramework;
    using System.ComponentModel.DataAnnotations;

    public class UserLogin : IdentityUserLogin<int>, IEntity
    {
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
