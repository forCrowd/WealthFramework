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
    public partial class UserDistributionIndexRatingController : Controller
    {
        private WealthEconomyEntities db = new WealthEconomyEntities();

        // GET: /UserDistributionIndexRating/
        public async Task<ActionResult> Index()
        {
            var userdistributionindexratingset = db.UserDistributionIndexRatingSet.Include(u => u.User);
            return View(await userdistributionindexratingset.ToListAsync());
        }

        // GET: /UserDistributionIndexRating/Details/5
        public async Task<ActionResult> Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UserDistributionIndexRating userdistributionindexrating = await db.UserDistributionIndexRatingSet.FindAsync(id);
            if (userdistributionindexrating == null)
            {
                return HttpNotFound();
            }
            return View(userdistributionindexrating);
        }

        // GET: /UserDistributionIndexRating/Create
        public ActionResult Create()
        {
            ViewBag.UserId = new SelectList(db.UserSet, "Id", "Email");
            return View();
        }

        // POST: /UserDistributionIndexRating/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include="Id,UserId,TotalCostIndexRating,KnowledgeIndexRating,QualityIndexRating,SectorIndexRating,EmployeeIndexRating,CustomerIndexRating,DistanceIndexRating,CreatedOn,ModifiedOn,DeletedOn")] UserDistributionIndexRating userdistributionindexrating)
        {
            if (ModelState.IsValid)
            {
				userdistributionindexrating.CreatedOn = DateTime.Now;
				userdistributionindexrating.ModifiedOn = DateTime.Now;
                db.UserDistributionIndexRatingSet.Add(userdistributionindexrating);
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }

            ViewBag.UserId = new SelectList(db.UserSet, "Id", "Email", userdistributionindexrating.UserId);
            return View(userdistributionindexrating);
        }

        // GET: /UserDistributionIndexRating/Edit/5
        public async Task<ActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UserDistributionIndexRating userdistributionindexrating = await db.UserDistributionIndexRatingSet.FindAsync(id);
            if (userdistributionindexrating == null)
            {
                return HttpNotFound();
            }
            ViewBag.UserId = new SelectList(db.UserSet, "Id", "Email", userdistributionindexrating.UserId);
            return View(userdistributionindexrating);
        }

        // POST: /UserDistributionIndexRating/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include="Id,UserId,TotalCostIndexRating,KnowledgeIndexRating,QualityIndexRating,SectorIndexRating,EmployeeIndexRating,CustomerIndexRating,DistanceIndexRating,CreatedOn,ModifiedOn,DeletedOn")] UserDistributionIndexRating userdistributionindexrating)
        {
            if (ModelState.IsValid)
            {
                db.Entry(userdistributionindexrating).State = EntityState.Modified;
				userdistributionindexrating.ModifiedOn = DateTime.Now;
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            ViewBag.UserId = new SelectList(db.UserSet, "Id", "Email", userdistributionindexrating.UserId);
            return View(userdistributionindexrating);
        }

        // GET: /UserDistributionIndexRating/Delete/5
        public async Task<ActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UserDistributionIndexRating userdistributionindexrating = await db.UserDistributionIndexRatingSet.FindAsync(id);
            if (userdistributionindexrating == null)
            {
                return HttpNotFound();
            }
            return View(userdistributionindexrating);
        }

        // POST: /UserDistributionIndexRating/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(int id)
        {
            UserDistributionIndexRating userdistributionindexrating = await db.UserDistributionIndexRatingSet.FindAsync(id);
            db.UserDistributionIndexRatingSet.Remove(userdistributionindexrating);
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
