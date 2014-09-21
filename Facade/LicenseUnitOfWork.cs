//namespace Facade
//{
//    using BusinessObjects;
//    using DataObjects;
//    using System.Threading.Tasks;

//    public partial class LicenseUnitOfWork
//    {
//        UserLicenseRatingRepository userLicenseRatingRepository;

//        public UserLicenseRatingRepository UserLicenseRatingRepository
//        {
//            get { return userLicenseRatingRepository ?? (userLicenseRatingRepository = new UserLicenseRatingRepository(Context)); }
//        }

//        public async Task<int> InsertAsync(License entity, int userId)
//        {
//            // Sample rating
//            var sampleUserLicenseRating = new UserLicenseRating()
//            {
//                UserId = userId,
//                License = entity,
//                Rating = 0
//            };
//            UserLicenseRatingRepository.Insert(sampleUserLicenseRating);

//            return await base.InsertAsync(entity);
//        }
//    }
//}