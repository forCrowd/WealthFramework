using forCrowd.WealthEconomy.BusinessObjects.Attributes;
using System;
using System.ComponentModel.DataAnnotations;
using System.Security.Permissions;

namespace forCrowd.WealthEconomy.BusinessObjects
{
    [PrincipalPermission(SecurityAction.Demand, Authenticated = false)]
    public abstract class BaseEntity : IEntity
    {
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public DateTime CreatedOn { get; set; }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public DateTime ModifiedOn { get; set; }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public Nullable<DateTime> DeletedOn { get; set; }

        [Timestamp]
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public byte[] RowVersion { get; set; }
    }
}
