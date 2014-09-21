namespace Facade
{
    using BusinessObjects;
    using DataObjects;
    using System.Linq;
    using System.Threading.Tasks;

    public partial class ResourcePoolUnitOfWork
    {
        ResourcePoolIndexRepository resourcePoolIndexRepository;
        OrganizationRepository organizationRepository;
        UserResourcePoolRepository userResourcePoolRepository;
        UserResourcePoolIndexRepository userResourcePoolIndexRepository;
        UserOrganizationRepository userOrganizationRepository;

        public ResourcePoolIndexRepository ResourcePoolIndexRepository
        {
            get { return resourcePoolIndexRepository ?? (resourcePoolIndexRepository = new ResourcePoolIndexRepository(Context)); }
        }

        public OrganizationRepository OrganizationRepository
        {
            get { return organizationRepository ?? (organizationRepository = new OrganizationRepository(Context)); }
        }

        UserResourcePoolRepository UserResourcePoolRepository
        {
            get { return userResourcePoolRepository ?? (userResourcePoolRepository = new UserResourcePoolRepository(Context)); }
        }

        UserResourcePoolIndexRepository UserResourcePoolIndexRepository
        {
            get { return userResourcePoolIndexRepository ?? (userResourcePoolIndexRepository = new UserResourcePoolIndexRepository(Context)); }
        }

        UserOrganizationRepository UserOrganizationRepository
        {
            get { return userOrganizationRepository ?? (userOrganizationRepository = new UserOrganizationRepository(Context)); }
        }

        public async Task<int> InsertAsync(ResourcePool entity, int userId)
        {
            // Sample resource pool could only be created during DatabaseInitialization at the moment
            entity.IsSample = false;

            // Sample records
            // TODO Enable this block in case if there will no static indexes left in the system
            //var sampleResourcePoolIndex = new ResourcePoolIndex()
            //{
            //    ResourcePool = entity,
            //    Name = "Generic Index"
            //};
            //ResourcePoolIndexRepository.Insert(sampleResourcePoolIndex);

            var sampleOrganization = new Organization()
            {
                ResourcePool = entity,
                Name = "Generic Organization",
                ProductionCost = 0,
                SalesPrice = 0
            };
            OrganizationRepository.Insert(sampleOrganization);

            CreateUserResourcePool(entity, userId);

            return await base.InsertAsync(entity);
        }

        public override async Task<int> DeleteAsync(params object[] id)
        {
            var resourcePoolId = (int)id[0];

            // Load the resource pool into the context with its child items, otherwise it fails to delete due to Foreign Key exception
            //var resourcePool = AllLiveIncluding(item => item.SectorSet)
            //    .SingleOrDefault(item => item.Id == resourcePoolId);
            // TODO?
            var resourcePool = AllLive.SingleOrDefault(item => item.Id == resourcePoolId);

            if (resourcePool == null)
                return 0;

            return await base.DeleteAsync(resourcePoolId);
        }

        #region - Private Methods -

        void CreateUserResourcePool(ResourcePool resourcePool, int userId)
        {
            var userResourcePool = new UserResourcePool()
            {
                UserId = userId,
                ResourcePool = resourcePool,
                ResourcePoolRate = 101
            };
            UserResourcePoolRepository.Insert(userResourcePool);

            // Sample ratings
            // TODO This is not going to work for now, because there are no ResourcePoolIndex records (it doesn't add a sample index)
            var resourcePoolIndexes = resourcePool.ResourcePoolIndexSet;
            foreach (var resourcePoolIndex in resourcePoolIndexes)
            {
                var sampleUserResourcePoolIndex = new UserResourcePoolIndex()
                {
                    UserResourcePool = userResourcePool,
                    ResourcePoolIndex = resourcePoolIndex,
                    Rating = 50 // TODO Is it correct? Or should be null?
                };
                UserResourcePoolIndexRepository.Insert(sampleUserResourcePoolIndex);
            }

            var organizations = resourcePool.OrganizationSet;
            foreach (var organization in organizations)
            {
                var sampleUserOrganization = new UserOrganization()
                {
                    UserId = userResourcePool.UserId,
                    Organization = organization,
                    NumberOfSales = 0
                };
                UserOrganizationRepository.Insert(sampleUserOrganization);
            }
        }

        #endregion
    }
}