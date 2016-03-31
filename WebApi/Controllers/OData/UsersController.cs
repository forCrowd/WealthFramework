namespace forCrowd.WealthEconomy.WebApi.Controllers.OData
{
    using forCrowd.WealthEconomy.BusinessObjects;
    using System.Linq;
    using System.Net;
    using System.Threading.Tasks;
    using System.Web.Http;
    using System.Web.Http.OData;
    using forCrowd.WealthEconomy.WebApi.Controllers.Extensions;

    public partial class UsersController
    {
        // GET odata/User
        [AllowAnonymous]
        public override IQueryable<User> Get()
        {
            var list = base.Get();
            var isAdmin = this.GetCurrentUserIsAdmin();
            var userId = this.GetCurrentUserId();

            // Only admin can get all
            if (!isAdmin)
            {
                foreach (var item in list)
                {
                    // If it's the current (logged in) user's
                    if (userId.HasValue && item.Id == userId.Value)
                        continue;

                    // Hides most of the properties that shouldn't be visible to other users
                    item.ResetValues();
                }
            }

            return list;
        }

        public new async Task<SingleResult<User>> Get(int key)
        {
            var currentUser = await GetCurrentUserAsync();
            var isAdmin = this.GetCurrentUserIsAdmin();
            if (key != currentUser.Id && !isAdmin)
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            return base.Get(key);
        }

        // PUT odata/User(5)
        public override async Task<IHttpActionResult> Put([FromODataUri] int key, User user)
        {
            var currentUser = await GetCurrentUserAsync();
            var isAdmin = this.GetCurrentUserIsAdmin();
            if (user.Id != currentUser.Id && !isAdmin)
                return Unauthorized();

            return await base.Put(key, user);
        }

        // POST odata/User
        public override Task<IHttpActionResult> Post(User user)
        {
            // TODO Will not be implemented / should not be available at all
            throw new HttpResponseException(HttpStatusCode.Unused);
        }
    }
}
