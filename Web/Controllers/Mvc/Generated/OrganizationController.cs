using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Net;
using System.Web;
using System.Web.Mvc;
using BusinessObjects;
using DataObjects;

namespace Web.Controllers.Mvc
{
    public partial class OrganizationController : BaseController
    {
        // GET: /Organization/
        public async Task<ActionResult> Index()
        {
            var organizationset = db.OrganizationSet.Include(o => o.License).Include(o => o.Sector);

            return View(await organizationset.ToListAsync());
        }

        // GET: /Organization/Details/5
        public async Task<ActionResult> Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Organization organization = await db.OrganizationSet.FindAsync(id);
            if (organization == null)
            {
                return HttpNotFound();
            }
            return View(organization);
        }

        // GET: /Organization/Create
        public ActionResult Create()
        {
            ViewBag.LicenseId = new SelectList(db.LicenseSet, "Id", "Name");
            ViewBag.SectorId = new SelectList(db.SectorSet, "Id", "Name");

            return View();
        }

        // POST: /Organization/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include="Id,SectorId,Name,ProductionCost,SalesPrice,LicenseId,CreatedOn,ModifiedOn,DeletedOn")] Organization organization)
        {
            if (ModelState.IsValid)
            {
				organization.CreatedOn = DateTime.Now;
				organization.ModifiedOn = DateTime.Now;
                db.OrganizationSet.Add(organization);
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }

            ViewBag.LicenseId = new SelectList(db.LicenseSet, "Id", "Name", organization.LicenseId);
            ViewBag.SectorId = new SelectList(db.SectorSet, "Id", "Name", organization.SectorId);

            return View(organization);
        }

        // GET: /Organization/Edit/5
        public async Task<ActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Organization organization = await db.OrganizationSet.FindAsync(id);
            if (organization == null)
            {
                return HttpNotFound();
            }
            ViewBag.LicenseId = new SelectList(db.LicenseSet, "Id", "Name", organization.LicenseId);
            ViewBag.SectorId = new SelectList(db.SectorSet, "Id", "Name", organization.SectorId);
            
            return View(organization);
        }

        // POST: /Organization/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include="Id,SectorId,Name,ProductionCost,SalesPrice,LicenseId,CreatedOn,ModifiedOn,DeletedOn")] Organization organization)
        {
            if (ModelState.IsValid)
            {
                db.Entry(organization).State = EntityState.Modified;
				organization.ModifiedOn = DateTime.Now;
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            ViewBag.LicenseId = new SelectList(db.LicenseSet, "Id", "Name", organization.LicenseId);
            ViewBag.SectorId = new SelectList(db.SectorSet, "Id", "Name", organization.SectorId);

            return View(organization);
        }

        // GET: /Organization/Delete/5
        public async Task<ActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Organization organization = await db.OrganizationSet.FindAsync(id);
            if (organization == null)
            {
                return HttpNotFound();
            }
            return View(organization);
        }

        // POST: /Organization/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(int id)
        {
            Organization organization = await db.OrganizationSet.FindAsync(id);
            db.OrganizationSet.Remove(organization);
            await db.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
