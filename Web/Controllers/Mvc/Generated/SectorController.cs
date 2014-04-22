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

//    public partial class SectorController : BaseController
//    {
//        SectorUnitOfWork unitOfWork = new SectorUnitOfWork();

//        // GET: /Sector/
//        public async Task<ActionResult> Index()
//        {
//            var sector = unitOfWork.AllLiveIncluding(s => s.ResourcePool);
//            return View(await sector.ToListAsync());
//        }

//        // GET: /Sector/Details/5
//        public async Task<ActionResult> Details(short? id)
//        {
//            if (id == null)
//            {
//                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
//            }
//            Sector sector = await unitOfWork.FindAsync(id);
//            if (sector == null)
//            {
//                return HttpNotFound();
//            }
//            return View(sector);
//        }

//        // GET: /Sector/Create
//        public ActionResult Create()
//        {
//            ViewBag.ResourcePoolId = new SelectList(unitOfWork.ResourcePoolSetLive.AsEnumerable(), "Id", "Name");
//            return View();
//        }

//        // POST: /Sector/Create
//        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
//        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
//        [HttpPost]
//        [ValidateAntiForgeryToken]
//        public async Task<ActionResult> Create([Bind(Include = "Id,ResourcePoolId,Name,Description,CreatedOn,ModifiedOn,DeletedOn")] SectorDto sectordto)
//        {
//            var sector = sectordto.ToBusinessObject();

//            if (ModelState.IsValid)
//            {
//                unitOfWork.Insert(sector);
//                await unitOfWork.SaveAsync();
//                return RedirectToAction("Index");
//            }

//            ViewBag.ResourcePoolId = new SelectList(unitOfWork.ResourcePoolSetLive.AsEnumerable(), "Id", "Name", sector.ResourcePoolId);
//            return View(sector);
//        }

//        // GET: /Sector/Edit/5
//        public async Task<ActionResult> Edit(short? id)
//        {
//            if (id == null)
//            {
//                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
//            }
//            Sector sector = await unitOfWork.FindAsync(id);
//            if (sector == null)
//            {
//                return HttpNotFound();
//            }

//            ViewBag.ResourcePoolId = new SelectList(unitOfWork.ResourcePoolSetLive.AsEnumerable(), "Id", "Name", sector.ResourcePoolId);
//            return View(sector);
//        }

//        // POST: /Sector/Edit/5
//        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
//        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
//        [HttpPost]
//        [ValidateAntiForgeryToken]
//        public async Task<ActionResult> Edit([Bind(Include = "Id,ResourcePoolId,Name,Description,CreatedOn,ModifiedOn,DeletedOn")] SectorDto sectordto)
//        {
//            var sector = sectordto.ToBusinessObject();

//            if (ModelState.IsValid)
//            {
//                unitOfWork.Update(sector);
//                await unitOfWork.SaveAsync();
//                return RedirectToAction("Index");
//            }

//            ViewBag.ResourcePoolId = new SelectList(unitOfWork.ResourcePoolSetLive.AsEnumerable(), "Id", "Name", sector.ResourcePoolId);
//            return View(sector);
//        }

//        // GET: /Sector/Delete/5
//        public async Task<ActionResult> Delete(short? id)
//        {
//            if (id == null)
//            {
//                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
//            }
//            Sector sector = await unitOfWork.FindAsync(id);
//            if (sector == null)
//            {
//                return HttpNotFound();
//            }
//            return View(sector);
//        }

//        // POST: /Sector/Delete/5
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
