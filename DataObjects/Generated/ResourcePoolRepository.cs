namespace DataObjects
{
    using BusinessObjects;

    public partial class ResourcePoolRepository : BaseRepository<ResourcePool>
    {
        public ResourcePoolRepository(WealthEconomyEntities context)
            : base(context)
        {
        }
    }
}
