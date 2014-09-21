
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
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public int RatingCount { get; set; }
    }
}
