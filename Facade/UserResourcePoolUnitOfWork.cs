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
        UserOrganizationRepository userOrganizationRepository;
        //UserResourcePoolOrganizationRepository userResourcePoolOrganizationRepository;

        UserRepository UserRepository
        {
            get { return userRepository ?? (userRepository = new UserRepository(Context)); }
        }

        ResourcePoolRepository ResourcePoolRepository
        {
            get { return resourcePoolRepository ?? (resourcePoolRepository = new ResourcePoolRepository(Context)); }
        }

        UserOrganizationRepository UserOrganizationRepository
        {
            get { return userOrganizationRepository ?? (userOrganizationRepository = new UserOrganizationRepository(Context)); }
        }

        //UserResourcePoolOrganizationRepository UserResourcePoolOrganizationRepository
        //{
        //    get { return userResourcePoolOrganizationRepository ?? (userResourcePoolOrganizationRepository = new UserResourcePoolOrganizationRepository(Context)); }
        //}

        public IQueryable<User> UserSetLive { get { return UserRepository.AllLive; } }

        public IQueryable<ResourcePool> ResourcePoolSetLive { get { return ResourcePoolRepository.AllLive; } }

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
            foreach (var organization in userResourcePool.UserOrganizationSet)
            {
                organization.NumberOfSales = isReset ? 0 : organization.NumberOfSales + 1;
                UserOrganizationRepository.Update(organization);
            }
        }

        public override void Delete(params object[] id)
        {
            var userResourcePool = Find(id);

            // Delete child items first
            UserOrganizationRepository.DeleteRange(userResourcePool.UserOrganizationSet);

            // Delete main item
            MainRepository.Delete(id);
        }
    }
}