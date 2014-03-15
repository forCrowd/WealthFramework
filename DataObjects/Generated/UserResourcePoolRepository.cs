namespace DataObjects
{
    using BusinessObjects;

    public partial class UserResourcePoolRepository : BaseRepository<UserResourcePool>
    {
        public UserResourcePoolRepository(WealthEconomyEntities context)
            : base(context)
        {
        }
    }
}
