namespace DataObjects
{
    using BusinessObjects;

    public partial class OrganizationRepository : GenericRepository<Organization, int>
    {
        public OrganizationRepository(WealthEconomyEntities context)
            : base(context)
        {
        }
    }
}
