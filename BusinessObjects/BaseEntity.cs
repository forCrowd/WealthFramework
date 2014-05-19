using System;
using System.ComponentModel.DataAnnotations;

namespace BusinessObjects
{
    public abstract class BaseEntity : IEntity
    {
        public DateTime CreatedOn { get; set; }
        public DateTime ModifiedOn { get; set; }
        public Nullable<DateTime> DeletedOn { get; set; }
        [Timestamp]
        public byte[] RowVersion { get; set; }
    }
}
