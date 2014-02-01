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
            // Distribution index average; Make only the current index 100% to be able to see the correct effect of it
            var distributionIndexAverage = new UserDistributionIndexRatingAverage()
            {
                RatingCount = 1,
                TotalCostIndexRating = 100
            };

            // Resource pool rate
            // TODO ?!
            var user = IsAuthenticated
                ? await db.UserSet.FindAsync(CurrentUserId)
                : await db.UserSet.FirstOrDefaultAsync();

            // Resource pool rate
            var resourcePoolRate = (user != null)
                ? user.ResourcePoolRate
                : 0M;

            // Organization set
            // TODO To have a correct sample, only retrieve organizations of that index
            var organizationDbSet = db.OrganizationSet
                .Where(organization => organization.Name.StartsWith("TCI - "));
            var organizationSet = await organizationDbSet.ToListAsync();

            // Resource pool
            var newResourcePool = new ResourcePool(distributionIndexAverage, resourcePoolRate, organizationSet);
            
            // Return
            return View(newResourcePool);
        }

        // GET: /ResourcePool/KnowledgeIndex
        public async Task<ActionResult> KnowledgeIndex()
        {
            // Distribution index average; Make only the current index 100% to be able to see the correct effect of it
            var distributionIndexAverage = new UserDistributionIndexRatingAverage()
            {
                RatingCount = 1,
                KnowledgeIndexRating = 100
            };

            // User
            // TODO ?!
            var user = IsAuthenticated
                ? await db.UserSet.FindAsync(CurrentUserId)
                : await db.UserSet.FirstOrDefaultAsync();

            // Resource pool rate
            var resourcePoolRate = (user != null)
                ? user.ResourcePoolRate
                : 0M;

            // Organization set
            // TODO To have a correct sample, only retrieve organizations of that index
            var organizationDbSet = db.OrganizationSet
                .Include(organization => organization.License)
                .Where(organization => organization.Name.StartsWith("KI - "));
            var organizationSet = await organizationDbSet.ToListAsync();

            // License set
            var licenseSet = await db.LicenseSet.Include(license => license.UserLicenseRatingSet).ToListAsync();

            // Resource pool
            var newResourcePool = new ResourcePool(distributionIndexAverage, resourcePoolRate, organizationSet, licenseSet);

            // Return
            return View(newResourcePool);
        }

        // GET: /ResourcePool/QualityIndex
        public async Task<ActionResult> QualityIndex()
        {
            // Distribution index average; Make only the current index 100% to be able to see the correct effect of it
            var distributionIndexAverage = new UserDistributionIndexRatingAverage()
            {
                RatingCount = 1,
                QualityIndexRating = 100
            };

            // Resource pool rate
            // TODO ?!
            var user = IsAuthenticated
                ? await db.UserSet.FindAsync(CurrentUserId)
                : await db.UserSet.FirstOrDefaultAsync();

            // Resource pool rate
            var resourcePoolRate = (user != null)
                ? user.ResourcePoolRate
                : 0M;

            // Organization set
            // TODO To have a correct sample, only retrieve organizations of that index
            var organizationDbSet = db.OrganizationSet
                .Include(organization => organization.License)
                .Where(organization => organization.Name.StartsWith("QI - "));
            var organizationSet = await organizationDbSet.ToListAsync();

            // Resource pool
            var newResourcePool = new ResourcePool(distributionIndexAverage, resourcePoolRate, organizationSet);

            // Return
            return View(newResourcePool);
        }

        // GET: /ResourcePool/SectorIndex
        public async Task<ActionResult> SectorIndex()
        {
            // Distribution index average; Make only the current index 100% to be able to see the correct effect of it
            var distributionIndexAverage = new UserDistributionIndexRatingAverage()
            {
                RatingCount = 1,
                SectorIndexRating = 100
            };

            // Resource pool rate
            // TODO ?!
            var user = IsAuthenticated
                ? await db.UserSet.FindAsync(CurrentUserId)
                : await db.UserSet.FirstOrDefaultAsync();

            // Resource pool rate
            var resourcePoolRate = (user != null)
                ? user.ResourcePoolRate
                : 0M;

            // Organization set
            // TODO To have a correct sample, only retrieve organizations of that index
            var organizationDbSet = db.OrganizationSet
                .Include(organization => organization.Sector)
                .Where(organization => organization.Name.StartsWith("SI - "));
            var organizationSet = await organizationDbSet.ToListAsync();

            // Sector set
            var sectorSet = await db.SectorSet.Include(sector => sector.UserSectorRatingSet).ToListAsync();

            // Resource pool
            var newResourcePool = new ResourcePool(distributionIndexAverage, resourcePoolRate, organizationSet, null, sectorSet);

            // Return
            return View(newResourcePool);
        }

        // GET: /ResourcePool/EmployeeSatisfactionIndex
        public async Task<ActionResult> EmployeeSatisfactionIndex()
        {
            // Distribution index average; Make only the current index 100% to be able to see the correct effect of it
            var distributionIndexAverage = new UserDistributionIndexRatingAverage()
            {
                RatingCount = 1,
                EmployeeSatisfactionIndexRating = 100
            };

            // Resource pool rate
            // TODO ?!
            var user = IsAuthenticated
                ? await db.UserSet.FindAsync(CurrentUserId)
                : await db.UserSet.FirstOrDefaultAsync();

            // Resource pool rate
            var resourcePoolRate = (user != null)
                ? user.ResourcePoolRate
                : 0M;

            // Organization set
            // TODO To have a correct sample, only retrieve organizations of that index
            var organizationDbSet = db.OrganizationSet
                .Where(organization => organization.Name.StartsWith("ESI - "));
            var organizationSet = await organizationDbSet.ToListAsync();

            // Resource pool
            var newResourcePool = new ResourcePool(distributionIndexAverage, resourcePoolRate, organizationSet);

            // Return
            return View(newResourcePool);
        }

        // GET: /ResourcePool/CustomerSatisfactionIndex
        public async Task<ActionResult> CustomerSatisfactionIndex()
        {
            // Distribution index average; Make only the current index 100% to be able to see the correct effect of it
            var distributionIndexAverage = new UserDistributionIndexRatingAverage()
            {
                RatingCount = 1,
                CustomerSatisfactionIndexRating = 100
            };

            // Resource pool rate
            // TODO ?!
            var user = IsAuthenticated
                ? await db.UserSet.FindAsync(CurrentUserId)
                : await db.UserSet.FirstOrDefaultAsync();

            // Resource pool rate
            var resourcePoolRate = (user != null)
                ? user.ResourcePoolRate
                : 0M;

            // Organization set
            // TODO To have a correct sample, only retrieve organizations of that index
            var organizationDbSet = db.OrganizationSet
                .Where(organization => organization.Name.StartsWith("CSI - "));
            var organizationSet = await organizationDbSet.ToListAsync();

            // Resource pool
            var newResourcePool = new ResourcePool(distributionIndexAverage, resourcePoolRate, organizationSet);

            // Return
            return View(newResourcePool);
        }

        // GET: /ResourcePool/DistanceIndex
        public async Task<ActionResult> DistanceIndex()
        {
            // Distribution index average; Make only the current index 100% to be able to see the correct effect of it
            var distributionIndexAverage = new UserDistributionIndexRatingAverage()
            {
                RatingCount = 1,
                DistanceIndexRating = 100
            };

            // Resource pool rate
            // TODO ?!
            var user = IsAuthenticated
                ? await db.UserSet.FindAsync(CurrentUserId)
                : await db.UserSet.FirstOrDefaultAsync();

            // Resource pool rate
            var resourcePoolRate = (user != null)
                ? user.ResourcePoolRate
                : 0M;

            // Organization set
            // TODO To have a correct sample, only retrieve organizations of that index
            var organizationDbSet = db.OrganizationSet
                .Where(organization => organization.Name.StartsWith("DI - "));
            var organizationSet = await organizationDbSet.ToListAsync();

            // Resource pool
            var newResourcePool = new ResourcePool(distributionIndexAverage, resourcePoolRate, organizationSet);

            // Return
            return View(newResourcePool);
        }

        // GET: /ResourcePool/AllInOne
        public async Task<ActionResult> AllInOne()
        {
            // Distribution index average; unlike the other Views that focuses on certain Index, this shows all indexes and uses real user index rating averages
            var distributionIndexAverage = await new UserDistributionIndexRatingRepository(db).GetAverageAsync();

            // Resource pool rate
            // TODO ?!
            var user = IsAuthenticated
                ? await db.UserSet.FindAsync(CurrentUserId)
                : await db.UserSet.FirstOrDefaultAsync();

            // Resource pool rate
            var resourcePoolRate = (user != null)
                ? user.ResourcePoolRate
                : 0M;

            // Organization set
            var organizationSet = await db.OrganizationSet.ToListAsync();

            // License set
            var licenseSet = await db.LicenseSet.Include(license => license.UserLicenseRatingSet).ToListAsync();

            // Sector set
            var sectorSet = await db.SectorSet.Include(sector => sector.UserSectorRatingSet).ToListAsync();

            // Resource pool
            var newResourcePool = new ResourcePool(distributionIndexAverage, resourcePoolRate, organizationSet, licenseSet, sectorSet);

            // Return
            return View(newResourcePool);
        }

        [HttpPost]
        public async Task<ActionResult> IncreaseNumberOfSales(string returnAction)
        {
            var organizationSet = db.OrganizationSet;

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
            var organizationSet = db.OrganizationSet;

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
