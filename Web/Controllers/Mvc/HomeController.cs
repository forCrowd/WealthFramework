using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Web.Controllers.Mvc
{
    public class HomeController : BaseController
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

        public ActionResult Login()
        {
            ViewBag.Title = "Login";

            var userSet = db.UserSet.AsEnumerable();
            ViewBag.UserId = new SelectList(userSet, "Id", "Email");
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Login(int UserId)
        {
            var selectedUser = await db.UserSet.FindAsync(UserId);

            // TODO ?!
            if (selectedUser == null)
                return null;

            // Save user id in the session
            // TODO Use token system
            System.Web.HttpContext.Current.Session.Add("CurrentUserId", selectedUser.Id);
            System.Web.HttpContext.Current.Session.Add("CurrentUserEmail", selectedUser.Email);
            System.Web.HttpContext.Current.Session.Add("CurrentUserAccountTypeId", selectedUser.UserAccountTypeId);
            return Redirect("Index");
        }

        public ActionResult Logout()
        {
            System.Web.HttpContext.Current.Session.Abandon();
            return RedirectToAction("Index");
        }
    }
}
