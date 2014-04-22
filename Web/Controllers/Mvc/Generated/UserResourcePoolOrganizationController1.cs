namespace Web.Controllers.Mvc
{
    using BusinessObjects;
    using BusinessObjects.Dto;
    using Facade;
    using System.Data.Entity;
    using System.Linq;
    using System.Net;
    using System.Threading.Tasks;
    using System.Web.Mvc;

    public partial class UserResourcePoolOrganizationController : BaseController
    {
        UserResourcePoolOrganizationUnitOfWork unitOfWork = new UserResourcePoolOrganizationUnitOfWork();

        // GET: /UserResourcePoolOrganization/
        public async Task<ActionResult> Index()
        {
            var userresourcepoolorganization = unitOfWork.AllLiveIncluding(u => u.User, u => u.ResourcePoolOrganization);

            if (IsAuthenticated)
                userresourcepoolorganization = userresourcepoolorganization.Where(item => item.UserId == CurrentUserId);

            return View(await userresourcepoolorganization.ToListAsync());
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

            var userSet = unitOfWork.UserSetLive.AsEnumerable();

            if (IsAuthenticated)
                userSet = userSet.Where(user => user.Id == CurrentUserId);

            ViewBag.UserId = new SelectList(userSet, "Id", "Email");
            ViewBag.ResourcePoolOrganizationId = new SelectList(unitOfWork.ResourcePoolOrganizationSetLive.AsEnumerable(), "Id", "Name");
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
                unitOfWork.Insert(userresourcepoolorganization);
                await unitOfWork.SaveAsync();
                return RedirectToAction("Index");
            }


            var userSet = unitOfWork.UserSetLive.AsEnumerable();

            if (IsAuthenticated)
                userSet = userSet.Where(user => user.Id == CurrentUserId);

            ViewBag.UserId = new SelectList(userSet, "Id", "Email", userresourcepoolorganization.UserId);
            ViewBag.ResourcePoolOrganizationId = new SelectList(unitOfWork.ResourcePoolOrganizationSetLive.AsEnumerable(), "Id", "Name", userresourcepoolorganization.ResourcePoolOrganizationId);
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


            var userSet = unitOfWork.UserSetLive.AsEnumerable();

            if (IsAuthenticated)
                userSet = userSet.Where(user => user.Id == CurrentUserId);

            ViewBag.UserId = new SelectList(userSet, "Id", "Email", userresourcepoolorganization.UserId);
            ViewBag.ResourcePoolOrganizationId = new SelectList(unitOfWork.ResourcePoolOrganizationSetLive.AsEnumerable(), "Id", "Name", userresourcepoolorganization.ResourcePoolOrganizationId);
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
                unitOfWork.Update(userresourcepoolorganization);
                await unitOfWork.SaveAsync();
                return RedirectToAction("Index");
            }


            var userSet = unitOfWork.UserSetLive.AsEnumerable();

            if (IsAuthenticated)
                userSet = userSet.Where(user => user.Id == CurrentUserId);

            ViewBag.UserId = new SelectList(userSet, "Id", "Email", userresourcepoolorganization.UserId);
            ViewBag.ResourcePoolOrganizationId = new SelectList(unitOfWork.ResourcePoolOrganizationSetLive.AsEnumerable(), "Id", "Name", userresourcepoolorganization.ResourcePoolOrganizationId);
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
