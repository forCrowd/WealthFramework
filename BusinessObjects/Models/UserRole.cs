namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using Microsoft.AspNet.Identity.EntityFramework;
    using System.ComponentModel.DataAnnotations;

    public class UserRole : IdentityUserRole<int>, IEntity
    {
        public UserRole()
        {
            // TODO To be able handle UserManager.AddToRole() method call in DataObjects.Migrations.Configuration.cs, these properties had to have a initial value
            // Check it later / SH - 30 Oct. '14
            CreatedOn = System.DateTime.UtcNow;
            ModifiedOn = System.DateTime.UtcNow;
        }

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
