
namespace BusinessObjects.ViewModels
{
    public class ResourcePool
    {
        public ResourcePool() { }

        public ResourcePool(BusinessObjects.ResourcePool resourcePool)
        {
            Id = resourcePool.Id;
            Name = resourcePool.Name;
            RatingCount = resourcePool.UserResourcePoolSet.Count;
            TotalIncome = resourcePool.TotalIncome;
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public int RatingCount { get; set; }
        public decimal TotalIncome { get; set; }
    }
}
