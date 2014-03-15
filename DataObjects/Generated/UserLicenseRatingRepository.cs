namespace DataObjects
{
    using BusinessObjects;

    public partial class UserLicenseRatingRepository : BaseRepository<UserLicenseRating>
    {
        public UserLicenseRatingRepository(WealthEconomyEntities context)
            : base(context)
        {
        }
    }
}
