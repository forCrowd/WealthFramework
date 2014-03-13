using BusinessObjects;
using BusinessObjects.Dto;
using Facade;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Web.Controllers.Mvc
{
    public partial class UserController : BaseController
    {
        UserUnitOfWork unitOfWork = new UserUnitOfWork();

        // GET: /User/
        public async Task<ActionResult> Index()
        {
            return View(await unitOfWork.AllLive.ToListAsync());
        }

        // GET: /User/Details/5
        public async Task<ActionResult> Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            User user = await unitOfWork.FindAsync(id);
            if (user == null)
            {
                return HttpNotFound();
            }
            return View(user);
        }

        // GET: /User/Create
        public ActionResult Create()
        {
            ViewBag.UserAccountTypeId = new SelectList(GetAvailableUserAccountTypes(), "Id", "Name");

            return View();
        }

        // POST: /User/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include = "Id,Email,FirstName,MiddleName,LastName,UserAccountTypeId,Notes,CreatedOn,ModifiedOn,DeletedOn")] UserDto userDto)
        {
            var user = userDto.ToBusinessObject();

            if (ModelState.IsValid)
            {
                unitOfWork.InsertOrUpdate(user);
                await unitOfWork.SaveAsync();
                return RedirectToAction("Index");
            }

            return View(user);
        }

        // GET: /User/Edit/5
        public async Task<ActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            User user = await unitOfWork.FindAsync(id);
            if (user == null)
            {
                return HttpNotFound();
            }

            ViewBag.UserAccountTypeId = new SelectList(GetAvailableUserAccountTypes(), "Id", "Name", user.UserAccountTypeId);
            return View(user);
        }

        // POST: /User/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include = "Id,Email,FirstName,MiddleName,LastName,UserAccountTypeId,Notes,CreatedOn,ModifiedOn,DeletedOn")] UserDto userDto, string returnUrl)
        {
            var user = userDto.ToBusinessObject();

            if (ModelState.IsValid)
            {
                unitOfWork.InsertOrUpdate(user);
                await unitOfWork.SaveAsync();

                if (!string.IsNullOrWhiteSpace(returnUrl))
                    return Redirect(returnUrl);
                return RedirectToAction("Index", "Home");
            }
            return View(user);
        }

        // GET: /User/Delete/5
        public async Task<ActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            User user = await unitOfWork.FindAsync(id);
            if (user == null)
            {
                return HttpNotFound();
            }
            return View(user);
        }

        // POST: /User/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(int id)
        {
            unitOfWork.Delete(id);
            await unitOfWork.SaveAsync();
            return RedirectToAction("Index");
        }

        IEnumerable<dynamic> GetAvailableUserAccountTypes()
        {
            // User account types
            var userAccountTypes = Enum.GetValues(typeof(UserAccountType))
                .OfType<UserAccountType>()
                .Select(item => new { Id = item, Name = item.ToString() });

            // If it's not admin, show only the current option
            if (!(IsAuthenticated && CurrentUserAccountTypeId == UserAccountType.Administrator))
                userAccountTypes = userAccountTypes.Where(accountType => accountType.Id == UserAccountType.Standard);

            // Return
            return userAccountTypes;
        }
    }
}
