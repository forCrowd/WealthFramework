//namespace Facade
//{
//    using BusinessObjects;
//    using DataObjects;
//    using System.Threading.Tasks;

//    public partial class OrganizationUnitOfWork
//    {
//        UserOrganizationRepository userOrganizationRepository;

//        public UserOrganizationRepository UserOrganizationRepository
//        {
//            get { return userOrganizationRepository ?? (userOrganizationRepository = new UserOrganizationRepository(Context)); }
//        }

//        public async Task<int> InsertAsync(Organization entity, int userId)
//        {
//            // Sample user organization
//            var sampleUserOrganization = new UserOrganization()
//            {
//                UserId = userId,
//                Organization = entity,
//                NumberOfSales = 0
//            };
//            UserOrganizationRepository.Insert(sampleUserOrganization);

//            return await base.InsertAsync(entity);
//        }
//    }
//}