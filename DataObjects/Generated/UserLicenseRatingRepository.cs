namespace DataObjects
{
    using BusinessObjects;

    public partial class UserLicenseRatingRepository : GenericRepository<UserLicenseRating>
    {
        public UserLicenseRatingRepository(WealthEconomyEntities context)
            : base(context)
        {
        }
    }
}
