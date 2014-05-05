using System;

namespace BusinessObjects
{
    public abstract class BaseEntity : IEntity
    {
        internal BaseEntity()
        {
        }

        public DateTime CreatedOn { get; set; }
        public DateTime ModifiedOn { get; set; }
        public Nullable<DateTime> DeletedOn { get; set; }
    }
}
