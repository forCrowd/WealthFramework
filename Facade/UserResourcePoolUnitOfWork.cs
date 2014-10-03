namespace Facade
{
    using BusinessObjects;
    using DataObjects;
    using System.Linq;
    using System.Threading.Tasks;

    public partial class UserResourcePoolUnitOfWork
    {
        ResourcePoolRepository resourcePoolRepository;
        UserResourcePoolIndexRepository userResourcePoolIndexRepository;
        //UserOrganizationRepository userOrganizationRepository;

        ResourcePoolRepository ResourcePoolRepository
        {
            get { return resourcePoolRepository ?? (resourcePoolRepository = new ResourcePoolRepository(Context)); }
        }

        UserResourcePoolIndexRepository UserResourcePoolIndexRepository
        {
            get { return userResourcePoolIndexRepository ?? (userResourcePoolIndexRepository = new UserResourcePoolIndexRepository(Context)); }
        }

        //UserOrganizationRepository UserOrganizationRepository
        //{
        //    get { return userOrganizationRepository ?? (userOrganizationRepository = new UserOrganizationRepository(Context)); }
        //}

        public enum UpdateNumberOfSalesActions
        {
            Increase,
            Decrease,
            Reset
        }

        public override async Task<int> InsertAsync(UserResourcePool userResourcePool)
        {
            // TODO This is only for temporary, try to find a way to handle these cases better!
            // Currently it's not certain that userResourcePool.ResourcePool property has a value but ResourcePoolId definitely filled.. ?!
            var resourcePool = ResourcePoolRepository.Find(userResourcePool.ResourcePoolId);

            // Sample ratings
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

            //var organizations = resourcePool.OrganizationSet;
            //foreach (var organization in organizations)
            //{
            //    var sampleUserOrganization = new UserOrganization()
            //    {
            //        UserId = userResourcePool.UserId,
            //        Organization = organization,
            //        NumberOfSales = 0
            //    };
            //    UserOrganizationRepository.Insert(sampleUserOrganization);
            //}

            return await base.InsertAsync(userResourcePool);
        }

        public async Task<int> IncreaseNumberOfSales(UserResourcePool userResourcePool)
        {
            UpdateNumberOfSales(userResourcePool, UpdateNumberOfSalesActions.Increase);
            return await Context.SaveChangesAsync();
        }

        public async Task<int> IncreaseResourcePoolRate(UserResourcePool userResourcePool)
        {
            userResourcePool.ResourcePoolRate += 5;
            return await Context.SaveChangesAsync();
        }

        public async Task<int> DecreaseNumberOfSales(UserResourcePool userResourcePool)
        {
            UpdateNumberOfSales(userResourcePool, UpdateNumberOfSalesActions.Decrease);
            return await Context.SaveChangesAsync();
        }

        public async Task<int> DecreaseResourcePoolRate(UserResourcePool userResourcePool)
        {
            userResourcePool.ResourcePoolRate -= 5;
            return await Context.SaveChangesAsync();
        }

        public async Task<int> ResetNumberOfSales(UserResourcePool userResourcePool)
        {
            UpdateNumberOfSales(userResourcePool, UpdateNumberOfSalesActions.Reset);
            return await Context.SaveChangesAsync();
        }

        void UpdateNumberOfSales(UserResourcePool userResourcePool, UpdateNumberOfSalesActions action)
        {
            //foreach (var organization in userResourcePool.UserOrganizationSet)
            //{
            //    switch (action)
            //    {
            //        case UpdateNumberOfSalesActions.Increase:
            //            organization.NumberOfSales++;
            //            break;
            //        case UpdateNumberOfSalesActions.Decrease:
            //            if (organization.NumberOfSales > 0)
            //                organization.NumberOfSales--;
            //            break;
            //        case UpdateNumberOfSalesActions.Reset:
            //            organization.NumberOfSales = 0;
            //            break;
            //    }
            //    UserOrganizationRepository.Update(organization);
            //}
        }

        public override async Task<int> DeleteAsync(params object[] id)
        {
            // TODO How about retrieving it by using Include?
            var userResourcePool = Find(id);

            //// Delete child items first
            //UserOrganizationRepository.DeleteRange(userResourcePool.UserOrganizationSet);

            // Delete main item
            return await base.DeleteAsync(id);
        }
    }
}