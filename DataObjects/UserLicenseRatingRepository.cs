namespace DataObjects
{
    using BusinessObjects;

    public partial class UserLicenseRatingRepository : GenericRepository<UserLicenseRating, int>
    {
        public UserLicenseRatingRepository(WealthEconomyEntities context)
            : base(context)
        {
        }
    }
}
