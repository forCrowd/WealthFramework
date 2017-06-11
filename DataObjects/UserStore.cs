namespace forCrowd.WealthEconomy.DataObjects
{
    using forCrowd.WealthEconomy.BusinessObjects;
    using Microsoft.AspNet.Identity.EntityFramework;
    using System;
    using System.Data.Entity;
    using System.Threading.Tasks;

    public class UserStore : UserStore<User, Role, int, UserLogin, UserRole, UserClaim>
    {
        public UserStore()
            : this(new WealthEconomyContext())
        {
        }

        public UserStore(WealthEconomyContext context)
            : base(context)
        {
            AutoSaveChanges = false;
        }

        // TODO This doesn't hide base.Context, UserManager can still access to Store.Context?
        private new WealthEconomyContext Context { get { return (WealthEconomyContext)base.Context; } }

        DbSet<ResourcePool> ResourcePoolSet { get { return Context.Set<ResourcePool>(); } }
        DbSet<UserClaim> UserClaimSet { get { return Context.Set<UserClaim>(); } }
        DbSet<UserResourcePool> UserResourcePoolSet { get { return Context.Set<UserResourcePool>(); } }
        DbSet<UserElementField> UserElementFieldSet { get { return Context.Set<UserElementField>(); } }
        DbSet<UserElementCell> UserElementCellSet { get { return Context.Set<UserElementCell>(); } }

        public void AddSingleUseToken(User user)
        {
            user.SingleUseToken = Guid.NewGuid().ToString();
        }

        // TODO Not in use?
        public async Task DeleteUserResourcePoolAsync(int resourcePoolId)
        {
            var entity = await UserResourcePoolSet.SingleOrDefaultAsync(item => item.ResourcePoolId == resourcePoolId);

            if (entity == null)
                return;

            UserResourcePoolSet.Remove(entity);
        }

        // TODO Not in use?
        public async Task DeleteUserElementFieldAsync(int elementFieldId)
        {
            var entity = await UserElementFieldSet.SingleOrDefaultAsync(item => item.ElementFieldId == elementFieldId);

            if (entity == null)
                return;

            UserElementFieldSet.Remove(entity);
        }

        // TODO Not in use?
        public async Task DeleteUserElementCellAsync(int elementCellId)
        {
            var entity = await UserElementCellSet.SingleOrDefaultAsync(item => item.ElementCellId == elementCellId);

            if (entity == null)
                return;

            UserElementCellSet.Remove(entity);
        }

        public async Task SaveChangesAsync()
        {
            await Context.SaveChangesAsync();
        }
    }
}