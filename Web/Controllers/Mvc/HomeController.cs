using System.Web.Mvc;

namespace Web.Controllers.Mvc
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            //using (var db = new CodeFirst.CodeFirstContext())
            //{
            //    var newLicense = new CodeFirst.License() { Name = "New license"};
            //    db.LicenseSet.Add(newLicense);
            //    db.OrganizationSet.Add(new CodeFirst.Organization() { Name = "New organization", License = newLicense });
            //    db.SaveChanges();
            //}


            return View();
        }
    }
}
