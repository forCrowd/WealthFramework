//namespace Facade
//{
//    using BusinessObjects;
//    using DataObjects;
//    using System.Linq;

//    public partial class ResourcePoolOrganizationUnitOfWork
//    {
//        ResourcePoolRepository resourcePoolRepository;
//        OrganizationRepository organizationRepository;

//        ResourcePoolRepository ResourcePoolRepository
//        {
//            get { return resourcePoolRepository ?? (resourcePoolRepository = new ResourcePoolRepository(Context)); }
//        }

//        OrganizationRepository OrganizationRepository
//        {
//            get { return organizationRepository ?? (organizationRepository = new OrganizationRepository(Context)); }
//        }

//        public IQueryable<ResourcePool> ResourcePoolSetLive { get { return ResourcePoolRepository.AllLive; } }

//        public IQueryable<Organization> OrganizationSetLive { get { return OrganizationRepository.AllLive; } }

//        public override void Delete(params object[] keyValues)
//        {
//            var resourceOrganization = Find(keyValues);

//            // Delete child items first
//            new UserResourcePoolOrganizationRepository(Context).DeleteRange(resourceOrganization.UserResourcePoolOrganizationSet);

//            // Delete main item            
//            base.Delete(keyValues);
//        }
//    }
//}