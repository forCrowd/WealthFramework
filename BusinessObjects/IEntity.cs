namespace forCrowd.WealthEconomy.BusinessObjects
{
    using System;

    public interface IEntity
    {
        DateTime CreatedOn { get; set; }
        DateTime ModifiedOn { get; set; }
        DateTime? DeletedOn { get; set; }
        byte[] RowVersion { get; set; }
    }
}
