namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    [DisplayName("User CMRP")]
    [BusinessObjects.Attributes.DefaultProperty("Id")]
    public class UserResourcePool : BaseEntity
    {
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        [Index("IX_UserIdResourcePoolId", 1, IsUnique = true)]
        public int UserId { get; set; }

        [Index("IX_UserIdResourcePoolId", 2, IsUnique = true)]
        public int ResourcePoolId { get; set; }

        [Display(Name = "CMRP Rate")]
        public decimal ResourcePoolRate { get; set; }

        public virtual User User { get; set; }

        public virtual ResourcePool ResourcePool { get; set; }

        #region - General -

        public string Name
        {
            get { return string.Format("{0} - {1}", User.Email, ResourcePool.Name); }
        }

        #endregion
    }
}
