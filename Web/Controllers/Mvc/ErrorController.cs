using System.Web.Mvc;

namespace Web.Controllers.Mvc
{
    public class ErrorController : Controller
    {
        // GET: /Error/
        public ActionResult HttpError()
        {
            return View("Error");
        }

        public ActionResult NotFound()
        {
            return View();
        }

        public ActionResult Index()
        {
            return RedirectToAction("Index", "Home");
        }
    }
}
