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

namespace Web.Controllers.Mvc.Generated
{
    public partial class UserResourcePoolOrganizationController : BaseController
    {
        // GET: /UserResourcePoolOrganization/
        public async Task<ActionResult> Index()
        {
            var userresourcepoolorganization = db.UserResourcePoolOrganization.Include(u => u.User).Include(u => u.ResourcePoolOrganization);

            if (IsAuthenticated)
                userresourcepoolorganization = userresourcepoolorganization.Where(rating => rating.UserId == CurrentUserId);

            return View(await userresourcepoolorganization.ToListAsync());
        }

        // GET: /UserResourcePoolOrganization/Details/5
        public async Task<ActionResult> Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UserResourcePoolOrganization userresourcepoolorganization = await db.UserResourcePoolOrganization.FindAsync(id);
            if (userresourcepoolorganization == null)
            {
                return HttpNotFound();
            }
            return View(userresourcepoolorganization);
        }

        // GET: /UserResourcePoolOrganization/Create
        public ActionResult Create()
        {
            var userSet = db.UserSet.AsEnumerable();

            if (IsAuthenticated)
                userSet = userSet.Where(user => user.Id == CurrentUserId);

            ViewBag.UserId = new SelectList(userSet, "Id", "Email");
            ViewBag.ResourcePoolOrganizationId = new SelectList(db.ResourcePoolOrganization, "Id", "Name");
            return View();
        }

        // POST: /UserResourcePoolOrganization/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include="Id,UserId,ResourcePoolOrganizationId,NumberOfSales,QualityRating,CustomerSatisfactionRating,EmployeeSatisfactionRating,CreatedOn,ModifiedOn,DeletedOn")] UserResourcePoolOrganization userresourcepoolorganization)
        {
            if (ModelState.IsValid)
            {
				userresourcepoolorganization.CreatedOn = DateTime.Now;
				userresourcepoolorganization.ModifiedOn = DateTime.Now;
                db.UserResourcePoolOrganization.Add(userresourcepoolorganization);
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }

            var userSet = db.UserSet.AsEnumerable();

            if (IsAuthenticated)
                userSet = userSet.Where(user => user.Id == CurrentUserId);

            ViewBag.UserId = new SelectList(userSet, "Id", "Email", userresourcepoolorganization.UserId);
            ViewBag.ResourcePoolOrganizationId = new SelectList(db.ResourcePoolOrganization, "Id", "Name", userresourcepoolorganization.ResourcePoolOrganizationId);
            return View(userresourcepoolorganization);
        }

        // GET: /UserResourcePoolOrganization/Edit/5
        public async Task<ActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UserResourcePoolOrganization userresourcepoolorganization = await db.UserResourcePoolOrganization.FindAsync(id);
            if (userresourcepoolorganization == null)
            {
                return HttpNotFound();
            }

            var userSet = db.UserSet.AsEnumerable();

            if (IsAuthenticated)
                userSet = userSet.Where(user => user.Id == CurrentUserId);

            ViewBag.UserId = new SelectList(userSet, "Id", "Email", userresourcepoolorganization.UserId);
            ViewBag.ResourcePoolOrganizationId = new SelectList(db.ResourcePoolOrganization, "Id", "Name", userresourcepoolorganization.ResourcePoolOrganizationId);
            return View(userresourcepoolorganization);
        }

        // POST: /UserResourcePoolOrganization/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include="Id,UserId,ResourcePoolOrganizationId,NumberOfSales,QualityRating,CustomerSatisfactionRating,EmployeeSatisfactionRating,CreatedOn,ModifiedOn,DeletedOn")] UserResourcePoolOrganization userresourcepoolorganization)
        {
            if (ModelState.IsValid)
            {
                db.Entry(userresourcepoolorganization).State = EntityState.Modified;
				userresourcepoolorganization.ModifiedOn = DateTime.Now;
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }

            var userSet = db.UserSet.AsEnumerable();

            if (IsAuthenticated)
                userSet = userSet.Where(user => user.Id == CurrentUserId);

            ViewBag.UserId = new SelectList(userSet, "Id", "Email", userresourcepoolorganization.UserId);
            ViewBag.ResourcePoolOrganizationId = new SelectList(db.ResourcePoolOrganization, "Id", "Name", userresourcepoolorganization.ResourcePoolOrganizationId);
            return View(userresourcepoolorganization);
        }

        // GET: /UserResourcePoolOrganization/Delete/5
        public async Task<ActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UserResourcePoolOrganization userresourcepoolorganization = await db.UserResourcePoolOrganization.FindAsync(id);
            if (userresourcepoolorganization == null)
            {
                return HttpNotFound();
            }
            return View(userresourcepoolorganization);
        }

        // POST: /UserResourcePoolOrganization/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(int id)
        {
            UserResourcePoolOrganization userresourcepoolorganization = await db.UserResourcePoolOrganization.FindAsync(id);
            db.UserResourcePoolOrganization.Remove(userresourcepoolorganization);
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
