namespace DataObjects
{
    using BusinessObjects;

    public partial class ResourcePoolRepository : GenericRepository<ResourcePool, int>
    {
        public ResourcePoolRepository(WealthEconomyEntities context)
            : base(context)
        {
        }
    }
}
