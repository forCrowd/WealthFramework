//namespace Web.Controllers.Mvc
//{
//    using BusinessObjects;
//    using BusinessObjects.Dto;
//    using Facade;
//    using System.Data.Entity;
//    using System.Linq;
//    using System.Net;
//    using System.Threading.Tasks;
//    using System.Web.Mvc;

//    public partial class LicenseController : BaseController
//    {
//        LicenseUnitOfWork unitOfWork = new LicenseUnitOfWork();

//        // GET: /License/
//        public async Task<ActionResult> Index()
//        {
//            var license = unitOfWork.AllLiveIncluding(l => l.ResourcePool);
//            return View(await license.ToListAsync());
//        }

//        // GET: /License/Details/5
//        public async Task<ActionResult> Details(short? id)
//        {
//            if (id == null)
//            {
//                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
//            }
//            License license = await unitOfWork.FindAsync(id);
//            if (license == null)
//            {
//                return HttpNotFound();
//            }
//            return View(license);
//        }

//        // GET: /License/Create
//        public ActionResult Create()
//        {
//            ViewBag.ResourcePoolId = new SelectList(unitOfWork.ResourcePoolSetLive.AsEnumerable(), "Id", "Name");
//            return View();
//        }

//        // POST: /License/Create
//        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
//        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
//        [HttpPost]
//        [ValidateAntiForgeryToken]
//        public async Task<ActionResult> Create([Bind(Include = "Id,ResourcePoolId,Name,Description,Text,CreatedOn,ModifiedOn,DeletedOn")] LicenseDto licensedto)
//        {
//            var license = licensedto.ToBusinessObject();

//            if (ModelState.IsValid)
//            {
//                unitOfWork.Insert(license);
//                await unitOfWork.SaveAsync();
//                return RedirectToAction("Index");
//            }

//            ViewBag.ResourcePoolId = new SelectList(unitOfWork.ResourcePoolSetLive.AsEnumerable(), "Id", "Name", license.ResourcePoolId);
//            return View(license);
//        }

//        // GET: /License/Edit/5
//        public async Task<ActionResult> Edit(short? id)
//        {
//            if (id == null)
//            {
//                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
//            }
//            License license = await unitOfWork.FindAsync(id);
//            if (license == null)
//            {
//                return HttpNotFound();
//            }

//            ViewBag.ResourcePoolId = new SelectList(unitOfWork.ResourcePoolSetLive.AsEnumerable(), "Id", "Name", license.ResourcePoolId);
//            return View(license);
//        }

//        // POST: /License/Edit/5
//        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
//        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
//        [HttpPost]
//        [ValidateAntiForgeryToken]
//        public async Task<ActionResult> Edit([Bind(Include = "Id,ResourcePoolId,Name,Description,Text,CreatedOn,ModifiedOn,DeletedOn")] LicenseDto licensedto)
//        {
//            var license = licensedto.ToBusinessObject();

//            if (ModelState.IsValid)
//            {
//                unitOfWork.Update(license);
//                await unitOfWork.SaveAsync();
//                return RedirectToAction("Index");
//            }

//            ViewBag.ResourcePoolId = new SelectList(unitOfWork.ResourcePoolSetLive.AsEnumerable(), "Id", "Name", license.ResourcePoolId);
//            return View(license);
//        }

//        // GET: /License/Delete/5
//        public async Task<ActionResult> Delete(short? id)
//        {
//            if (id == null)
//            {
//                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
//            }
//            License license = await unitOfWork.FindAsync(id);
//            if (license == null)
//            {
//                return HttpNotFound();
//            }
//            return View(license);
//        }

//        // POST: /License/Delete/5
//        [HttpPost, ActionName("Delete")]
//        [ValidateAntiForgeryToken]
//        public async Task<ActionResult> DeleteConfirmed(short id)
//        {
//            unitOfWork.Delete(id);
//            await unitOfWork.SaveAsync();
//            return RedirectToAction("Index");
//        }
//    }
//}
