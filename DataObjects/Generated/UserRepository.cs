namespace DataObjects
{
    using BusinessObjects;

    public partial class UserRepository : GenericRepository<User>
    {
        public UserRepository(WealthEconomyEntities context)
            : base(context)
        {
        }
    }
}
