namespace DataObjects
{
    using BusinessObjects;

    public partial class UserSectorRatingRepository : BaseRepository<UserSectorRating>
    {
        public UserSectorRatingRepository(WealthEconomyEntities context)
            : base(context)
        {
        }
    }
}
