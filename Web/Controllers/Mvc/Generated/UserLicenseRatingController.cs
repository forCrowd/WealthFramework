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

    public partial class UserLicenseRatingController : BaseController
    {
        UserLicenseRatingUnitOfWork unitOfWork = new UserLicenseRatingUnitOfWork();

        // GET: /UserLicenseRating/
        public async Task<ActionResult> Index()
        {
            var userlicenseratingset = unitOfWork.AllLiveIncluding(u => u.License, u => u.User);

            if (IsAuthenticated)
                userlicenseratingset = userlicenseratingset.Where(item => item.UserId == CurrentUserId);

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
            ViewBag.LicenseId = new SelectList(unitOfWork.LicenseSetLive.AsEnumerable(), "Id", "Name");

            var userSet = unitOfWork.UserSetLive.AsEnumerable();

            if (IsAuthenticated)
                userSet = userSet.Where(user => user.Id == CurrentUserId);

            ViewBag.UserId = new SelectList(userSet, "Id", "Email");
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

            ViewBag.LicenseId = new SelectList(unitOfWork.LicenseSetLive.AsEnumerable(), "Id", "Name", userlicenserating.LicenseId);

            var userSet = unitOfWork.UserSetLive.AsEnumerable();

            if (IsAuthenticated)
                userSet = userSet.Where(user => user.Id == CurrentUserId);

            ViewBag.UserId = new SelectList(userSet, "Id", "Email", userlicenserating.UserId);
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

            ViewBag.LicenseId = new SelectList(unitOfWork.LicenseSetLive.AsEnumerable(), "Id", "Name", userlicenserating.LicenseId);

            var userSet = unitOfWork.UserSetLive.AsEnumerable();

            if (IsAuthenticated)
                userSet = userSet.Where(user => user.Id == CurrentUserId);

            ViewBag.UserId = new SelectList(userSet, "Id", "Email", userlicenserating.UserId);
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

            ViewBag.LicenseId = new SelectList(unitOfWork.LicenseSetLive.AsEnumerable(), "Id", "Name", userlicenserating.LicenseId);

            var userSet = unitOfWork.UserSetLive.AsEnumerable();

            if (IsAuthenticated)
                userSet = userSet.Where(user => user.Id == CurrentUserId);

            ViewBag.UserId = new SelectList(userSet, "Id", "Email", userlicenserating.UserId);
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
