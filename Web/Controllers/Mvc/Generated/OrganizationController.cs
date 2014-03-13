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
    public partial class OrganizationController : BaseController
    {
        OrganizationUnitOfWork unitOfWork = new OrganizationUnitOfWork();

        // GET: /Organization/
        public async Task<ActionResult> Index()
        {
            var organizationset = unitOfWork.AllLiveIncluding(o => o.Sector, o => o.License);
            return View(await organizationset.ToListAsync());
        }

        // GET: /Organization/Details/5
        public async Task<ActionResult> Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Organization organization = await unitOfWork.FindAsync(id);
            if (organization == null)
            {
                return HttpNotFound();
            }
            return View(organization);
        }

        // GET: /Organization/Create
        public ActionResult Create()
        {
            ViewBag.SectorId = new SelectList(unitOfWork.AllSectorLive.AsEnumerable(), "Id", "Name");
            ViewBag.LicenseId = new SelectList(unitOfWork.AllLicenseLive.AsEnumerable(), "Id", "Name");
            return View();
        }

        // POST: /Organization/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include = "Id,SectorId,Name,ProductionCost,SalesPrice,LicenseId,CreatedOn,ModifiedOn,DeletedOn")] OrganizationDto organizationdto)
        {
			var organization = organizationdto.ToBusinessObject();

            if (ModelState.IsValid)
            {
                unitOfWork.InsertOrUpdate(organization);
                await unitOfWork.SaveAsync();
                return RedirectToAction("Index");
            }

            ViewBag.SectorId = new SelectList(unitOfWork.AllSectorLive.AsEnumerable(), "Id", "Name", organization.SectorId);
            ViewBag.LicenseId = new SelectList(unitOfWork.AllLicenseLive.AsEnumerable(), "Id", "Name", organization.LicenseId);
            return View(organization);
        }

        // GET: /Organization/Edit/5
        public async Task<ActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Organization organization = await unitOfWork.FindAsync(id);
            if (organization == null)
            {
                return HttpNotFound();
            }
            ViewBag.SectorId = new SelectList(unitOfWork.AllSectorLive.AsEnumerable(), "Id", "Name", organization.SectorId);
            ViewBag.LicenseId = new SelectList(unitOfWork.AllLicenseLive.AsEnumerable(), "Id", "Name", organization.LicenseId);
            return View(organization);
        }

        // POST: /Organization/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include = "Id,SectorId,Name,ProductionCost,SalesPrice,LicenseId,CreatedOn,ModifiedOn,DeletedOn")] OrganizationDto organizationdto)
        {
			var organization = organizationdto.ToBusinessObject();

            if (ModelState.IsValid)
            {
                unitOfWork.InsertOrUpdate(organization);
                await unitOfWork.SaveAsync();
                return RedirectToAction("Index");
            }
            ViewBag.SectorId = new SelectList(unitOfWork.AllSectorLive.AsEnumerable(), "Id", "Name", organization.SectorId);
            ViewBag.LicenseId = new SelectList(unitOfWork.AllLicenseLive.AsEnumerable(), "Id", "Name", organization.LicenseId);
            return View(organization);
        }

        // GET: /Organization/Delete/5
        public async Task<ActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Organization organization = await unitOfWork.FindAsync(id);
            if (organization == null)
            {
                return HttpNotFound();
            }
            return View(organization);
        }

        // POST: /Organization/Delete/5
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
