namespace DataObjects
{
    using BusinessObjects;

    public partial class ResourcePoolRepository : GenericRepository<ResourcePool>
    {
        public ResourcePoolRepository(WealthEconomyEntities context)
            : base(context)
        {
        }
    }
}
