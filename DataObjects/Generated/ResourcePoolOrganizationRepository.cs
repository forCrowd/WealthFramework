namespace DataObjects
{
    using BusinessObjects;

    public partial class ResourcePoolOrganizationRepository : GenericRepository<ResourcePoolOrganization>
    {
        public ResourcePoolOrganizationRepository(WealthEconomyEntities context)
            : base(context)
        {
        }
    }
}
