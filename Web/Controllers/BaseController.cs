using DataObjects;
using System.Linq;
using System.Web.Mvc;

namespace Web.Controllers
{
    public abstract class BaseController : Controller
    {
        protected WealthEconomyEntities db = new WealthEconomyEntities();

        protected BaseController()
        {
            ViewBag.IsAuthenticated = IsAuthenticated;
            ViewBag.CurrentUserId = CurrentUserId;
            ViewBag.CurrentUserEmail = CurrentUserEmail;
        }

        protected bool IsAuthenticated
        {
            get { return System.Web.HttpContext.Current.Session["CurrentUserId"] != null; }
        }

        protected int CurrentUserId
        {
            get
            {
                if (!IsAuthenticated)
                    return 0;
                return (int)System.Web.HttpContext.Current.Session["CurrentUserId"];
            }
        }

        protected string CurrentUserEmail
        {
            get
            {
                if (!IsAuthenticated)
                    return string.Empty;
                return System.Web.HttpContext.Current.Session["CurrentUserEmail"].ToString();
            }
        }
    }
}
