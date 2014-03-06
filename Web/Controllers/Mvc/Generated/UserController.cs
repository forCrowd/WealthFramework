using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using System.Net;
using System.Web;
using System.Web.Mvc;
using BusinessObjects;
using DataObjects;
using System.Collections;

namespace Web.Controllers.Mvc
{
    public partial class UserController : BaseController
    {
        // GET: /User/
        public async Task<ActionResult> Index()
        {
            return View(await db.UserSet.ToListAsync());
        }

        // GET: /User/Details/5
        public async Task<ActionResult> Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            User user = await db.UserSet.FindAsync(id);
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
        public async Task<ActionResult> Create([Bind(Include = "Id,Email,FirstName,MiddleName,LastName,UserAccountTypeId,ResourcePoolRate,Notes,CreatedOn,ModifiedOn,DeletedOn")] User user)
        {
            if (ModelState.IsValid)
            {
				user.CreatedOn = DateTime.Now;
				user.ModifiedOn = DateTime.Now;
                db.UserSet.Add(user);

                // Sample organizations
                foreach (var organization in db.OrganizationSet)
                {
                    var userOrganization = new UserOrganizationRating()
                    {
                        User = user,
                        Organization = organization,
                        NumberOfSales = 0,
                        // TODO Handle these sample ratings nicely ?!
                        QualityRating = organization.Id == 6 ? 80 : organization.Id == 7 ? 20 : 0,
                        EmployeeSatisfactionRating = organization.Id == 8 ? 80 : organization.Id == 9 ? 20 : 0,
                        CustomerSatisfactionRating = organization.Id == 10 ? 80 : organization.Id == 11 ? 20 : 0,
                        CreatedOn = DateTime.Now,
                        ModifiedOn = DateTime.Now
                    };

                    db.UserOrganizationRatingSet.Add(userOrganization);
                }

                // Sample license ratings
                foreach (var license in db.LicenseSet)
                {
                    var licenceRating = new UserLicenseRating() { User = user, License = license, Rating = 0, CreatedOn = DateTime.Now, ModifiedOn = DateTime.Now };
                    db.UserLicenseRatingSet.Add(licenceRating);
                }

                // Sample sector ratings
                foreach (var sector in db.SectorSet)
                {
                    var sectorRating = new UserSectorRating() { User = user, Sector = sector, Rating = 0, CreatedOn = DateTime.Now, ModifiedOn = DateTime.Now };
                    db.UserSectorRatingSet.Add(sectorRating);
                }

                await db.SaveChangesAsync();
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
            User user = await db.UserSet.FindAsync(id);
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
        public async Task<ActionResult> Edit([Bind(Include = "Id,Email,FirstName,MiddleName,LastName,UserAccountTypeId,ResourcePoolRate,Notes,CreatedOn,ModifiedOn,DeletedOn")] User user, string returnUrl)
        {
            if (ModelState.IsValid)
            {
                db.Entry(user).State = EntityState.Modified;
				user.ModifiedOn = DateTime.Now;
                await db.SaveChangesAsync();

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
            User user = await db.UserSet.FindAsync(id);
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
            User user = await db.UserSet.FindAsync(id);

            // Sector ratings
            db.UserSectorRatingSet.RemoveRange(user.UserSectorRatingSet);

            // License
            db.UserLicenseRatingSet.RemoveRange(user.UserLicenseRatingSet);

            // Organization ratings
            db.UserOrganizationRatingSet.RemoveRange(user.UserOrganizationRatingSet);

            // Organizations
            db.OrganizationSet.RemoveRange(user.OrganizationSet);

            // User
            db.UserSet.Remove(user);

            await db.SaveChangesAsync();
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

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
