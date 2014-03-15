namespace DataObjects
{
    using BusinessObjects;

    public partial class UserRepository : BaseRepository<User>
    {
        public UserRepository(WealthEconomyEntities context)
            : base(context)
        {
        }
    }
}
