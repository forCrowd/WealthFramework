using System;
using System.ComponentModel.DataAnnotations;

namespace BusinessObjects
{
    public interface IEntity
    {
        DateTime CreatedOn { get; set; }
        DateTime ModifiedOn { get; set; }
        Nullable<DateTime> DeletedOn { get; set; }
    }
}
