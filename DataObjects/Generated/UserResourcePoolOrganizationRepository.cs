namespace DataObjects
{
    using BusinessObjects;

    public partial class UserResourcePoolOrganizationRepository : BaseRepository<UserResourcePoolOrganization>
    {
        public UserResourcePoolOrganizationRepository(WealthEconomyEntities context)
            : base(context)
        {
        }
    }
}
