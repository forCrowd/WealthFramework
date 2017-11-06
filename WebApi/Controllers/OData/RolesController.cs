using forCrowd.WealthEconomy.BusinessObjects.Entities;

namespace forCrowd.WealthEconomy.WebApi.Controllers.OData
{
    using BusinessObjects;
    using Facade;
    using DataObjects;
    using System.Linq;
    using System.Web.Http;

    public class RolesController : BaseODataController
    {
        public RolesController()
        {
            var dbContext = new WealthEconomyContext();
            var appUserStore = new AppUserStore(dbContext);
            var appRoleStore = new AppRoleStore(dbContext);
            _userManager = new AppUserManager(appUserStore, appRoleStore);
        }

        private readonly AppUserManager _userManager;

        // GET odata/Roles
        [AllowAnonymous]
        public IQueryable<Role> Get()
        {
            return _userManager.GetRoleSet();
        }
    }
}
