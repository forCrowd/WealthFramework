using BusinessObjects;
using System;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Web.Controllers.Mvc
{
    public partial class OrganizationController : Controller
    {
        // GET: /Organization/Report
        public async Task<ActionResult> Report()
        {
            var organizationset = db.OrganizationSet;
            return View(await organizationset.ToListAsync());
        }

        [HttpPost]
        public async Task<ActionResult> IncreaseNumberOfSales()
        {
            var organizationSet = db.OrganizationSet;

            foreach (var organization in organizationSet)
            {
                organization.NumberOfSales++;
                organization.ModifiedOn = DateTime.Now;
                db.Entry(organization).State = EntityState.Modified;
            }

            await db.SaveChangesAsync();
            return RedirectToAction("Report");
        }

        [HttpPost]
        public async Task<ActionResult> ResetNumberOfSales()
        {
            var organizationSet = db.OrganizationSet;

            foreach (var organization in organizationSet)
            {
                organization.NumberOfSales = 0;
                organization.ModifiedOn = DateTime.Now;
                db.Entry(organization).State = EntityState.Modified;
            }

            await db.SaveChangesAsync();
            return RedirectToAction("Report");
        }

        // GET: /Organization/CMRPReport
        public async Task<ActionResult> CMRPReport()
        {
            var organizationDbSet = db.OrganizationSet;
            var organizationSet = await organizationDbSet.ToListAsync();
            var newCMRP = new CrowdManagedResourcePool(organizationSet);
            return View(newCMRP);
        }

        [HttpPost]
        public async Task<ActionResult> IncreaseNumberOfSales2()
        {
            var organizationSet = db.OrganizationSet;

            foreach (var organization in organizationSet)
            {
                organization.NumberOfSales++;
                organization.ModifiedOn = DateTime.Now;
                db.Entry(organization).State = EntityState.Modified;
            }

            await db.SaveChangesAsync();
            return RedirectToAction("CMRPReport");
        }

        [HttpPost]
        public async Task<ActionResult> ResetNumberOfSales2()
        {
            var organizationSet = db.OrganizationSet;

            foreach (var organization in organizationSet)
            {
                organization.NumberOfSales = 0;
                organization.ModifiedOn = DateTime.Now;
                db.Entry(organization).State = EntityState.Modified;
            }

            await db.SaveChangesAsync();
            return RedirectToAction("CMRPReport");
        }
    }
}
