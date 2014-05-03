using System.Web.Mvc;

namespace Web.Controllers.Mvc
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}
