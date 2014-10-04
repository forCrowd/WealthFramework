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
            ResourcePoolName = userResourcePool.ResourcePool.Name;
            ResourcePoolRate = userResourcePool.ResourcePoolRate;
            ResourcePoolRatePercentage = userResourcePool.ResourcePool.ResourcePoolRatePercentage;
            UserResourcePoolRatingCount = userResourcePool.ResourcePool.UserResourcePoolSet.Count;

            ResourcePoolIndexSet = userResourcePool
                .ResourcePool
                .ResourcePoolIndexSet
                .Select(item => new ResourcePoolIndex(item));
            
            MainElement = new Element(userResourcePool.ResourcePool.MainElement);

            TotalIncome = userResourcePool.ResourcePool.TotalIncome;
        }

        public int Id { get; set; }
        public string ResourcePoolName { get; set; }
        public decimal ResourcePoolRate { get; set; }
        public decimal ResourcePoolRatePercentage { get; set; }
        public int UserResourcePoolRatingCount { get; set; }
        public IEnumerable<ResourcePoolIndex> ResourcePoolIndexSet { get; set; }
        public Element MainElement { get; set; }
        public decimal TotalIncome { get; set; }
    }
}
