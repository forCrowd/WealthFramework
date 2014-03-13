using BusinessObjects;
using BusinessObjects.Dto;
using Facade;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Web.Controllers.Mvc.Generated
{
    public partial class ResourcePoolOrganizationController : BaseController
    {
        ResourcePoolOrganizationUnitOfWork unitOfWork = new ResourcePoolOrganizationUnitOfWork();

        // GET: /ResourcePoolOrganization/
        public async Task<ActionResult> Index()
        {
            var resourcepoolorganizationset = unitOfWork.AllLiveIncluding(r => r.Organization, r => r.ResourcePool);
            return View(await resourcepoolorganizationset.ToListAsync());
        }

        // GET: /ResourcePoolOrganization/Details/5
        public async Task<ActionResult> Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            ResourcePoolOrganization resourcepoolorganization = await unitOfWork.FindAsync(id);
            if (resourcepoolorganization == null)
            {
                return HttpNotFound();
            }
            return View(resourcepoolorganization);
        }

        // GET: /ResourcePoolOrganization/Create
        public ActionResult Create()
        {
            ViewBag.OrganizationId = new SelectList(unitOfWork.AllOrganizationLive.AsEnumerable(), "Id", "Name");
            ViewBag.ResourcePoolId = new SelectList(unitOfWork.AllResourcePoolLive.AsEnumerable(), "Id", "Name");
            return View();
        }

        // POST: /ResourcePoolOrganization/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include = "Id,ResourcePoolId,OrganizationId,CreatedOn,ModifiedOn,DeletedOn")] ResourcePoolOrganizationDto resourcepoolorganizationdto)
        {
			var resourcepoolorganization = resourcepoolorganizationdto.ToBusinessObject();

            if (ModelState.IsValid)
            {
                unitOfWork.InsertOrUpdate(resourcepoolorganization);
                await unitOfWork.SaveAsync();
                return RedirectToAction("Index");
            }

            ViewBag.OrganizationId = new SelectList(unitOfWork.AllOrganizationLive.AsEnumerable(), "Id", "Name", resourcepoolorganization.OrganizationId);
            ViewBag.ResourcePoolId = new SelectList(unitOfWork.AllResourcePoolLive.AsEnumerable(), "Id", "Name", resourcepoolorganization.ResourcePoolId);
            return View(resourcepoolorganization);
        }

        // GET: /ResourcePoolOrganization/Edit/5
        public async Task<ActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            ResourcePoolOrganization resourcepoolorganization = await unitOfWork.FindAsync(id);
            if (resourcepoolorganization == null)
            {
                return HttpNotFound();
            }
            ViewBag.OrganizationId = new SelectList(unitOfWork.AllOrganizationLive.AsEnumerable(), "Id", "Name", resourcepoolorganization.OrganizationId);
            ViewBag.ResourcePoolId = new SelectList(unitOfWork.AllResourcePoolLive.AsEnumerable(), "Id", "Name", resourcepoolorganization.ResourcePoolId);
            return View(resourcepoolorganization);
        }

        // POST: /ResourcePoolOrganization/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include = "Id,ResourcePoolId,OrganizationId,CreatedOn,ModifiedOn,DeletedOn")] ResourcePoolOrganizationDto resourcepoolorganizationdto)
        {
			var resourcepoolorganization = resourcepoolorganizationdto.ToBusinessObject();

            if (ModelState.IsValid)
            {
                unitOfWork.InsertOrUpdate(resourcepoolorganization);
                await unitOfWork.SaveAsync();
                return RedirectToAction("Index");
            }
            ViewBag.OrganizationId = new SelectList(unitOfWork.AllOrganizationLive.AsEnumerable(), "Id", "Name", resourcepoolorganization.OrganizationId);
            ViewBag.ResourcePoolId = new SelectList(unitOfWork.AllResourcePoolLive.AsEnumerable(), "Id", "Name", resourcepoolorganization.ResourcePoolId);
            return View(resourcepoolorganization);
        }

        // GET: /ResourcePoolOrganization/Delete/5
        public async Task<ActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            ResourcePoolOrganization resourcepoolorganization = await unitOfWork.FindAsync(id);
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
            unitOfWork.Delete(id);
            await unitOfWork.SaveAsync();
            return RedirectToAction("Index");
        }
    }
}
