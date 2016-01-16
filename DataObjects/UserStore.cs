namespace forCrowd.WealthEconomy.DataObjects
{
    using forCrowd.WealthEconomy.BusinessObjects;
    using forCrowd.WealthEconomy.DataObjects.Extensions;
    using Microsoft.AspNet.Identity.EntityFramework;
    using System.Data.Entity;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Security.Claims;
    using System;

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

        public async Task AddHasNoPasswordClaim(User user)
        {
            var hasNoPasswordClaim = new Claim("HasNoPassword", string.Empty);
            await AddClaimAsync(user, hasNoPasswordClaim);
        }

        public async Task AddTempTokenClaim(User user)
        {
            var tempToken = Guid.NewGuid().ToString();
            var tempTokenClaim = new Claim("TempToken", tempToken);
            await AddClaimAsync(user, tempTokenClaim);
        }

        public async Task DeleteUserResourcePoolAsync(int resourcePoolId)
        {
            var entity = await UserResourcePoolSet.SingleOrDefaultAsync(item => item.ResourcePoolId == resourcePoolId);

            if (entity == null)
                return;

            UserResourcePoolSet.Remove(entity);
        }

        public async Task DeleteUserElementFieldAsync(int elementFieldId)
        {
            var entity = await UserElementFieldSet.SingleOrDefaultAsync(item => item.ElementFieldId == elementFieldId);

            if (entity == null)
                return;

            UserElementFieldSet.Remove(entity);
        }

        public async Task DeleteUserElementCellAsync(int elementCellId)
        {
            var entity = await UserElementCellSet.SingleOrDefaultAsync(item => item.ElementCellId == elementCellId);

            if (entity == null)
                return;

            UserElementCellSet.Remove(entity);
        }

        public async Task RemoveHasNoPasswordClaim(User user)
        {
            var claims = await GetClaimsAsync(user);
            var hasNoPasswordClaim = claims.Single(claim => claim.Type == "HasNoPassword");
            await RemoveClaimAsync(user, hasNoPasswordClaim);
        }

        public async Task RemoveTempTokenClaim(User user, string tempToken)
        {
            var claims = await GetClaimsAsync(user);
            var tempTokenClaim = claims.Single(claim => claim.Type == "TempToken" && claim.Value == tempToken);
            await RemoveClaimAsync(user, tempTokenClaim);
        }

        public async Task SaveChangesAsync()
        {
            await Context.SaveChangesAsync();
        }
    }
}