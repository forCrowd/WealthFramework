namespace DataObjects
{
    using BusinessObjects;

    public partial class UserResourcePoolRepository : GenericRepository<UserResourcePool>
    {
        public UserResourcePoolRepository(WealthEconomyEntities context)
            : base(context)
        {
        }
    }
}
