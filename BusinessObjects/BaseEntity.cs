namespace forCrowd.WealthEconomy.BusinessObjects
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.Security.Permissions;

    [PrincipalPermission(SecurityAction.Demand, Authenticated = false)]
    public abstract class BaseEntity : IEntity
    {
        public DateTime CreatedOn { get; set; }

        public DateTime ModifiedOn { get; set; }

        public DateTime? DeletedOn { get; set; }

        [Timestamp]
        public byte[] RowVersion { get; set; }
    }
}
