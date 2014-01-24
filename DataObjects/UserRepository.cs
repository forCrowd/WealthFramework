namespace DataObjects
{
    using BusinessObjects;

    public partial class UserRepository : GenericRepository<User, int>
    {
        public UserRepository(WealthEconomyEntities context)
            : base(context)
        {
        }
    }
}
