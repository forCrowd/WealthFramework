namespace forCrowd.WealthEconomy.WebApi.Controllers.OData
{
    using BusinessObjects;
    using Extensions;
    using Facade;
    using System.Linq;
    using System.Web.Http;

    public class RolesController : BaseODataController
    {
        public RolesController()
        {
            MainUnitOfWork = new RoleUnitOfWork();
        }

        protected RoleUnitOfWork MainUnitOfWork { get; private set; }

        // GET odata/Roles
        [AllowAnonymous]
        public IQueryable<Role> Get()
        {
            return MainUnitOfWork.AllLive;
        }
    }
}
