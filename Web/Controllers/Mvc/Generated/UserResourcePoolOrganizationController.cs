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
    public partial class UserResourcePoolOrganizationController : BaseController
    {
        UserResourcePoolOrganizationUnitOfWork unitOfWork = new UserResourcePoolOrganizationUnitOfWork();

        // GET: /UserResourcePoolOrganization/
        public async Task<ActionResult> Index()
        {
            var userresourcepoolorganizationset = unitOfWork.AllLiveIncluding(u => u.User, u => u.ResourcePoolOrganization);
            return View(await userresourcepoolorganizationset.ToListAsync());
        }

        // GET: /UserResourcePoolOrganization/Details/5
        public async Task<ActionResult> Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UserResourcePoolOrganization userresourcepoolorganization = await unitOfWork.FindAsync(id);
            if (userresourcepoolorganization == null)
            {
                return HttpNotFound();
            }
            return View(userresourcepoolorganization);
        }

        // GET: /UserResourcePoolOrganization/Create
        public ActionResult Create()
        {
            ViewBag.UserId = new SelectList(unitOfWork.AllUserLive.AsEnumerable(), "Id", "Email");
            ViewBag.ResourcePoolOrganizationId = new SelectList(unitOfWork.AllResourcePoolOrganizationLive.AsEnumerable(), "Id", "Id");
            return View();
        }

        // POST: /UserResourcePoolOrganization/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include = "Id,UserId,ResourcePoolOrganizationId,NumberOfSales,QualityRating,CustomerSatisfactionRating,EmployeeSatisfactionRating,CreatedOn,ModifiedOn,DeletedOn")] UserResourcePoolOrganizationDto userresourcepoolorganizationdto)
        {
			var userresourcepoolorganization = userresourcepoolorganizationdto.ToBusinessObject();

            if (ModelState.IsValid)
            {
                unitOfWork.InsertOrUpdate(userresourcepoolorganization);
                await unitOfWork.SaveAsync();
                return RedirectToAction("Index");
            }

            ViewBag.UserId = new SelectList(unitOfWork.AllUserLive.AsEnumerable(), "Id", "Email", userresourcepoolorganization.UserId);
            ViewBag.ResourcePoolOrganizationId = new SelectList(unitOfWork.AllResourcePoolOrganizationLive.AsEnumerable(), "Id", "Id", userresourcepoolorganization.ResourcePoolOrganizationId);
            return View(userresourcepoolorganization);
        }

        // GET: /UserResourcePoolOrganization/Edit/5
        public async Task<ActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UserResourcePoolOrganization userresourcepoolorganization = await unitOfWork.FindAsync(id);
            if (userresourcepoolorganization == null)
            {
                return HttpNotFound();
            }
            ViewBag.UserId = new SelectList(unitOfWork.AllUserLive.AsEnumerable(), "Id", "Email", userresourcepoolorganization.UserId);
            ViewBag.ResourcePoolOrganizationId = new SelectList(unitOfWork.AllResourcePoolOrganizationLive.AsEnumerable(), "Id", "Id", userresourcepoolorganization.ResourcePoolOrganizationId);
            return View(userresourcepoolorganization);
        }

        // POST: /UserResourcePoolOrganization/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include = "Id,UserId,ResourcePoolOrganizationId,NumberOfSales,QualityRating,CustomerSatisfactionRating,EmployeeSatisfactionRating,CreatedOn,ModifiedOn,DeletedOn")] UserResourcePoolOrganizationDto userresourcepoolorganizationdto)
        {
			var userresourcepoolorganization = userresourcepoolorganizationdto.ToBusinessObject();

            if (ModelState.IsValid)
            {
                unitOfWork.InsertOrUpdate(userresourcepoolorganization);
                await unitOfWork.SaveAsync();
                return RedirectToAction("Index");
            }
            ViewBag.UserId = new SelectList(unitOfWork.AllUserLive.AsEnumerable(), "Id", "Email", userresourcepoolorganization.UserId);
            ViewBag.ResourcePoolOrganizationId = new SelectList(unitOfWork.AllResourcePoolOrganizationLive.AsEnumerable(), "Id", "Id", userresourcepoolorganization.ResourcePoolOrganizationId);
            return View(userresourcepoolorganization);
        }

        // GET: /UserResourcePoolOrganization/Delete/5
        public async Task<ActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UserResourcePoolOrganization userresourcepoolorganization = await unitOfWork.FindAsync(id);
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
            unitOfWork.Delete(id);
            await unitOfWork.SaveAsync();
            return RedirectToAction("Index");
        }
    }
}
