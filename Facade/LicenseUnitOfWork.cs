namespace Facade
{
    using BusinessObjects;
    using DataObjects;

    public partial class LicenseUnitOfWork
    {
        UserLicenseRatingRepository userLicenseRatingRepository;

        public UserLicenseRatingRepository UserLicenseRatingRepository
        {
            get { return userLicenseRatingRepository ?? (userLicenseRatingRepository = new UserLicenseRatingRepository(Context)); }
        }

        public void Insert(License entity, int userId)
        {
            base.Insert(entity);

            // Sample rating
            var sampleUserLicenseRating = new UserLicenseRating()
            {
                UserId = userId,
                License = entity,
                Rating = 0
            };
            UserLicenseRatingRepository.Insert(sampleUserLicenseRating);
        }
    }
}