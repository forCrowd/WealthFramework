namespace DataObjects
{
    using BusinessObjects;

    public partial class UserSectorRatingRepository : GenericRepository<UserSectorRating>
    {
        public UserSectorRatingRepository(WealthEconomyEntities context)
            : base(context)
        {
        }
    }
}
