//namespace Facade
//{
//    using BusinessObjects;
//    using DataObjects;
//    using System.Linq;

//    public partial class UserResourcePoolOrganizationUnitOfWork
//    {
//        UserRepository userRepository;
//        ResourcePoolOrganizationRepository resourcePoolOrganizationRepository;

//        UserRepository UserRepository
//        {
//            get { return userRepository ?? (userRepository = new UserRepository(Context)); }
//        }

//        ResourcePoolOrganizationRepository ResourcePoolOrganizationRepository
//        {
//            get { return resourcePoolOrganizationRepository ?? (resourcePoolOrganizationRepository = new ResourcePoolOrganizationRepository(Context)); }
//        }

//        public IQueryable<User> UserSetLive { get { return UserRepository.AllLive; } }

//        public IQueryable<ResourcePoolOrganization> ResourcePoolOrganizationSetLive { get { return ResourcePoolOrganizationRepository.AllLive; } }
//    }
//}