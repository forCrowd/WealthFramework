using BusinessObjects;
using DataObjects;
using System;
using System.Linq;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Web.Controllers.Mvc
{
    public class ResourcePoolController : BaseController
    {
        // GET: /ResourcePool/TotalCostIndex
        public async Task<ActionResult> TotalCostIndex()
        {
            // Current user
            var currentUser = await db.UserSet.FindAsync(CurrentUserId);

            // Distribution index average; Make only the current index 100% to be able to see the correct effect of it
            var distributionIndexAverage = new UserDistributionIndexRatingAverage()
            {
                RatingCount = 1,
                TotalCostIndexRating = 100
            };

            // Organization set
            var organizationSet = await GetGenericIndexOrganizationQuery("TCI - ").ToListAsync();

            // Resource pool
            var newResourcePool = new ResourcePool(null, distributionIndexAverage, currentUser.ResourcePoolRate, organizationSet);
            
            // Return
            return View(newResourcePool);
        }

        // GET: /ResourcePool/KnowledgeIndexPrivate
        public async Task<ActionResult> KnowledgeIndexPrivate()
        {
            ViewBag.Title = "Knowledge Index - Private";
            return await KnowledgeIndex(true);
        }

        // GET: /ResourcePool/KnowledgeIndexPublic
        public async Task<ActionResult> KnowledgeIndexPublic()
        {
            ViewBag.Title = "Knowledge Index - Public";
            return await KnowledgeIndex(false);
        }

        async Task<ActionResult> KnowledgeIndex(bool isPrivate)
        {
            // Current user
            var currentUser = await db.UserSet.FindAsync(CurrentUserId);

            // User
            var user = isPrivate ? currentUser : null;

            // Distribution index average; Make only the current index 100% to be able to see the correct effect of it
            var distributionIndexAverage = new UserDistributionIndexRatingAverage()
            {
                RatingCount = 1,
                KnowledgeIndexRating = 100
            };

            // Organization set
            var organizationSet = await GetGenericIndexOrganizationQuery("KI - ").ToListAsync();

            // License set
            var licenseSet = await db.LicenseSet.Include(license => license.UserLicenseRatingSet).ToListAsync();

            // Resource pool
            var newResourcePool = new ResourcePool(user, distributionIndexAverage, currentUser.ResourcePoolRate, organizationSet, licenseSet);

            // Return
            return View("KnowledgeIndex", newResourcePool);
        }

        // GET: /ResourcePool/QualityIndex
        public async Task<ActionResult> QualityIndex()
        {
            // Current user
            var currentUser = await db.UserSet.FindAsync(CurrentUserId);

            // Distribution index average; Make only the current index 100% to be able to see the correct effect of it
            var distributionIndexAverage = new UserDistributionIndexRatingAverage()
            {
                RatingCount = 1,
                QualityIndexRating = 100
            };

            // Organization set
            var organizationSet = await GetGenericIndexOrganizationQuery("QI - ").ToListAsync();

            // Resource pool
            var newResourcePool = new ResourcePool(null, distributionIndexAverage, currentUser.ResourcePoolRate, organizationSet);

            // Return
            return View(newResourcePool);
        }

        // GET: /ResourcePool/SectorIndex
        public async Task<ActionResult> SectorIndex()
        {
            // Current user
            var currentUser = await db.UserSet.FindAsync(CurrentUserId);

            // Distribution index average; Make only the current index 100% to be able to see the correct effect of it
            var distributionIndexAverage = new UserDistributionIndexRatingAverage()
            {
                RatingCount = 1,
                SectorIndexRating = 100
            };

            // Organization set
            var organizationSet = await GetGenericIndexOrganizationQuery("SI - ").ToListAsync();

            // Sector set
            var sectorSet = await db.SectorSet.Include(sector => sector.UserSectorRatingSet).ToListAsync();

            // Resource pool
            var newResourcePool = new ResourcePool(null, distributionIndexAverage, currentUser.ResourcePoolRate, organizationSet, null, sectorSet);

            // Return
            return View(newResourcePool);
        }

        // GET: /ResourcePool/EmployeeSatisfactionIndex
        public async Task<ActionResult> EmployeeSatisfactionIndex()
        {
            // Current user
            var currentUser = await db.UserSet.FindAsync(CurrentUserId);

            // Distribution index average; Make only the current index 100% to be able to see the correct effect of it
            var distributionIndexAverage = new UserDistributionIndexRatingAverage()
            {
                RatingCount = 1,
                EmployeeSatisfactionIndexRating = 100
            };

            // Organization set
            var organizationSet = await GetGenericIndexOrganizationQuery("ESI - ").ToListAsync();

            // Resource pool
            var newResourcePool = new ResourcePool(null, distributionIndexAverage, currentUser.ResourcePoolRate, organizationSet);

            // Return
            return View(newResourcePool);
        }

        // GET: /ResourcePool/CustomerSatisfactionIndex
        public async Task<ActionResult> CustomerSatisfactionIndex()
        {
            // Current user
            var currentUser = await db.UserSet.FindAsync(CurrentUserId);

            // Distribution index average; Make only the current index 100% to be able to see the correct effect of it
            var distributionIndexAverage = new UserDistributionIndexRatingAverage()
            {
                RatingCount = 1,
                CustomerSatisfactionIndexRating = 100
            };

            // Organization set
            var organizationSet = await GetGenericIndexOrganizationQuery("CSI - ").ToListAsync();

            // Resource pool
            var newResourcePool = new ResourcePool(null, distributionIndexAverage, currentUser.ResourcePoolRate, organizationSet);

            // Return
            return View(newResourcePool);
        }

        // GET: /ResourcePool/DistanceIndex
        public async Task<ActionResult> DistanceIndex()
        {
            // Current user
            var currentUser = await db.UserSet.FindAsync(CurrentUserId);

            // Distribution index average; Make only the current index 100% to be able to see the correct effect of it
            var distributionIndexAverage = new UserDistributionIndexRatingAverage()
            {
                RatingCount = 1,
                DistanceIndexRating = 100
            };

            // Organization set
            var organizationSet = await GetGenericIndexOrganizationQuery("DI - ").ToListAsync();

            // Resource pool
            var newResourcePool = new ResourcePool(null, distributionIndexAverage, currentUser.ResourcePoolRate, organizationSet);

            // Return
            return View(newResourcePool);
        }

        // GET: /ResourcePool/AllInOne
        public async Task<ActionResult> AllInOne()
        {
            // Current user
            var currentUser = await db.UserSet.FindAsync(CurrentUserId);

            // Distribution index average; unlike the other Views that focuses on certain Index, this shows all indexes and uses real user index rating averages
            var distributionIndexAverage = await new UserDistributionIndexRatingRepository(db).GetAverageAsync();

            // Organization set
            var organizationSet = await GetAllInOneOrganizationQuery().ToListAsync();

            // License set
            var licenseSet = await db.LicenseSet.Include(license => license.UserLicenseRatingSet).ToListAsync();

            // Sector set
            var sectorSet = await db.SectorSet.Include(sector => sector.UserSectorRatingSet).ToListAsync();

            // Resource pool
            var newResourcePool = new ResourcePool(null, distributionIndexAverage, currentUser.ResourcePoolRate, organizationSet, licenseSet, sectorSet);

            // Return
            return View(newResourcePool);
        }

        IQueryable<Organization> GetGenericIndexOrganizationQuery(string indexPrefix)
        {
            // TODO To have a correct sample, only retrieve organizations of that index
            var query = db.OrganizationSet
                .Include(organization => organization.Sector)
                .Include(organization => organization.License)
                .Where(organization => organization.Name.StartsWith(indexPrefix));

            if (IsAuthenticated)
                query = query.Where(o => o.UserId == CurrentUserId);

            return query;
        }

        IQueryable<Organization> GetAllInOneOrganizationQuery()
        {
            // TODO To have a correct sample, only retrieve organizations of that index
            var query = db.OrganizationSet.AsQueryable();

            if (IsAuthenticated)
                query = query.Where(o => o.UserId == CurrentUserId);

            return query;
        }

        [HttpPost]
        public async Task<ActionResult> IncreaseNumberOfSales(string returnAction)
        {
            IQueryable<Organization> organizationQuery = null;

            switch (returnAction)
            {
                case "TotalCostIndex": organizationQuery = GetGenericIndexOrganizationQuery("TCI - "); break;
                case "KnowledgeIndex": organizationQuery = GetGenericIndexOrganizationQuery("KI - "); break;
                case "QualityIndex": organizationQuery = GetGenericIndexOrganizationQuery("QI - "); break;
                case "SectorIndex": organizationQuery = GetGenericIndexOrganizationQuery("SI - "); break;
                case "CustomerSatisfactionIndex": organizationQuery = GetGenericIndexOrganizationQuery("CSI - "); break;
                case "EmployeeSatisfactionIndex": organizationQuery = GetGenericIndexOrganizationQuery("ESI - "); break;
                case "DistanceIndex": organizationQuery = GetGenericIndexOrganizationQuery("DI - "); break;
                case "AllInOne": organizationQuery = GetAllInOneOrganizationQuery(); break;
            }

            var organizationSet = await organizationQuery.ToListAsync();

            foreach (var organization in organizationSet)
            {
                organization.NumberOfSales++;
                organization.ModifiedOn = DateTime.Now;
                db.Entry(organization).State = EntityState.Modified;
            }

            await db.SaveChangesAsync();

            // Return
            if (string.IsNullOrWhiteSpace(returnAction))
                returnAction = "TotalCostIndex";
            return RedirectToAction(returnAction);
        }

        [HttpPost]
        public async Task<ActionResult> ResetNumberOfSales(string returnAction)
        {
            IQueryable<Organization> organizationQuery = null;

            switch (returnAction)
            {
                case "TotalCostIndex": organizationQuery = GetGenericIndexOrganizationQuery("TCI - "); break;
                case "KnowledgeIndex": organizationQuery = GetGenericIndexOrganizationQuery("KI - "); break;
                case "QualityIndex": organizationQuery = GetGenericIndexOrganizationQuery("QI - "); break;
                case "SectorIndex": organizationQuery = GetGenericIndexOrganizationQuery("SI - "); break;
                case "CustomerSatisfactionIndex": organizationQuery = GetGenericIndexOrganizationQuery("CSI - "); break;
                case "EmployeeSatisfactionIndex": organizationQuery = GetGenericIndexOrganizationQuery("ESI - "); break;
                case "DistanceIndex": organizationQuery = GetGenericIndexOrganizationQuery("DI - "); break;
                case "AllInOne": organizationQuery = GetAllInOneOrganizationQuery(); break;
            }

            var organizationSet = await organizationQuery.ToListAsync();

            foreach (var organization in organizationSet)
            {
                organization.NumberOfSales = 0;
                organization.ModifiedOn = DateTime.Now;
                db.Entry(organization).State = EntityState.Modified;
            }

            await db.SaveChangesAsync();

            // Return
            if (string.IsNullOrWhiteSpace(returnAction))
                returnAction = "TotalCostIndex";
            return RedirectToAction(returnAction);
        }
    }
}
