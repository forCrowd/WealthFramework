namespace DataObjects
{
    using BusinessObjects;

    public partial class ResourcePoolOrganizationRepository : GenericRepository<ResourcePoolOrganization, int>
    {
        public ResourcePoolOrganizationRepository(WealthEconomyEntities context)
            : base(context)
        {
        }
    }
}
