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
    public class UserOrganizationRatingController : Controller
    {
        private WealthEconomyEntities db = new WealthEconomyEntities();

        // GET: /UserOrganizationRating/
        public async Task<ActionResult> Index()
        {
            var userorganizationratingset = db.UserOrganizationRatingSet.Include(u => u.Organization).Include(u => u.User);
            return View(await userorganizationratingset.ToListAsync());
        }

        // GET: /UserOrganizationRating/Details/5
        public async Task<ActionResult> Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UserOrganizationRating userorganizationrating = await db.UserOrganizationRatingSet.FindAsync(id);
            if (userorganizationrating == null)
            {
                return HttpNotFound();
            }
            return View(userorganizationrating);
        }

        // GET: /UserOrganizationRating/Create
        public ActionResult Create()
        {
            ViewBag.OrganizationId = new SelectList(db.OrganizationSet, "Id", "Name");
            ViewBag.UserId = new SelectList(db.UserSet, "Id", "Email");
            return View();
        }

        // POST: /UserOrganizationRating/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include="Id,UserId,OrganizationId,QualityRating,CustomSatisfactionRating,EmployeeSatisfactionRating,CreatedOn,ModifiedOn,DeletedOn")] UserOrganizationRating userorganizationrating)
        {
            if (ModelState.IsValid)
            {
				userorganizationrating.CreatedOn = DateTime.Now;
				userorganizationrating.ModifiedOn = DateTime.Now;
                db.UserOrganizationRatingSet.Add(userorganizationrating);
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }

            ViewBag.OrganizationId = new SelectList(db.OrganizationSet, "Id", "Name", userorganizationrating.OrganizationId);
            ViewBag.UserId = new SelectList(db.UserSet, "Id", "Email", userorganizationrating.UserId);
            return View(userorganizationrating);
        }

        // GET: /UserOrganizationRating/Edit/5
        public async Task<ActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UserOrganizationRating userorganizationrating = await db.UserOrganizationRatingSet.FindAsync(id);
            if (userorganizationrating == null)
            {
                return HttpNotFound();
            }
            ViewBag.OrganizationId = new SelectList(db.OrganizationSet, "Id", "Name", userorganizationrating.OrganizationId);
            ViewBag.UserId = new SelectList(db.UserSet, "Id", "Email", userorganizationrating.UserId);
            return View(userorganizationrating);
        }

        // POST: /UserOrganizationRating/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include="Id,UserId,OrganizationId,QualityRating,CustomSatisfactionRating,EmployeeSatisfactionRating,CreatedOn,ModifiedOn,DeletedOn")] UserOrganizationRating userorganizationrating)
        {
            if (ModelState.IsValid)
            {
                db.Entry(userorganizationrating).State = EntityState.Modified;
				userorganizationrating.ModifiedOn = DateTime.Now;
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            ViewBag.OrganizationId = new SelectList(db.OrganizationSet, "Id", "Name", userorganizationrating.OrganizationId);
            ViewBag.UserId = new SelectList(db.UserSet, "Id", "Email", userorganizationrating.UserId);
            return View(userorganizationrating);
        }

        // GET: /UserOrganizationRating/Delete/5
        public async Task<ActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UserOrganizationRating userorganizationrating = await db.UserOrganizationRatingSet.FindAsync(id);
            if (userorganizationrating == null)
            {
                return HttpNotFound();
            }
            return View(userorganizationrating);
        }

        // POST: /UserOrganizationRating/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(int id)
        {
            UserOrganizationRating userorganizationrating = await db.UserOrganizationRatingSet.FindAsync(id);
            db.UserOrganizationRatingSet.Remove(userorganizationrating);
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
