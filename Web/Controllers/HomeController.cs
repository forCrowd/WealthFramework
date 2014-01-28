using System.Web.Mvc;

namespace Web.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Home ";

            return View();
        }

        public ActionResult Overview()
        {
            ViewBag.Title = "Overview";

            return View();
        }
    }
}
