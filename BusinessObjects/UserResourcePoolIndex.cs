namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    [DisplayName("User CMRP Index")]
    [BusinessObjects.Attributes.DefaultProperty("Id")]
    public class UserResourcePoolIndex : BaseEntity
    {
        public UserResourcePoolIndex()
        {
            UserResourcePoolIndexValueSet = new HashSet<UserResourcePoolIndexValue>();
            UserResourcePoolIndexElementItemSet = new HashSet<UserResourcePoolIndexElementItem>();
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

        public virtual ICollection<UserResourcePoolIndexValue> UserResourcePoolIndexValueSet { get; set; }
        public virtual ICollection<UserResourcePoolIndexElementItem> UserResourcePoolIndexElementItemSet { get; set; }

        public string Name
        {
            get { return string.Format("{0} - {1}", UserResourcePool.Name, ResourcePoolIndex.Name); }
        }

        public IEnumerable<UserResourcePoolIndexOrganization> UserOrganizationResourcePoolIndexOrganizationSet
        {
            get
            {
                var list = new HashSet<UserResourcePoolIndexOrganization>();
                foreach (var userOrganization in UserResourcePool.UserOrganizationSet)
                    foreach (var resourcePoolIndexOrganization in ResourcePoolIndex.ResourcePoolIndexOrganizationSet)
                        if (userOrganization.Organization == resourcePoolIndexOrganization.Organization)
                            list.Add(new UserResourcePoolIndexOrganization(userOrganization, resourcePoolIndexOrganization));
                return list;
            }
        }

        public decimal IndexShare
        {
            get { return UserResourcePool.TotalResourcePoolTax * ResourcePoolIndex.IndexRatingPercentage; }
        }

        public decimal IndexValueMultiplied
        {
            get { return UserOrganizationResourcePoolIndexOrganizationSet.Sum(item => item.IndexValueMultiplied); }
        }
    }
}
