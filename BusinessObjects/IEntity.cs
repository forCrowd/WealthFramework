using System;
using System.ComponentModel.DataAnnotations;

namespace BusinessObjects
{
    public interface IEntity<TPrimaryKeyType> where TPrimaryKeyType : struct
    {
        TPrimaryKeyType Id { get; set; }
        DateTime CreatedOn { get; set; }
        DateTime ModifiedOn { get; set; }
        Nullable<DateTime> DeletedOn { get; set; }
    }
}
