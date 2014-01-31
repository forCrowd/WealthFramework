namespace DataObjects
{
    using BusinessObjects;

    public partial class UserDistributionIndexRatingRepository : GenericRepository<UserDistributionIndexRating, int>
    {
        public UserDistributionIndexRatingRepository(WealthEconomyEntities context)
            : base(context)
        {
        }
    }
}
