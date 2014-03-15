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

    public partial class SectorController : BaseController
    {
        SectorUnitOfWork unitOfWork = new SectorUnitOfWork();

        // GET: /Sector/
        public async Task<ActionResult> Index()
        {
            return View(await unitOfWork.AllLive.ToListAsync());
        }

        // GET: /Sector/Details/5
        public async Task<ActionResult> Details(byte? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Sector sector = await unitOfWork.FindAsync(id);
            if (sector == null)
            {
                return HttpNotFound();
            }
            return View(sector);
        }

        // GET: /Sector/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: /Sector/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include = "Id,Name,Description,CreatedOn,ModifiedOn,DeletedOn")] SectorDto sectordto)
        {
            var sector = sectordto.ToBusinessObject();

            if (ModelState.IsValid)
            {
                unitOfWork.InsertOrUpdate(sector);
                await unitOfWork.SaveAsync();
                return RedirectToAction("Index");
            }

            return View(sector);
        }

        // GET: /Sector/Edit/5
        public async Task<ActionResult> Edit(byte? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Sector sector = await unitOfWork.FindAsync(id);
            if (sector == null)
            {
                return HttpNotFound();
            }

            return View(sector);
        }

        // POST: /Sector/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include = "Id,Name,Description,CreatedOn,ModifiedOn,DeletedOn")] SectorDto sectordto)
        {
            var sector = sectordto.ToBusinessObject();

            if (ModelState.IsValid)
            {
                unitOfWork.InsertOrUpdate(sector);
                await unitOfWork.SaveAsync();
                return RedirectToAction("Index");
            }

            return View(sector);
        }

        // GET: /Sector/Delete/5
        public async Task<ActionResult> Delete(byte? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Sector sector = await unitOfWork.FindAsync(id);
            if (sector == null)
            {
                return HttpNotFound();
            }
            return View(sector);
        }

        // POST: /Sector/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(byte id)
        {
            unitOfWork.Delete(id);
            await unitOfWork.SaveAsync();
            return RedirectToAction("Index");
        }
    }
}
