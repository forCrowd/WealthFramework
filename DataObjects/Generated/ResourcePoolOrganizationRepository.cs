namespace DataObjects
{
    using BusinessObjects;

    public partial class ResourcePoolOrganizationRepository : BaseRepository<ResourcePoolOrganization>
    {
        public ResourcePoolOrganizationRepository(WealthEconomyEntities context)
            : base(context)
        {
        }
    }
}
