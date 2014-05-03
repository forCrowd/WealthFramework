namespace Web.Controllers.OData
{
    using BusinessObjects;
    using System.Data.Entity.Infrastructure;
    using System.Linq;
    using System.Net;
    using System.Threading.Tasks;
    using System.Web.Http;
    using System.Web.Http.ModelBinding;
    using System.Web.Http.OData;

    public partial class UserController
    {
        // GET odata/User
        public override IQueryable<User> Get()
        {
            var list = base.Get();

            // Only admin can get all
            if (!IsAdmin)
                list = list.Where(item => item.AspNetUserId == AspNetUserId);

            return list;
        }

        // GET odata/User(5)
        public override SingleResult<User> Get([FromODataUri] int key)
        {
            if (key != ApplicationUser.Id && !IsAdmin)
                throw new HttpResponseException(HttpStatusCode.Unauthorized);

            return base.Get(key);
        }

        // PUT odata/User(5)
        public override async Task<IHttpActionResult> Put([FromODataUri] int key, User user)
        {
            if (user.Id != ApplicationUser.Id && !IsAdmin)
                return Unauthorized();

            return await base.Put(key, user);
        }

        // POST odata/User
        public override Task<IHttpActionResult> Post(User user)
        {
            // TODO Will not be implemented / should be available at all
            throw new System.Web.Http.HttpResponseException(HttpStatusCode.Unused);
        }

        // PATCH odata/User(5)
        public override async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<User> patch)
        {
            if (key != ApplicationUser.Id && !IsAdmin)
                return Unauthorized();

            return await base.Patch(key, patch);
        }

        // DELETE odata/User(5)
        public override async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            if (key != ApplicationUser.Id && !IsAdmin)
                return Unauthorized();

            return await base.Delete(key);
        }
	}
}
