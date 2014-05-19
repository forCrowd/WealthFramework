using System.Collections.Generic;
using System.Linq;

namespace BusinessObjects.ViewModels
{
    public class UserResourcePool
    {
        public UserResourcePool() { }

        public UserResourcePool(BusinessObjects.UserResourcePool userResourcePool)
        {
            Id = userResourcePool.Id;
            ResourcePoolRatePercentage = userResourcePool.ResourcePoolRatePercentage;
            UserResourcePoolRatingCount = UserResourcePoolRatingCount;
            UserOrganizationSet = userResourcePool
                .UserOrganizationSet
                .Select(item => new UserOrganization(item));
        }

        public int Id { get; set; }
        public decimal ResourcePoolRatePercentage { get; set; }
        public int UserResourcePoolRatingCount { get; set; }
        public IEnumerable<UserOrganization> UserOrganizationSet { get; set; }
    }
}
