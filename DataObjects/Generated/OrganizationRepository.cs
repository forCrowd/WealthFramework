namespace DataObjects
{
    using BusinessObjects;

    public partial class OrganizationRepository : GenericRepository<Organization>
    {
        public OrganizationRepository(WealthEconomyEntities context)
            : base(context)
        {
        }
    }
}
