namespace DataObjects
{
    using BusinessObjects;

    public partial class UserResourcePoolRepository : GenericRepository<UserResourcePool, int>
    {
        public UserResourcePoolRepository(WealthEconomyEntities context)
            : base(context)
        {
        }
    }
}
