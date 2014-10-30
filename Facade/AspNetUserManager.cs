namespace Facade
{
    using BusinessObjects;
    using DataObjects;
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;
    using System.Threading.Tasks;

    public class AspNetUserManager : UserManager<User, int>
    {
        public AspNetUserManager() : base(new AspNetUserStore()) { }

        public AspNetUserManager(IUserStore<User, int> store)
            : base(store)
        {
            // contextx

            // Store
        }

        //ResourcePoolRepository resourcePoolRepository;
        //UserResourcePoolRepository userResourcePoolRepository;

        //ResourcePoolRepository ResourcePoolRepository
        //{
        //    get { return resourcePoolRepository ?? (resourcePoolRepository = new ResourcePoolRepository(Store. Context)); }
        //}

        //UserResourcePoolRepository UserResourcePoolRepository
        //{
        //    get { return userResourcePoolRepository ?? (userResourcePoolRepository = new UserResourcePoolRepository(Context)); }
        //}

        public Task<IdentityResult> CreateAsync(User user, string password, string sampleUserId)
        {
            CopySampleData(user, sampleUserId);

            return base.CreateAsync(user, password);
        }

        #region - Private Methods -

        void DeleteSampleData(User user)
        {
            throw new System.NotImplementedException("yet");

            // UserResourcePoolRepository.DeleteRange(user.UserResourcePoolSet);
        }

        void CopySampleData(User targetUser, string sourceUserId)
        {

            throw new System.NotImplementedException("yet");

            #region Uncomment it later

            //// User resource pools
            //var sampleUserResourcePools = UserResourcePoolRepository
            //    .AllLive
            //    .Include(item => item.ResourcePool)
            //    .Where(item => item.UserId == sourceUserId && item.ResourcePool.IsSample);

            //foreach (var sampleUserResourcePool in sampleUserResourcePools)
            //{
            //    var userResourcePool = new UserResourcePool()
            //    {
            //        User = targetUser,
            //        ResourcePool = sampleUserResourcePool.ResourcePool,
            //        ResourcePoolRate = sampleUserResourcePool.ResourcePoolRate
            //    };
            //    UserResourcePoolRepository.Insert(userResourcePool);
            //}

            //// TODO Samples ...

            #endregion
        }

        #endregion
    }
}