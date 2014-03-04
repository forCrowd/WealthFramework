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
            var userAccountTypes = Enum.GetValues(typeof(UserAccountType))
                .OfType<UserAccountType>()
                .Select(x => new { Id = x, Name = x.ToString() });
            ViewBag.UserAccountTypeId = new SelectList(userAccountTypes, "Id", "Name");

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
                var organizationUnitOfWork = new Facade.OrganizationUnitOfWork(db);
                
                db.OrganizationSet.Add(organizationUnitOfWork.GetTotalCostIndexOrganization1(user));
                db.OrganizationSet.Add(organizationUnitOfWork.GetTotalCostIndexOrganization2(user));

                db.OrganizationSet.Add(organizationUnitOfWork.GetKnowledgeIndexOrganization1(user));
                db.OrganizationSet.Add(organizationUnitOfWork.GetKnowledgeIndexOrganization2(user));

                var q1 = organizationUnitOfWork.GetQualityIndexOrganization1(user);
                db.OrganizationSet.Add(q1);
                var qr1 = organizationUnitOfWork.GetQualityIndexOrganizationRating1(user, q1);
                db.UserOrganizationRatingSet.Add(qr1);

                var q2 = organizationUnitOfWork.GetQualityIndexOrganization2(user);
                db.OrganizationSet.Add(q2);
                var qr2 = organizationUnitOfWork.GetQualityIndexOrganizationRating2(user, q2);
                db.UserOrganizationRatingSet.Add(qr2);

                var es1 = organizationUnitOfWork.GetEmployeeSatisfactionIndexOrganization1(user);
                db.OrganizationSet.Add(es1);
                var esr1 = organizationUnitOfWork.GetEmployeeSatisfactionIndexOrganizationRating1(user, es1);
                db.UserOrganizationRatingSet.Add(esr1);

                var es2 = organizationUnitOfWork.GetEmployeeSatisfactionIndexOrganization2(user);
                db.OrganizationSet.Add(es2);
                var esr2 = organizationUnitOfWork.GetEmployeeSatisfactionIndexOrganizationRating2(user, es2);
                db.UserOrganizationRatingSet.Add(esr2);

                var cs1 = organizationUnitOfWork.GetCustomerSatisfactionIndexOrganization1(user);
                db.OrganizationSet.Add(cs1);
                var csr1 = organizationUnitOfWork.GetCustomerSatisfactionIndexOrganizationRating1(user, cs1);
                db.UserOrganizationRatingSet.Add(csr1);

                var cs2 = organizationUnitOfWork.GetCustomerSatisfactionIndexOrganization2(user);
                db.OrganizationSet.Add(cs2);
                var csr2 = organizationUnitOfWork.GetCustomerSatisfactionIndexOrganizationRating2(user, cs2);
                db.UserOrganizationRatingSet.Add(csr2);

                db.OrganizationSet.Add(organizationUnitOfWork.GetSectorIndexOrganization1(user));
                db.OrganizationSet.Add(organizationUnitOfWork.GetSectorIndexOrganization2(user));
                db.OrganizationSet.Add(organizationUnitOfWork.GetSectorIndexOrganization3(user));
                db.OrganizationSet.Add(organizationUnitOfWork.GetSectorIndexOrganization4(user));
                db.OrganizationSet.Add(organizationUnitOfWork.GetSectorIndexOrganization5(user));
                db.OrganizationSet.Add(organizationUnitOfWork.GetSectorIndexOrganization6(user));
                db.OrganizationSet.Add(organizationUnitOfWork.GetSectorIndexOrganization7(user));
                db.OrganizationSet.Add(organizationUnitOfWork.GetSectorIndexOrganization8(user));
                db.OrganizationSet.Add(organizationUnitOfWork.GetSectorIndexOrganization9(user));

                db.OrganizationSet.Add(organizationUnitOfWork.GetDistanceIndexOrganization1(user));
                db.OrganizationSet.Add(organizationUnitOfWork.GetDistanceIndexOrganization2(user));

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

            var userAccountTypes = Enum.GetValues(typeof(UserAccountType))
                .OfType<UserAccountType>()
                .Select(x => new { Id = x, Name = x.ToString() });
            ViewBag.UserAccountTypeId = new SelectList(userAccountTypes, "Id", "Name", user.UserAccountTypeId);
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
