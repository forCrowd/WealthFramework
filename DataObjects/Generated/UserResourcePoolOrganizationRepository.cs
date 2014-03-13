namespace DataObjects
{
    using BusinessObjects;

    public partial class UserResourcePoolOrganizationRepository : GenericRepository<UserResourcePoolOrganization>
    {
        public UserResourcePoolOrganizationRepository(WealthEconomyEntities context)
            : base(context)
        {
        }
    }
}
