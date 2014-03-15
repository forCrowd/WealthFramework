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

    public partial class UserResourcePoolController : BaseController
    {
        UserResourcePoolUnitOfWork unitOfWork = new UserResourcePoolUnitOfWork();

        // GET: /UserResourcePool/
        public async Task<ActionResult> Index()
        {
            var userresourcepoolset = unitOfWork.AllLiveIncluding(u => u.User, u => u.ResourcePool);

            if (IsAuthenticated)
                userresourcepoolset = userresourcepoolset.Where(item => item.UserId == CurrentUserId);

            return View(await userresourcepoolset.ToListAsync());
        }

        // GET: /UserResourcePool/Details/5
        public async Task<ActionResult> Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UserResourcePool userresourcepool = await unitOfWork.FindAsync(id);
            if (userresourcepool == null)
            {
                return HttpNotFound();
            }
            return View(userresourcepool);
        }

        // GET: /UserResourcePool/Create
        public ActionResult Create()
        {

            var userSet = unitOfWork.UserSetLive.AsEnumerable();

            if (IsAuthenticated)
                userSet = userSet.Where(user => user.Id == CurrentUserId);

            ViewBag.UserId = new SelectList(userSet, "Id", "Email");
            ViewBag.ResourcePoolId = new SelectList(unitOfWork.ResourcePoolSetLive.AsEnumerable(), "Id", "Name");
            return View();
        }

        // POST: /UserResourcePool/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include = "Id,UserId,ResourcePoolId,ResourcePoolRate,TotalCostIndexRating,KnowledgeIndexRating,QualityIndexRating,SectorIndexRating,EmployeeSatisfactionIndexRating,CustomerSatisfactionIndexRating,DistanceIndexRating,CreatedOn,ModifiedOn,DeletedOn")] UserResourcePoolDto userresourcepooldto)
        {
            var userresourcepool = userresourcepooldto.ToBusinessObject();

            if (ModelState.IsValid)
            {
                unitOfWork.InsertOrUpdate(userresourcepool);
                await unitOfWork.SaveAsync();
                return RedirectToAction("Index");
            }


            var userSet = unitOfWork.UserSetLive.AsEnumerable();

            if (IsAuthenticated)
                userSet = userSet.Where(user => user.Id == CurrentUserId);

            ViewBag.UserId = new SelectList(userSet, "Id", "Email", userresourcepool.UserId);
            ViewBag.ResourcePoolId = new SelectList(unitOfWork.ResourcePoolSetLive.AsEnumerable(), "Id", "Name", userresourcepool.ResourcePoolId);
            return View(userresourcepool);
        }

        // GET: /UserResourcePool/Edit/5
        public async Task<ActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UserResourcePool userresourcepool = await unitOfWork.FindAsync(id);
            if (userresourcepool == null)
            {
                return HttpNotFound();
            }


            var userSet = unitOfWork.UserSetLive.AsEnumerable();

            if (IsAuthenticated)
                userSet = userSet.Where(user => user.Id == CurrentUserId);

            ViewBag.UserId = new SelectList(userSet, "Id", "Email", userresourcepool.UserId);
            ViewBag.ResourcePoolId = new SelectList(unitOfWork.ResourcePoolSetLive.AsEnumerable(), "Id", "Name", userresourcepool.ResourcePoolId);
            return View(userresourcepool);
        }

        // POST: /UserResourcePool/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include = "Id,UserId,ResourcePoolId,ResourcePoolRate,TotalCostIndexRating,KnowledgeIndexRating,QualityIndexRating,SectorIndexRating,EmployeeSatisfactionIndexRating,CustomerSatisfactionIndexRating,DistanceIndexRating,CreatedOn,ModifiedOn,DeletedOn")] UserResourcePoolDto userresourcepooldto)
        {
            var userresourcepool = userresourcepooldto.ToBusinessObject();

            if (ModelState.IsValid)
            {
                unitOfWork.InsertOrUpdate(userresourcepool);
                await unitOfWork.SaveAsync();
                return RedirectToAction("Index");
            }


            var userSet = unitOfWork.UserSetLive.AsEnumerable();

            if (IsAuthenticated)
                userSet = userSet.Where(user => user.Id == CurrentUserId);

            ViewBag.UserId = new SelectList(userSet, "Id", "Email", userresourcepool.UserId);
            ViewBag.ResourcePoolId = new SelectList(unitOfWork.ResourcePoolSetLive.AsEnumerable(), "Id", "Name", userresourcepool.ResourcePoolId);
            return View(userresourcepool);
        }

        // GET: /UserResourcePool/Delete/5
        public async Task<ActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UserResourcePool userresourcepool = await unitOfWork.FindAsync(id);
            if (userresourcepool == null)
            {
                return HttpNotFound();
            }
            return View(userresourcepool);
        }

        // POST: /UserResourcePool/Delete/5
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
