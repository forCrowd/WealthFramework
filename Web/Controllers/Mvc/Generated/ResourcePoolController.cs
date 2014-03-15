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

    public partial class ResourcePoolController : BaseController
    {
        ResourcePoolUnitOfWork unitOfWork = new ResourcePoolUnitOfWork();

        // GET: /ResourcePool/
        public async Task<ActionResult> Index()
        {
            return View(await unitOfWork.AllLive.ToListAsync());
        }

        // GET: /ResourcePool/Details/5
        public async Task<ActionResult> Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            ResourcePool resourcepool = await unitOfWork.FindAsync(id);
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
        public async Task<ActionResult> Create([Bind(Include = "Id,Name,CreatedOn,ModifiedOn,DeletedOn")] ResourcePoolDto resourcepooldto)
        {
            var resourcepool = resourcepooldto.ToBusinessObject();

            if (ModelState.IsValid)
            {
                unitOfWork.InsertOrUpdate(resourcepool);
                await unitOfWork.SaveAsync();
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
            ResourcePool resourcepool = await unitOfWork.FindAsync(id);
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
        public async Task<ActionResult> Edit([Bind(Include = "Id,Name,CreatedOn,ModifiedOn,DeletedOn")] ResourcePoolDto resourcepooldto)
        {
            var resourcepool = resourcepooldto.ToBusinessObject();

            if (ModelState.IsValid)
            {
                unitOfWork.InsertOrUpdate(resourcepool);
                await unitOfWork.SaveAsync();
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
            ResourcePool resourcepool = await unitOfWork.FindAsync(id);
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
            unitOfWork.Delete(id);
            await unitOfWork.SaveAsync();
            return RedirectToAction("Index");
        }
    }
}
