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
using BusinessObjects.Dto;
using DataObjects;

namespace Web.Controllers.Mvc
{
    public partial class ResourcePoolController : BaseController
    {
        // GET: /ResourcePool/
        public async Task<ActionResult> Index()
        {
            return View(await db.ResourcePoolSet.ToListAsync());
        }

        // GET: /ResourcePool/Details/5
        public async Task<ActionResult> Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            ResourcePool resourcepool = await db.ResourcePoolSet.FindAsync(id);
            if (resourcepool == null)
            {
                return HttpNotFound();
            }
            return View(resourcepool);
        }

        // GET: /ResourcePool/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: /ResourcePool/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include="Id,Name,CreatedOn,ModifiedOn,DeletedOn")] ResourcePoolDto resourcepoolDto)
        {
            var resourcepool = resourcepoolDto.ToBusinessObject();

            if (ModelState.IsValid)
            {
				resourcepool.CreatedOn = DateTime.Now;
				resourcepool.ModifiedOn = DateTime.Now;
                db.ResourcePoolSet.Add(resourcepool);
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }

            return View(resourcepool);
        }

        // GET: /ResourcePool/Edit/5
        public async Task<ActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            ResourcePool resourcepool = await db.ResourcePoolSet.FindAsync(id);
            if (resourcepool == null)
            {
                return HttpNotFound();
            }
            return View(resourcepool);
        }

        // POST: /ResourcePool/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include="Id,Name,CreatedOn,ModifiedOn,DeletedOn")] ResourcePoolDto resourcepoolDto)
        {
            var resourcepool = resourcepoolDto.ToBusinessObject();

            if (ModelState.IsValid)
            {
                db.Entry(resourcepool).State = EntityState.Modified;
				resourcepool.ModifiedOn = DateTime.Now;
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            return View(resourcepool);
        }

        // GET: /ResourcePool/Delete/5
        public async Task<ActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            ResourcePool resourcepool = await db.ResourcePoolSet.FindAsync(id);
            if (resourcepool == null)
            {
                return HttpNotFound();
            }
            return View(resourcepool);
        }

        // POST: /ResourcePool/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(int id)
        {
            ResourcePool resourcepool = await db.ResourcePoolSet.FindAsync(id);
            db.ResourcePoolSet.Remove(resourcepool);
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
