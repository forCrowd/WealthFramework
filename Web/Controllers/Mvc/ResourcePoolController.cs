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
        private WealthEconomyEntities db = new WealthEconomyEntities();

        // GET: /ResourcePool/TotalCostIndex
        public async Task<ActionResult> TotalCostIndex()
        {
            // Distribution index average
            var distributionIndexAverage = await new DataObjects.UserDistributionIndexRatingRepository(db).GetAverageAsync();

            // Resource pool rate
            // TODO ?!
            var user = IsAuthenticated
                ? await db.UserSet.FindAsync(CurrentUserId)
                : await db.UserSet.FirstAsync();
            var resourcePoolRate = user.ResourcePoolRate;

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
            // Distribution index average
            var distributionIndexAverage = await new DataObjects.UserDistributionIndexRatingRepository(db).GetAverageAsync();

            // Resource pool rate
            // TODO ?!
            var user = IsAuthenticated
                ? await db.UserSet.FindAsync(CurrentUserId)
                : await db.UserSet.FirstAsync();
            var resourcePoolRate = user.ResourcePoolRate;

            // Organization set
            // TODO To have a correct sample, only retrieve organizations of that index
            var organizationDbSet = db.OrganizationSet
                .Include(organization => organization.License)
                .Where(organization => organization.Name.StartsWith("KI - "));
            var organizationSet = await organizationDbSet.ToListAsync();

            // License set
            var licenseSet = await db.LicenseSet.Include(license => license.UserLicenseRating).ToListAsync();

            // Resource pool
            var newResourcePool = new ResourcePool(distributionIndexAverage, resourcePoolRate, organizationSet, licenseSet);

            // Return
            return View(newResourcePool);
        }

        // GET: /ResourcePool/QualityIndex
        public async Task<ActionResult> QualityIndex()
        {
            // Distribution index average
            var distributionIndexAverage = await new DataObjects.UserDistributionIndexRatingRepository(db).GetAverageAsync();

            // Resource pool rate
            // TODO ?!
            var user = IsAuthenticated
                ? await db.UserSet.FindAsync(CurrentUserId)
                : await db.UserSet.FirstAsync();
            var resourcePoolRate = user.ResourcePoolRate;

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
            // Distribution index average
            var distributionIndexAverage = await new DataObjects.UserDistributionIndexRatingRepository(db).GetAverageAsync();

            // Resource pool rate
            // TODO ?!
            var user = IsAuthenticated
                ? await db.UserSet.FindAsync(CurrentUserId)
                : await db.UserSet.FirstAsync();
            var resourcePoolRate = user.ResourcePoolRate;

            // Organization set
            // TODO To have a correct sample, only retrieve organizations of that index
            var organizationDbSet = db.OrganizationSet
                .Include(organization => organization.Sector)
                .Where(organization => organization.Name.StartsWith("SI - "));
            var organizationSet = await organizationDbSet.ToListAsync();

            // Sector set
            var sectorSet = await db.SectorSet.Include(sector => sector.UserSectorRating).ToListAsync();

            // Resource pool
            var newResourcePool = new ResourcePool(distributionIndexAverage, resourcePoolRate, organizationSet, null, sectorSet);

            // Return
            return View(newResourcePool);
        }

        // GET: /ResourcePool/EmployeeSatisfactionIndex
        public async Task<ActionResult> EmployeeSatisfactionIndex()
        {
            // Distribution index average
            var distributionIndexAverage = await new DataObjects.UserDistributionIndexRatingRepository(db).GetAverageAsync();

            // Resource pool rate
            // TODO ?!
            var user = IsAuthenticated
                ? await db.UserSet.FindAsync(CurrentUserId)
                : await db.UserSet.FirstAsync();
            var resourcePoolRate = user.ResourcePoolRate;

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
            // Distribution index average
            var distributionIndexAverage = await new DataObjects.UserDistributionIndexRatingRepository(db).GetAverageAsync();

            // Resource pool rate
            // TODO ?!
            var user = IsAuthenticated
                ? await db.UserSet.FindAsync(CurrentUserId)
                : await db.UserSet.FirstAsync();
            var resourcePoolRate = user.ResourcePoolRate;

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

        // GET: /ResourcePool/AllInOne
        public async Task<ActionResult> AllInOne()
        {
            // Distribution index average
            var distributionIndexAverage = await new DataObjects.UserDistributionIndexRatingRepository(db).GetAverageAsync();

            // Resource pool rate
            // TODO ?!
            var user = IsAuthenticated
                ? await db.UserSet.FindAsync(CurrentUserId)
                : await db.UserSet.FirstAsync();
            var resourcePoolRate = user.ResourcePoolRate;

            // Organization set
            var organizationSet = await db.OrganizationSet.ToListAsync();

            // License set
            var licenseSet = await db.LicenseSet.Include(license => license.UserLicenseRating).ToListAsync();

            // Sector set
            var sectorSet = await db.SectorSet.Include(sector => sector.UserSectorRating).ToListAsync();

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
