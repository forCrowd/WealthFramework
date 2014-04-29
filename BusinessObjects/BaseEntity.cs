using System;
using System.ComponentModel.DataAnnotations;

namespace BusinessObjects
{
    public abstract class BaseEntity : IEntity
    {
        internal BaseEntity()
        {
            CreatedOn = DateTime.UtcNow;
            ModifiedOn = DateTime.UtcNow;
        }

        public DateTime CreatedOn { get; set; }
        public DateTime ModifiedOn { get; set; }
        public Nullable<DateTime> DeletedOn { get; set; }
    }
}
