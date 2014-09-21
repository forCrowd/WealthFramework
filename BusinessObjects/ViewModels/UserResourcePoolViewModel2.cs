namespace BusinessObjects.ViewModels
{
    using System;
    using System.ComponentModel.DataAnnotations;

    // TODO Rename
    public class UserResourcePoolViewModel2
    {
        public UserResourcePoolViewModel2()
        {
        }

        public UserResourcePoolViewModel2(BusinessObjects.UserResourcePool userResourcePool)
        {
            this.Id = userResourcePool.Id;
            this.UserId = userResourcePool.UserId;
            this.ResourcePoolId = userResourcePool.ResourcePoolId;
            this.ResourcePoolRate = userResourcePool.ResourcePoolRate;
            this.CreatedOn = userResourcePool.CreatedOn;
            this.ModifiedOn = userResourcePool.ModifiedOn;
            this.DeletedOn = userResourcePool.DeletedOn;
            this.RowVersion = userResourcePool.RowVersion;
        }

        [Required]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public int ResourcePoolId { get; set; }

        [Required]
        public decimal ResourcePoolRate { get; set; }

        [Required]
        public System.DateTime CreatedOn { get; set; }

        [Required]
        public System.DateTime ModifiedOn { get; set; }

        public Nullable<System.DateTime> DeletedOn { get; set; }

        [Required]
        public byte[] RowVersion { get; set; }

        public BusinessObjects.UserResourcePool ToBusinessObject()
        {
            return new BusinessObjects.UserResourcePool()
            {
                Id = Id,
                UserId = UserId,
                ResourcePoolId = ResourcePoolId,
                ResourcePoolRate = ResourcePoolRate,
                CreatedOn = CreatedOn,
                ModifiedOn = ModifiedOn,
                DeletedOn = DeletedOn,
                RowVersion = RowVersion
            };
        }
    }
}
