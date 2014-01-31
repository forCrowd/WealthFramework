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
    public partial class UserSectorRatingController : BaseController
    {
        // GET: /UserSectorRating/
        public async Task<ActionResult> Index()
        {
            var usersectorratingset = db.UserSectorRatingSet.Include(u => u.Sector).Include(u => u.User);

            if (IsAuthenticated)
                usersectorratingset = usersectorratingset.Where(rating => rating.UserId == CurrentUserId);

            return View(await usersectorratingset.ToListAsync());
        }

        // GET: /UserSectorRating/Details/5
        public async Task<ActionResult> Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UserSectorRating usersectorrating = await db.UserSectorRatingSet.FindAsync(id);
            if (usersectorrating == null)
            {
                return HttpNotFound();
            }
            return View(usersectorrating);
        }

        // GET: /UserSectorRating/Create
        public ActionResult Create()
        {
            var userSet = db.UserSet.AsEnumerable();

            if (IsAuthenticated)
                userSet = userSet.Where(user => user.Id == CurrentUserId);

            ViewBag.SectorId = new SelectList(db.SectorSet, "Id", "Name");
            ViewBag.UserId = new SelectList(userSet, "Id", "Email");
            return View();
        }

        // POST: /UserSectorRating/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include="Id,UserId,SectorId,Rating,CreatedOn,ModifiedOn,DeletedOn")] UserSectorRating usersectorrating)
        {
            if (ModelState.IsValid)
            {
				usersectorrating.CreatedOn = DateTime.Now;
				usersectorrating.ModifiedOn = DateTime.Now;
                db.UserSectorRatingSet.Add(usersectorrating);
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }

            var userSet = db.UserSet.AsEnumerable();

            if (IsAuthenticated)
                userSet = userSet.Where(user => user.Id == CurrentUserId);

            ViewBag.SectorId = new SelectList(db.SectorSet, "Id", "Name", usersectorrating.SectorId);
            ViewBag.UserId = new SelectList(userSet, "Id", "Email", usersectorrating.UserId);
            return View(usersectorrating);
        }

        // GET: /UserSectorRating/Edit/5
        public async Task<ActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UserSectorRating usersectorrating = await db.UserSectorRatingSet.FindAsync(id);
            if (usersectorrating == null)
            {
                return HttpNotFound();
            }

            var userSet = db.UserSet.AsEnumerable();

            if (IsAuthenticated)
                userSet = userSet.Where(user => user.Id == CurrentUserId);

            ViewBag.SectorId = new SelectList(db.SectorSet, "Id", "Name", usersectorrating.SectorId);
            ViewBag.UserId = new SelectList(userSet, "Id", "Email", usersectorrating.UserId);
            return View(usersectorrating);
        }

        // POST: /UserSectorRating/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include="Id,UserId,SectorId,Rating,CreatedOn,ModifiedOn,DeletedOn")] UserSectorRating usersectorrating)
        {
            if (ModelState.IsValid)
            {
                db.Entry(usersectorrating).State = EntityState.Modified;
				usersectorrating.ModifiedOn = DateTime.Now;
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }

            var userSet = db.UserSet.AsEnumerable();

            if (IsAuthenticated)
                userSet = userSet.Where(user => user.Id == CurrentUserId);

            ViewBag.SectorId = new SelectList(db.SectorSet, "Id", "Name", usersectorrating.SectorId);
            ViewBag.UserId = new SelectList(userSet, "Id", "Email", usersectorrating.UserId);
            return View(usersectorrating);
        }

        // GET: /UserSectorRating/Delete/5
        public async Task<ActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UserSectorRating usersectorrating = await db.UserSectorRatingSet.FindAsync(id);
            if (usersectorrating == null)
            {
                return HttpNotFound();
            }
            return View(usersectorrating);
        }

        // POST: /UserSectorRating/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(int id)
        {
            UserSectorRating usersectorrating = await db.UserSectorRatingSet.FindAsync(id);
            db.UserSectorRatingSet.Remove(usersectorrating);
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
