namespace DataObjects
{
    using BusinessObjects;

    public partial class OrganizationRepository : BaseRepository<Organization>
    {
        public OrganizationRepository(WealthEconomyEntities context)
            : base(context)
        {
        }
    }
}
