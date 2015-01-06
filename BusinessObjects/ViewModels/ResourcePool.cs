using System.Collections.Generic;
using System.Linq;

namespace BusinessObjects.ViewModels
{
    public class ResourcePool
    {
        public ResourcePool() { }

        public ResourcePool(BusinessObjects.ResourcePool resourcePool, BusinessObjects.User user)
        {
            Id = resourcePool.Id;
            Name = resourcePool.Name;
            ResourcePoolRate = resourcePool.ResourcePoolRate();
            ResourcePoolRatePercentage = resourcePool.ResourcePoolRatePercentage();
            UserResourcePoolRatingCount = resourcePool.UserResourcePoolSet.Count;
            MainElement = new Element(resourcePool.MainElement, user);
            TotalIncome = resourcePool.TotalIncome(user);
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public decimal ResourcePoolRate { get; set; }
        public decimal ResourcePoolRatePercentage { get; set; }
        public int UserResourcePoolRatingCount { get; set; }
        public Element MainElement { get; set; }
        public decimal TotalIncome { get; set; }
    }
}
