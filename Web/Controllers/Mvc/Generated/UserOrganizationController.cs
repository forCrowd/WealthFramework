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

//    public partial class UserOrganizationController : BaseController
//    {
//        UserOrganizationUnitOfWork unitOfWork = new UserOrganizationUnitOfWork();

//        // GET: /UserOrganization/
//        public async Task<ActionResult> Index()
//        {
//            var userorganization = unitOfWork.AllLiveIncluding(u => u.Organization, u => u.User);

//            if (IsAuthenticated)
//                userorganization = userorganization.Where(item => item.UserId == CurrentUserId);

//            return View(await userorganization.ToListAsync());
//        }

//        // GET: /UserOrganization/Details/5
//        public async Task<ActionResult> Details(int? id)
//        {
//            if (id == null)
//            {
//                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
//            }
//            UserOrganization userorganization = await unitOfWork.FindAsync(id);
//            if (userorganization == null)
//            {
//                return HttpNotFound();
//            }
//            return View(userorganization);
//        }

//        // GET: /UserOrganization/Create
//        public ActionResult Create()
//        {
//            ViewBag.OrganizationId = new SelectList(unitOfWork.OrganizationSetLive.AsEnumerable(), "Id", "Name");

//            var userSet = unitOfWork.UserSetLive.AsEnumerable();

//            if (IsAuthenticated)
//                userSet = userSet.Where(user => user.Id == CurrentUserId);

//            ViewBag.UserId = new SelectList(userSet, "Id", "Email");
//            return View();
//        }

//        // POST: /UserOrganization/Create
//        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
//        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
//        [HttpPost]
//        [ValidateAntiForgeryToken]
//        public async Task<ActionResult> Create([Bind(Include = "Id,UserId,OrganizationId,NumberOfSales,QualityRating,CustomerSatisfactionRating,EmployeeSatisfactionRating,CreatedOn,ModifiedOn,DeletedOn")] UserOrganizationDto userorganizationdto)
//        {
//            var userorganization = userorganizationdto.ToBusinessObject();

//            if (ModelState.IsValid)
//            {
//                unitOfWork.Insert(userorganization);
//                await unitOfWork.SaveAsync();
//                return RedirectToAction("Index");
//            }

//            ViewBag.OrganizationId = new SelectList(unitOfWork.OrganizationSetLive.AsEnumerable(), "Id", "Name", userorganization.OrganizationId);

//            var userSet = unitOfWork.UserSetLive.AsEnumerable();

//            if (IsAuthenticated)
//                userSet = userSet.Where(user => user.Id == CurrentUserId);

//            ViewBag.UserId = new SelectList(userSet, "Id", "Email", userorganization.UserId);
//            return View(userorganization);
//        }

//        // GET: /UserOrganization/Edit/5
//        public async Task<ActionResult> Edit(int? id)
//        {
//            if (id == null)
//            {
//                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
//            }
//            UserOrganization userorganization = await unitOfWork.FindAsync(id);
//            if (userorganization == null)
//            {
//                return HttpNotFound();
//            }

//            ViewBag.OrganizationId = new SelectList(unitOfWork.OrganizationSetLive.AsEnumerable(), "Id", "Name", userorganization.OrganizationId);

//            var userSet = unitOfWork.UserSetLive.AsEnumerable();

//            if (IsAuthenticated)
//                userSet = userSet.Where(user => user.Id == CurrentUserId);

//            ViewBag.UserId = new SelectList(userSet, "Id", "Email", userorganization.UserId);
//            return View(userorganization);
//        }

//        // POST: /UserOrganization/Edit/5
//        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
//        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
//        [HttpPost]
//        [ValidateAntiForgeryToken]
//        public async Task<ActionResult> Edit([Bind(Include = "Id,UserId,OrganizationId,NumberOfSales,QualityRating,CustomerSatisfactionRating,EmployeeSatisfactionRating,CreatedOn,ModifiedOn,DeletedOn")] UserOrganizationDto userorganizationdto)
//        {
//            var userorganization = userorganizationdto.ToBusinessObject();

//            if (ModelState.IsValid)
//            {
//                unitOfWork.Update(userorganization);
//                await unitOfWork.SaveAsync();
//                return RedirectToAction("Index");
//            }

//            ViewBag.OrganizationId = new SelectList(unitOfWork.OrganizationSetLive.AsEnumerable(), "Id", "Name", userorganization.OrganizationId);

//            var userSet = unitOfWork.UserSetLive.AsEnumerable();

//            if (IsAuthenticated)
//                userSet = userSet.Where(user => user.Id == CurrentUserId);

//            ViewBag.UserId = new SelectList(userSet, "Id", "Email", userorganization.UserId);
//            return View(userorganization);
//        }

//        // GET: /UserOrganization/Delete/5
//        public async Task<ActionResult> Delete(int? id)
//        {
//            if (id == null)
//            {
//                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
//            }
//            UserOrganization userorganization = await unitOfWork.FindAsync(id);
//            if (userorganization == null)
//            {
//                return HttpNotFound();
//            }
//            return View(userorganization);
//        }

//        // POST: /UserOrganization/Delete/5
//        [HttpPost, ActionName("Delete")]
//        [ValidateAntiForgeryToken]
//        public async Task<ActionResult> DeleteConfirmed(int id)
//        {
//            unitOfWork.Delete(id);
//            await unitOfWork.SaveAsync();
//            return RedirectToAction("Index");
//        }
//    }
//}
