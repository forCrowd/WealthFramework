namespace Facade
{
    using BusinessObjects;
    using DataObjects;
    using System.Linq;
    using System.Threading.Tasks;

    public partial class UserResourcePoolUnitOfWork
    {
        UserRepository userRepository;
        ResourcePoolRepository resourcePoolRepository;
        UserResourcePoolOrganizationRepository userResourcePoolOrganizationRepository;

        UserRepository UserRepository
        {
            get { return userRepository ?? (userRepository = new UserRepository(Context)); }
        }

        ResourcePoolRepository ResourcePoolRepository
        {
            get { return resourcePoolRepository ?? (resourcePoolRepository = new ResourcePoolRepository(Context)); }
        }

        UserResourcePoolOrganizationRepository UserResourcePoolOrganizationRepository
        {
            get { return userResourcePoolOrganizationRepository ?? (userResourcePoolOrganizationRepository = new UserResourcePoolOrganizationRepository(Context)); }
        }

        public IQueryable<User> UserSetLive { get { return UserRepository.AllLive; } }

        public IQueryable<ResourcePool> ResourcePoolSetLive { get { return ResourcePoolRepository.AllLive; } }

        public async Task<User> FindUserAsync(object id)
        {
            return await UserRepository.FindAsync(id);
        }

        public void IncreaseNumberOfSales(UserResourcePool userResourcePool)
        {
            UpdateNumberOfSales(userResourcePool, false);
        }

        public void ResetNumberOfSales(UserResourcePool userResourcePool)
        {
            UpdateNumberOfSales(userResourcePool, true);
        }

        void UpdateNumberOfSales(UserResourcePool userResourcePool, bool isReset)
        {
            foreach (var organization in userResourcePool.UserResourcePoolOrganizationSet)
            {
                organization.NumberOfSales = isReset ? 0 : organization.NumberOfSales + 1;
                UserResourcePoolOrganizationRepository.InsertOrUpdate(organization);
            }
        }

        public override void Delete(params object[] id)
        {
            var userResourcePool = Find(id);

            // Delete child items first
            UserResourcePoolOrganizationRepository.DeleteRange(userResourcePool.UserResourcePoolOrganizationSet);

            // Delete main item
            MainRepository.Delete(id);
        }
    }
}