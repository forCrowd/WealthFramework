using BusinessObjects;
using BusinessObjects.Dto;
using Facade;
using System.Data.Entity;
using System.Net;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Web.Controllers.Mvc
{
    public partial class LicenseController : BaseController
    {
        LicenseUnitOfWork unitOfWork = new LicenseUnitOfWork();

        // GET: /License/
        public async Task<ActionResult> Index()
        {
            return View(await unitOfWork.AllLive.ToListAsync());
        }

        // GET: /License/Details/5
        public async Task<ActionResult> Details(short? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            License license = await unitOfWork.FindAsync(id);
            if (license == null)
            {
                return HttpNotFound();
            }
            return View(license);
        }

        // GET: /License/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: /License/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include = "Id,Name,Description,Text,CreatedOn,ModifiedOn,DeletedOn")] LicenseDto licenseDto)
        {
            var license = licenseDto.ToBusinessObject();

            if (ModelState.IsValid)
            {
                unitOfWork.InsertOrUpdate(license);
                await unitOfWork.SaveAsync();
                return RedirectToAction("Index");
            }

            return View(license);
        }

        // GET: /License/Edit/5
        public async Task<ActionResult> Edit(short? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            License license = await unitOfWork.FindAsync(id);
            if (license == null)
            {
                return HttpNotFound();
            }
            return View(license);
        }

        // POST: /License/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include="Id,Name,Description,Text,CreatedOn,ModifiedOn,DeletedOn")] LicenseDto licenseDto)
        {
            var license = licenseDto.ToBusinessObject();

            if (ModelState.IsValid)
            {
                unitOfWork.InsertOrUpdate(license);
                await unitOfWork.SaveAsync();
                return RedirectToAction("Index");
            }
            return View(license);
        }

        // GET: /License/Delete/5
        public async Task<ActionResult> Delete(short? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            License license = await unitOfWork.FindAsync(id);
            if (license == null)
            {
                return HttpNotFound();
            }
            return View(license);
        }

        // POST: /License/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(short id)
        {
            unitOfWork.Delete(id);
            await unitOfWork.SaveAsync();
            return RedirectToAction("Index");
        }
    }
}
