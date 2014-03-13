using BusinessObjects;
using BusinessObjects.Dto;
using Facade;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Web.Controllers.Mvc
{
    public partial class UserSectorRatingController : BaseController
    {
        UserSectorRatingUnitOfWork unitOfWork = new UserSectorRatingUnitOfWork();

        // GET: /UserSectorRating/
        public async Task<ActionResult> Index()
        {
            var usersectorratingset = unitOfWork.AllLiveIncluding(u => u.Sector, u => u.User);

            if (IsAuthenticated)
                usersectorratingset = usersectorratingset.Where(rating => rating.UserId == CurrentUserId);

            return View(await usersectorratingset.ToListAsync());
        }

        // GET: /UserSectorRating/Details/5
        public async Task<ActionResult> Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UserSectorRating usersectorrating = await unitOfWork.FindAsync(id);
            if (usersectorrating == null)
            {
                return HttpNotFound();
            }
            return View(usersectorrating);
        }

        // GET: /UserSectorRating/Create
        public ActionResult Create()
        {
            var userSet = unitOfWork.AllUserLive.AsEnumerable();

            if (IsAuthenticated)
                userSet = userSet.Where(user => user.Id == CurrentUserId);

            ViewBag.SectorId = new SelectList(unitOfWork.AllSectorLive.AsEnumerable(), "Id", "Name");
            ViewBag.UserId = new SelectList(userSet, "Id", "Email");
            return View();
        }

        // POST: /UserSectorRating/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include="Id,UserId,SectorId,Rating,CreatedOn,ModifiedOn,DeletedOn")] UserSectorRatingDto usersectorratingDto)
        {
            var usersectorrating = usersectorratingDto.ToBusinessObject();

            if (ModelState.IsValid)
            {
                unitOfWork.InsertOrUpdate(usersectorrating);
                await unitOfWork.SaveAsync();
                return RedirectToAction("Index");
            }

            var userSet = unitOfWork.AllUserLive.AsEnumerable();

            if (IsAuthenticated)
                userSet = userSet.Where(user => user.Id == CurrentUserId);

            ViewBag.SectorId = new SelectList(unitOfWork.AllSectorLive.AsEnumerable(), "Id", "Name", usersectorrating.SectorId);
            ViewBag.UserId = new SelectList(userSet, "Id", "Email", usersectorrating.UserId);
            return View(usersectorrating);
        }

        // GET: /UserSectorRating/Edit/5
        public async Task<ActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UserSectorRating usersectorrating = await unitOfWork.FindAsync(id);
            if (usersectorrating == null)
            {
                return HttpNotFound();
            }

            var userSet = unitOfWork.AllUserLive.AsEnumerable();

            if (IsAuthenticated)
                userSet = userSet.Where(user => user.Id == CurrentUserId);

            ViewBag.SectorId = new SelectList(unitOfWork.AllSectorLive.AsEnumerable(), "Id", "Name", usersectorrating.SectorId);
            ViewBag.UserId = new SelectList(userSet, "Id", "Email", usersectorrating.UserId);
            return View(usersectorrating);
        }

        // POST: /UserSectorRating/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include="Id,UserId,SectorId,Rating,CreatedOn,ModifiedOn,DeletedOn")] UserSectorRatingDto usersectorratingDto)
        {
            var usersectorrating = usersectorratingDto.ToBusinessObject();

            if (ModelState.IsValid)
            {
                unitOfWork.InsertOrUpdate(usersectorrating);
                await unitOfWork.SaveAsync();
                return RedirectToAction("Index");
            }

            var userSet = unitOfWork.AllUserLive.AsEnumerable();

            if (IsAuthenticated)
                userSet = userSet.Where(user => user.Id == CurrentUserId);

            ViewBag.SectorId = new SelectList(unitOfWork.AllSectorLive.AsEnumerable(), "Id", "Name", usersectorrating.SectorId);
            ViewBag.UserId = new SelectList(userSet, "Id", "Email", usersectorrating.UserId);
            return View(usersectorrating);
        }

        // GET: /UserSectorRating/Delete/5
        public async Task<ActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UserSectorRating usersectorrating = await unitOfWork.FindAsync(id);
            if (usersectorrating == null)
            {
                return HttpNotFound();
            }
            return View(usersectorrating);
        }

        // POST: /UserSectorRating/Delete/5
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
