namespace Web.Controllers.OData
{
    using BusinessObjects;
    using System.Linq;
    using System.Net;
    using System.Threading.Tasks;
    using System.Web.Http;
    using System.Web.Http.OData;
    using Web.Controllers.Extensions;

    public partial class UsersController
    {
        // GET odata/User
        public override IQueryable<User> Get()
        {
            var list = base.Get();

            // Only admin can get all
            var userId = this.GetCurrentUserId();
            var isAdmin = this.GetCurrentUserIsAdmin();
            if (userId.HasValue && !isAdmin)
                list = list.Where(item => item.Id == userId.Value);

            return list;
        }

        //// GET odata/User(5)
        //[EnableQuery]
        //public override async SingleResult<User> Get([FromODataUri] int key)
        //{
        //    var currentUser = await GetCurrentUserAsync();
        //    var isAdmin = this.GetCurrentUserIsAdmin();
        //    if (key != currentUser.Id && !isAdmin)
        //        throw new HttpResponseException(HttpStatusCode.Unauthorized);

        //    return base.Get(key);
        //}

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
            throw new System.Web.Http.HttpResponseException(HttpStatusCode.Unused);
        }

        // PATCH odata/User(5)
        //public override async Task<IHttpActionResult> Patch([FromODataUri] string key, Delta<User> patch)
        //{
        //    throw new System.NotImplementedException("yet");

        //    //if (key != ApplicationUser.Id && !IsAdmin)
        //    //    return Unauthorized();

        //    //return await base.Patch(key, patch);
        //}

        //// DELETE odata/User(5)
        //public override async Task<IHttpActionResult> Delete([FromODataUri] string key)
        //{
        //    throw new System.NotImplementedException("yet");

        //    //if (key != ApplicationUser.Id && !IsAdmin)
        //    //    return Unauthorized();

        //    //return await base.Delete(key);
        //}
	}
}
