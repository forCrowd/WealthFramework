namespace DataObjects
{
    using BusinessObjects;

    public partial class UserSectorRatingRepository : GenericRepository<UserSectorRating, int>
    {
        public UserSectorRatingRepository(WealthEconomyEntities context)
            : base(context)
        {
        }
    }
}
