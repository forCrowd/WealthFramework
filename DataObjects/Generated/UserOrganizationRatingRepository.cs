namespace DataObjects
{
    using BusinessObjects;

    public partial class UserOrganizationRatingRepository : GenericRepository<UserOrganizationRating, int>
    {
        public UserOrganizationRatingRepository(WealthEconomyEntities context)
            : base(context)
        {
        }
    }
}
