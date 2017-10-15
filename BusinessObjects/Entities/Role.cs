using System;
using System.ComponentModel.DataAnnotations;
using forCrowd.WealthEconomy.Framework;
using Microsoft.AspNet.Identity.EntityFramework;

namespace forCrowd.WealthEconomy.BusinessObjects.Entities
{
    public class Role : IdentityRole<int, UserRole>, IEntity
    {
        [Obsolete("Parameterless constructors used by OData & EF. Make them private when possible.")]
        public Role()
        { }

        public Role(string name) : this()
        {
            Validations.ArgumentNullOrDefault(name, nameof(name));

            Name = name;
        }

        public DateTime CreatedOn { get; set; }

        public DateTime ModifiedOn { get; set; }

        public DateTime? DeletedOn { get; set; }

        [Timestamp]
        public byte[] RowVersion { get; set; }
    }
}
