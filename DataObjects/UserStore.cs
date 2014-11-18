namespace DataObjects
{
    using BusinessObjects;
    using DataObjects.Extensions;
    using Microsoft.AspNet.Identity.EntityFramework;
    using System;
    using System.Data.Entity;
    using System.Linq;
    using System.Threading.Tasks;

    public class UserStore : UserStore<User, Role, int, UserLogin, UserRole, UserClaim>
    {
        // TODO Replaece it with IsSample field in User table?
        const int SAMPLEUSERID = 2;

        public UserStore() : base(new WealthEconomyContext()) { }

        public UserStore(WealthEconomyContext context)
            : base(context)
        {
        }

        internal new WealthEconomyContext Context { get { return (WealthEconomyContext)base.Context; } }

        private DbSet<ResourcePool> ResourcePoolSet { get { return Context.Set<ResourcePool>(); } }
        private DbSet<UserResourcePool> UserResourcePoolSet { get { return Context.Set<UserResourcePool>(); } }

        public override Task CreateAsync(User user)
        {
            CopySampleData(user);
            return base.CreateAsync(user);
        }

        public override Task DeleteAsync(User user)
        {
            DeleteSampleData(user);
            return base.DeleteAsync(user);
        }

        public async Task ResetSampleDataAsync(int userId)
        {
            var targetUser = await FindByIdAsync(userId);

            DeleteSampleData(targetUser);
            CopySampleData(targetUser);

            // TODO Store should not save?
            await UpdateAsync(targetUser);
            await Context.SaveChangesAsync();
        }

        void CopySampleData(User targetUser)
        {
            if (targetUser == null)
            {
                throw new ArgumentNullException("targetUser");
            }

            // User resource pools
            var sampleUserResourcePools = UserResourcePoolSet
                .Get(item => item.UserId == SAMPLEUSERID && item.ResourcePool.IsSample, item => item.ResourcePool);

            foreach (var sampleUserResourcePool in sampleUserResourcePools)
            {
                var userResourcePool = new UserResourcePool()
                {
                    User = targetUser,
                    ResourcePool = sampleUserResourcePool.ResourcePool,
                    ResourcePoolRate = sampleUserResourcePool.ResourcePoolRate
                };
                UserResourcePoolSet.Add(userResourcePool);
            }

            // TODO Samples?
        }

        void DeleteSampleData(User user)
        {
            UserResourcePoolSet.RemoveRange(user.UserResourcePoolSet);
        }
    }
}