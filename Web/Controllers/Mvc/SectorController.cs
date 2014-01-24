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
    public class SectorController : Controller
    {
        private WealthEconomyEntities db = new WealthEconomyEntities();

        // GET: /Sector/
        public async Task<ActionResult> Index()
        {
            return View(await db.SectorSet.ToListAsync());
        }

        // GET: /Sector/Details/5
        public async Task<ActionResult> Details(byte? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Sector sector = await db.SectorSet.FindAsync(id);
            if (sector == null)
            {
                return HttpNotFound();
            }
            return View(sector);
        }

        // GET: /Sector/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: /Sector/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include="Id,Name,Description,CreatedOn,ModifiedOn,DeletedOn")] Sector sector)
        {
            if (ModelState.IsValid)
            {
				sector.CreatedOn = DateTime.Now;
				sector.ModifiedOn = DateTime.Now;
                db.SectorSet.Add(sector);
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }

            return View(sector);
        }

        // GET: /Sector/Edit/5
        public async Task<ActionResult> Edit(byte? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Sector sector = await db.SectorSet.FindAsync(id);
            if (sector == null)
            {
                return HttpNotFound();
            }
            return View(sector);
        }

        // POST: /Sector/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include="Id,Name,Description,CreatedOn,ModifiedOn,DeletedOn")] Sector sector)
        {
            if (ModelState.IsValid)
            {
                db.Entry(sector).State = EntityState.Modified;
				sector.ModifiedOn = DateTime.Now;
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            return View(sector);
        }

        // GET: /Sector/Delete/5
        public async Task<ActionResult> Delete(byte? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Sector sector = await db.SectorSet.FindAsync(id);
            if (sector == null)
            {
                return HttpNotFound();
            }
            return View(sector);
        }

        // POST: /Sector/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(byte id)
        {
            Sector sector = await db.SectorSet.FindAsync(id);
            db.SectorSet.Remove(sector);
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
