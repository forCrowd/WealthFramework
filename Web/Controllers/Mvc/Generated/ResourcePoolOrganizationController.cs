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
    public partial class ResourcePoolOrganizationController : BaseController
    {
        // GET: /ResourcePoolOrganization/
        public async Task<ActionResult> Index()
        {
            var resourcepoolorganization = db.ResourcePoolOrganizationSet.Include(r => r.Organization).Include(r => r.ResourcePool);
            return View(await resourcepoolorganization.ToListAsync());
        }

        // GET: /ResourcePoolOrganization/Details/5
        public async Task<ActionResult> Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            ResourcePoolOrganization resourcepoolorganization = await db.ResourcePoolOrganizationSet.FindAsync(id);
            if (resourcepoolorganization == null)
            {
                return HttpNotFound();
            }
            return View(resourcepoolorganization);
        }

        // GET: /ResourcePoolOrganization/Create
        public ActionResult Create()
        {
            ViewBag.OrganizationId = new SelectList(db.OrganizationSet, "Id", "Name");
            ViewBag.ResourcePoolId = new SelectList(db.ResourcePoolSet, "Id", "Name");
            return View();
        }

        // POST: /ResourcePoolOrganization/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include="Id,ResourcePoolId,OrganizationId,CreatedOn,ModifiedOn,DeletedOn")] ResourcePoolOrganizationDto resourcepoolorganizationDto)
        {
            var resourcepoolorganization = resourcepoolorganizationDto.ToBusinessObject();

            if (ModelState.IsValid)
            {
				resourcepoolorganization.CreatedOn = DateTime.Now;
				resourcepoolorganization.ModifiedOn = DateTime.Now;
                db.ResourcePoolOrganizationSet.Add(resourcepoolorganization);
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }

            ViewBag.OrganizationId = new SelectList(db.OrganizationSet, "Id", "Name", resourcepoolorganization.OrganizationId);
            ViewBag.ResourcePoolId = new SelectList(db.ResourcePoolSet, "Id", "Name", resourcepoolorganization.ResourcePoolId);
            return View(resourcepoolorganization);
        }

        // GET: /ResourcePoolOrganization/Edit/5
        public async Task<ActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            ResourcePoolOrganization resourcepoolorganization = await db.ResourcePoolOrganizationSet.FindAsync(id);
            if (resourcepoolorganization == null)
            {
                return HttpNotFound();
            }
            ViewBag.OrganizationId = new SelectList(db.OrganizationSet, "Id", "Name", resourcepoolorganization.OrganizationId);
            ViewBag.ResourcePoolId = new SelectList(db.ResourcePoolSet, "Id", "Name", resourcepoolorganization.ResourcePoolId);
            return View(resourcepoolorganization);
        }

        // POST: /ResourcePoolOrganization/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include="Id,ResourcePoolId,OrganizationId,CreatedOn,ModifiedOn,DeletedOn")] ResourcePoolOrganizationDto resourcepoolorganizationDto)
        {
            var resourcepoolorganization = resourcepoolorganizationDto.ToBusinessObject();

            if (ModelState.IsValid)
            {
                db.Entry(resourcepoolorganization).State = EntityState.Modified;
				resourcepoolorganization.ModifiedOn = DateTime.Now;
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            ViewBag.OrganizationId = new SelectList(db.OrganizationSet, "Id", "Name", resourcepoolorganization.OrganizationId);
            ViewBag.ResourcePoolId = new SelectList(db.ResourcePoolSet, "Id", "Name", resourcepoolorganization.ResourcePoolId);
            return View(resourcepoolorganization);
        }

        // GET: /ResourcePoolOrganization/Delete/5
        public async Task<ActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            ResourcePoolOrganization resourcepoolorganization = await db.ResourcePoolOrganizationSet.FindAsync(id);
            if (resourcepoolorganization == null)
            {
                return HttpNotFound();
            }
            return View(resourcepoolorganization);
        }

        // POST: /ResourcePoolOrganization/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(int id)
        {
            ResourcePoolOrganization resourcepoolorganization = await db.ResourcePoolOrganizationSet.FindAsync(id);
            db.ResourcePoolOrganizationSet.Remove(resourcepoolorganization);
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
