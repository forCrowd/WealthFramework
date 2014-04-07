using System.Web.Mvc;

namespace Web.Controllers.Mvc
{
    public partial class UserNgController : BaseController
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}
