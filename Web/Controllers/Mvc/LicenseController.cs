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
    public class LicenseController : Controller
    {
        private WealthEconomyEntities db = new WealthEconomyEntities();

        // GET: /License/
        public async Task<ActionResult> Index()
        {
            return View(await db.LicenseSet.ToListAsync());
        }

        // GET: /License/Details/5
        public async Task<ActionResult> Details(short? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            License license = await db.LicenseSet.FindAsync(id);
            if (license == null)
            {
                return HttpNotFound();
            }
            return View(license);
        }

        // GET: /License/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: /License/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include="Id,Name,Description,Text,CreatedOn,ModifiedOn,DeletedOn")] License license)
        {
            if (ModelState.IsValid)
            {
				license.CreatedOn = DateTime.Now;
				license.ModifiedOn = DateTime.Now;
                db.LicenseSet.Add(license);
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }

            return View(license);
        }

        // GET: /License/Edit/5
        public async Task<ActionResult> Edit(short? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            License license = await db.LicenseSet.FindAsync(id);
            if (license == null)
            {
                return HttpNotFound();
            }
            return View(license);
        }

        // POST: /License/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include="Id,Name,Description,Text,CreatedOn,ModifiedOn,DeletedOn")] License license)
        {
            if (ModelState.IsValid)
            {
                db.Entry(license).State = EntityState.Modified;
				license.ModifiedOn = DateTime.Now;
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            return View(license);
        }

        // GET: /License/Delete/5
        public async Task<ActionResult> Delete(short? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            License license = await db.LicenseSet.FindAsync(id);
            if (license == null)
            {
                return HttpNotFound();
            }
            return View(license);
        }

        // POST: /License/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(short id)
        {
            License license = await db.LicenseSet.FindAsync(id);
            db.LicenseSet.Remove(license);
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
