namespace forCrowd.WealthEconomy.BusinessObjects
{
    using forCrowd.WealthEconomy.Framework;
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [UserAware("UserId")]
    public class UserResourcePool : BaseEntity
    {
        [Obsolete("Parameterless constructors used by OData & EF. Make them private when possible.")]
        public UserResourcePool()
        { }

        public UserResourcePool(ResourcePool resourcePool, decimal resourcePoolRate) : this()
        {
            Validations.ArgumentNullOrDefault(resourcePool, "resourcePool");

            ResourcePool = resourcePool;
            ResourcePoolRate = resourcePoolRate;
        }

        [Key]
        [Column(Order = 1)]
        public int UserId { get; set; }

        [Key]
        [Column(Order = 2)]
        public int ResourcePoolId { get; set; }

        public decimal ResourcePoolRate { get; set; }

        public virtual User User { get; set; }

        public virtual ResourcePool ResourcePool { get; set; }
    }
}
