namespace forCrowd.WealthEconomy.BusinessObjects
{
    using forCrowd.WealthEconomy.Framework;
    using Microsoft.AspNet.Identity.EntityFramework;
    using System;
    using System.ComponentModel.DataAnnotations;

    public class Role : IdentityRole<int, UserRole>, IEntity
    {
        [Obsolete("Parameterless constructors used by OData & EF. Make them private when possible.")]
        public Role()
        { }

        public Role(string name) : this()
        {
            Validations.ArgumentNullOrDefault(name, "name");

            Name = name;
        }

        public DateTime CreatedOn { get; set; }

        public DateTime ModifiedOn { get; set; }

        public DateTime? DeletedOn { get; set; }

        [Timestamp]
        public byte[] RowVersion { get; set; }
    }
}
