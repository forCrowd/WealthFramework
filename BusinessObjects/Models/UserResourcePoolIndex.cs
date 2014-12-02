namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using Framework;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    [DisplayName("User CMRP Index")]
    [BusinessObjects.Attributes.DefaultProperty("Id")]
    public class UserResourcePoolIndex : BaseEntity
    {
        [Obsolete("Parameterless constructors used in Web - Controllers. Make them private them when possible")]
        public UserResourcePoolIndex()
            // : this(new UserResourcePool(), new ResourcePoolIndex(), 0)
            //: this(new UserResourcePool(), new ResourcePoolIndex(), 0)
        { }

        public UserResourcePoolIndex(UserResourcePool userResourcePool, ResourcePoolIndex resourcePoolIndex, decimal rating)
        {
            Validations.ArgumentNullOrDefault(userResourcePool, "userResourcePool");
            Validations.ArgumentNullOrDefault(resourcePoolIndex, "resourcePoolIndex");

            UserResourcePool = userResourcePool;
            ResourcePoolIndex = resourcePoolIndex;
            Rating = rating;
        }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        [Index("IX_UserResourcePoolIdResourcePoolIndexId", 1, IsUnique = true)]
        public int UserResourcePoolId { get; set; }

        [Index("IX_UserResourcePoolIdResourcePoolIndexId", 2, IsUnique = true)]
        public int ResourcePoolIndexId { get; set; }

        public decimal Rating { get; set; }

        public virtual UserResourcePool UserResourcePool { get; set; }
        public virtual ResourcePoolIndex ResourcePoolIndex { get; set; }

        public string Name
        {
            get { return string.Format("{0} - {1}", UserResourcePool.Name, ResourcePoolIndex.Name); }
        }
    }
}
