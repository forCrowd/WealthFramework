namespace DataObjects
{
    using BusinessObjects;

    public partial class UserResourcePoolOrganizationRepository : GenericRepository<UserResourcePoolOrganization, int>
    {
        public UserResourcePoolOrganizationRepository(WealthEconomyEntities context)
            : base(context)
        {
        }
    }
}
