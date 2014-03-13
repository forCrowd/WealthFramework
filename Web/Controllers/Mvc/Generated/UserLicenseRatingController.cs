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
    public partial class UserLicenseRatingController : BaseController
    {
        UserLicenseRatingUnitOfWork unitOfWork = new UserLicenseRatingUnitOfWork();

        // GET: /UserLicenseRating/
        public async Task<ActionResult> Index()
        {
            var userlicenseratingset = unitOfWork.AllLiveIncluding(u => u.License, u => u.User);
            return View(await userlicenseratingset.ToListAsync());
        }

        // GET: /UserLicenseRating/Details/5
        public async Task<ActionResult> Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UserLicenseRating userlicenserating = await unitOfWork.FindAsync(id);
            if (userlicenserating == null)
            {
                return HttpNotFound();
            }
            return View(userlicenserating);
        }

        // GET: /UserLicenseRating/Create
        public ActionResult Create()
        {
            ViewBag.LicenseId = new SelectList(unitOfWork.AllLicenseLive.AsEnumerable(), "Id", "Name");
            ViewBag.UserId = new SelectList(unitOfWork.AllUserLive.AsEnumerable(), "Id", "Email");
            return View();
        }

        // POST: /UserLicenseRating/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include = "Id,UserId,LicenseId,Rating,CreatedOn,ModifiedOn,DeletedOn")] UserLicenseRatingDto userlicenseratingdto)
        {
			var userlicenserating = userlicenseratingdto.ToBusinessObject();

            if (ModelState.IsValid)
            {
                unitOfWork.InsertOrUpdate(userlicenserating);
                await unitOfWork.SaveAsync();
                return RedirectToAction("Index");
            }

            ViewBag.LicenseId = new SelectList(unitOfWork.AllLicenseLive.AsEnumerable(), "Id", "Name", userlicenserating.LicenseId);
            ViewBag.UserId = new SelectList(unitOfWork.AllUserLive.AsEnumerable(), "Id", "Email", userlicenserating.UserId);
            return View(userlicenserating);
        }

        // GET: /UserLicenseRating/Edit/5
        public async Task<ActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UserLicenseRating userlicenserating = await unitOfWork.FindAsync(id);
            if (userlicenserating == null)
            {
                return HttpNotFound();
            }
            ViewBag.LicenseId = new SelectList(unitOfWork.AllLicenseLive.AsEnumerable(), "Id", "Name", userlicenserating.LicenseId);
            ViewBag.UserId = new SelectList(unitOfWork.AllUserLive.AsEnumerable(), "Id", "Email", userlicenserating.UserId);
            return View(userlicenserating);
        }

        // POST: /UserLicenseRating/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include = "Id,UserId,LicenseId,Rating,CreatedOn,ModifiedOn,DeletedOn")] UserLicenseRatingDto userlicenseratingdto)
        {
			var userlicenserating = userlicenseratingdto.ToBusinessObject();

            if (ModelState.IsValid)
            {
                unitOfWork.InsertOrUpdate(userlicenserating);
                await unitOfWork.SaveAsync();
                return RedirectToAction("Index");
            }
            ViewBag.LicenseId = new SelectList(unitOfWork.AllLicenseLive.AsEnumerable(), "Id", "Name", userlicenserating.LicenseId);
            ViewBag.UserId = new SelectList(unitOfWork.AllUserLive.AsEnumerable(), "Id", "Email", userlicenserating.UserId);
            return View(userlicenserating);
        }

        // GET: /UserLicenseRating/Delete/5
        public async Task<ActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UserLicenseRating userlicenserating = await unitOfWork.FindAsync(id);
            if (userlicenserating == null)
            {
                return HttpNotFound();
            }
            return View(userlicenserating);
        }

        // POST: /UserLicenseRating/Delete/5
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
