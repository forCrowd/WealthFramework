using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNet.Identity.EntityFramework;

namespace forCrowd.WealthEconomy.BusinessObjects.Entities
{
    public class UserLogin : IdentityUserLogin<int>, IEntity
    {
        // Todo Constructors?

        public virtual User User { get; set; }

        public DateTime CreatedOn { get; set; }

        public DateTime ModifiedOn { get; set; }

        public DateTime? DeletedOn { get; set; }

        [Timestamp]
        public byte[] RowVersion { get; set; }
    }
}
