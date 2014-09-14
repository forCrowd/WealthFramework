//namespace Facade
//{
//    using BusinessObjects;
//    using DataObjects;
//    using System.Threading.Tasks;

//    public partial class SectorUnitOfWork
//    {
//        UserSectorRatingRepository userSectorRatingRepository;

//        public UserSectorRatingRepository UserSectorRatingRepository
//        {
//            get { return userSectorRatingRepository ?? (userSectorRatingRepository = new UserSectorRatingRepository(Context)); }
//        }

//        public async Task<int> InsertAsync(Sector entity, int userId)
//        {
//            // TODO After having License under Sector

//            // Sample organization
//            //var sampleOrganization = new Organization()
//            //{
//            //    Sector = entity,
//            //    Name = "Generic Organization",
//            //    ProductionCost = 0,
//            //    SalesPrice = 0,
//            //    LicenseId = sampleLicense.Id
//            //};

//            // Sample rating
//            var sampleUserSectorRating = new UserSectorRating()
//            {
//                UserId = userId,
//                Sector = entity,
//                Rating = 0
//            };
//            UserSectorRatingRepository.Insert(sampleUserSectorRating);

//            return await base.InsertAsync(entity);
//        }
//    }
//}