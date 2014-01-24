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
    public class UserLicenseRatingController : Controller
    {
        private WealthEconomyEntities db = new WealthEconomyEntities();

        // GET: /UserLicenseRating/
        public async Task<ActionResult> Index()
        {
            var userlicenseratingset = db.UserLicenseRatingSet.Include(u => u.License).Include(u => u.User);
            return View(await userlicenseratingset.ToListAsync());
        }

        // GET: /UserLicenseRating/Details/5
        public async Task<ActionResult> Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UserLicenseRating userlicenserating = await db.UserLicenseRatingSet.FindAsync(id);
            if (userlicenserating == null)
            {
                return HttpNotFound();
            }
            return View(userlicenserating);
        }

        // GET: /UserLicenseRating/Create
        public ActionResult Create()
        {
            ViewBag.LicenseId = new SelectList(db.LicenseSet, "Id", "Name");
            ViewBag.UserId = new SelectList(db.UserSet, "Id", "Email");
            return View();
        }

        // POST: /UserLicenseRating/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include="Id,UserId,LicenseId,Rating,CreatedOn,ModifiedOn,DeletedOn")] UserLicenseRating userlicenserating)
        {
            if (ModelState.IsValid)
            {
				userlicenserating.CreatedOn = DateTime.Now;
				userlicenserating.ModifiedOn = DateTime.Now;
                db.UserLicenseRatingSet.Add(userlicenserating);
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }

            ViewBag.LicenseId = new SelectList(db.LicenseSet, "Id", "Name", userlicenserating.LicenseId);
            ViewBag.UserId = new SelectList(db.UserSet, "Id", "Email", userlicenserating.UserId);
            return View(userlicenserating);
        }

        // GET: /UserLicenseRating/Edit/5
        public async Task<ActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UserLicenseRating userlicenserating = await db.UserLicenseRatingSet.FindAsync(id);
            if (userlicenserating == null)
            {
                return HttpNotFound();
            }
            ViewBag.LicenseId = new SelectList(db.LicenseSet, "Id", "Name", userlicenserating.LicenseId);
            ViewBag.UserId = new SelectList(db.UserSet, "Id", "Email", userlicenserating.UserId);
            return View(userlicenserating);
        }

        // POST: /UserLicenseRating/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include="Id,UserId,LicenseId,Rating,CreatedOn,ModifiedOn,DeletedOn")] UserLicenseRating userlicenserating)
        {
            if (ModelState.IsValid)
            {
                db.Entry(userlicenserating).State = EntityState.Modified;
				userlicenserating.ModifiedOn = DateTime.Now;
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            ViewBag.LicenseId = new SelectList(db.LicenseSet, "Id", "Name", userlicenserating.LicenseId);
            ViewBag.UserId = new SelectList(db.UserSet, "Id", "Email", userlicenserating.UserId);
            return View(userlicenserating);
        }

        // GET: /UserLicenseRating/Delete/5
        public async Task<ActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UserLicenseRating userlicenserating = await db.UserLicenseRatingSet.FindAsync(id);
            if (userlicenserating == null)
            {
                return HttpNotFound();
            }
            return View(userlicenserating);
        }

        // POST: /UserLicenseRating/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(int id)
        {
            UserLicenseRating userlicenserating = await db.UserLicenseRatingSet.FindAsync(id);
            db.UserLicenseRatingSet.Remove(userlicenserating);
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
