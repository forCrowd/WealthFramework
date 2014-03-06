using BusinessObjects;
using DataObjects;
using System;
using System.Data.Entity;
using System.Linq;
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
            var newResourcePool = new ResourcePool(currentUser, ResourcePoolType.Public, distributionIndexAverage, currentUser.ResourcePoolRate, organizationSet);
            
            // Return
            return View(newResourcePool);
        }

        // GET: /ResourcePool/KnowledgeIndexPrivate
        public async Task<ActionResult> KnowledgeIndexPrivate()
        {
            ViewBag.Title = "Knowledge Index - Private";
            ViewBag.ReturnAction = "KnowledgeIndexPrivate";
            return await KnowledgeIndex(ResourcePoolType.Private);
        }

        // GET: /ResourcePool/KnowledgeIndexPublic
        public async Task<ActionResult> KnowledgeIndexPublic()
        {
            ViewBag.Title = "Knowledge Index - Public";
            ViewBag.ReturnAction = "KnowledgeIndexPublic";
            return await KnowledgeIndex(ResourcePoolType.Public);
        }

        async Task<ActionResult> KnowledgeIndex(ResourcePoolType resourcePoolType)
        {
            // Current user
            var currentUser = await db.UserSet.FindAsync(CurrentUserId);

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
            var newResourcePool = new ResourcePool(currentUser, resourcePoolType, distributionIndexAverage, currentUser.ResourcePoolRate, organizationSet, licenseSet);

            // Return
            return View("KnowledgeIndex", newResourcePool);
        }

        // GET: /ResourcePool/QualityIndexPrivate
        public async Task<ActionResult> QualityIndexPrivate()
        {
            ViewBag.Title = "Quality Index - Private";
            ViewBag.ReturnAction = "QualityIndexPrivate";
            return await QualityIndex(ResourcePoolType.Private);
        }

        // GET: /ResourcePool/QualityIndexPublic
        public async Task<ActionResult> QualityIndexPublic()
        {
            ViewBag.Title = "Quality Index - Public";
            ViewBag.ReturnAction = "QualityIndexPublic";
            return await QualityIndex(ResourcePoolType.Public);
        }

        async Task<ActionResult> QualityIndex(ResourcePoolType resourcePoolType)
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
            var newResourcePool = new ResourcePool(currentUser, resourcePoolType, distributionIndexAverage, currentUser.ResourcePoolRate, organizationSet);

            // Return
            return View("QualityIndex", newResourcePool);
        }

        // GET: /ResourcePool/SectorIndexPrivate
        public async Task<ActionResult> SectorIndexPrivate()
        {
            ViewBag.Title = "Sector Index - Private";
            ViewBag.ReturnAction = "SectorIndexPrivate";
            return await SectorIndex(ResourcePoolType.Private);
        }

        // GET: /ResourcePool/SectorIndexPublic
        public async Task<ActionResult> SectorIndexPublic()
        {
            ViewBag.Title = "Sector Index - Public";
            ViewBag.ReturnAction = "SectorIndexPublic";
            return await SectorIndex(ResourcePoolType.Public);
        }

        async Task<ActionResult> SectorIndex(ResourcePoolType resourcePoolType)
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
            var newResourcePool = new ResourcePool(currentUser, resourcePoolType, distributionIndexAverage, currentUser.ResourcePoolRate, organizationSet, null, sectorSet);

            // Return
            return View("SectorIndex", newResourcePool);
        }

        // GET: /ResourcePool/EmployeeSatisfactionIndexPrivate
        public async Task<ActionResult> EmployeeSatisfactionIndexPrivate()
        {
            ViewBag.Title = "Employee Satisfaction Index - Private";
            ViewBag.ReturnAction = "EmployeeSatisfactionIndexPrivate";
            return await EmployeeSatisfactionIndex(ResourcePoolType.Private);
        }

        // GET: /ResourcePool/EmployeeSatisfactionIndexPublic
        public async Task<ActionResult> EmployeeSatisfactionIndexPublic()
        {
            ViewBag.Title = "Employee Satisfaction Index - Public";
            ViewBag.ReturnAction = "EmployeeSatisfactionIndexPublic";
            return await EmployeeSatisfactionIndex(ResourcePoolType.Public);
        }

        async Task<ActionResult> EmployeeSatisfactionIndex(ResourcePoolType resourcePoolType)
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
            var newResourcePool = new ResourcePool(currentUser, resourcePoolType, distributionIndexAverage, currentUser.ResourcePoolRate, organizationSet);

            // Return
            return View("EmployeeSatisfactionIndex", newResourcePool);
        }

        // GET: /ResourcePool/CustomerSatisfactionIndexPrivate
        public async Task<ActionResult> CustomerSatisfactionIndexPrivate()
        {
            ViewBag.Title = "Customer Satisfaction Index - Private";
            ViewBag.ReturnAction = "CustomerSatisfactionIndexPrivate";
            return await CustomerSatisfactionIndex(ResourcePoolType.Private);
        }

        // GET: /ResourcePool/CustomerSatisfactionIndexPublic
        public async Task<ActionResult> CustomerSatisfactionIndexPublic()
        {
            ViewBag.Title = "Customer Satisfaction Index - Public";
            ViewBag.ReturnAction = "CustomerSatisfactionIndexPublic";
            return await CustomerSatisfactionIndex(ResourcePoolType.Public);
        }

        async Task<ActionResult> CustomerSatisfactionIndex(ResourcePoolType resourcePoolType)
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
            var newResourcePool = new ResourcePool(currentUser, resourcePoolType, distributionIndexAverage, currentUser.ResourcePoolRate, organizationSet);

            // Return
            return View("CustomerSatisfactionIndex", newResourcePool);
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
            var newResourcePool = new ResourcePool(currentUser, ResourcePoolType.Public, distributionIndexAverage, currentUser.ResourcePoolRate, organizationSet);

            // Return
            return View(newResourcePool);
        }

        // GET: /ResourcePool/AllInOnePrivate
        public async Task<ActionResult> AllInOnePrivate()
        {
            ViewBag.Title = "All in One - Private";
            ViewBag.ReturnAction = "AllInOnePrivate";
            return await AllInOne(ResourcePoolType.Private);
        }

        // GET: /ResourcePool/AllInOnePublic
        public async Task<ActionResult> AllInOnePublic()
        {
            ViewBag.Title = "All in One - Public";
            ViewBag.ReturnAction = "AllInOnePublic";
            return await AllInOne(ResourcePoolType.Public);
        }

        async Task<ActionResult> AllInOne(ResourcePoolType resourcePoolType)
        {
            // Current user
            var currentUser = await db.UserSet.FindAsync(CurrentUserId);

            // Distribution index average; unlike the other Views that focuses on certain Index, this shows all indexes and uses real user index rating averages
            var userDistributionIndexRatingRepository = new UserDistributionIndexRatingRepository(db);
            var distributionIndexAverage = resourcePoolType == ResourcePoolType.Public
                ? await userDistributionIndexRatingRepository.GetAverageAsync()
                : await userDistributionIndexRatingRepository.GetAverageAsync(currentUser.Id);

            // Organization set
            var organizationSet = await GetAllInOneOrganizationQuery().ToListAsync();

            // License set
            var licenseSet = await db.LicenseSet.Include(license => license.UserLicenseRatingSet).ToListAsync();

            // Sector set
            var sectorSet = await db.SectorSet.Include(sector => sector.UserSectorRatingSet).ToListAsync();

            // Resource pool
            var newResourcePool = new ResourcePool(currentUser, resourcePoolType, distributionIndexAverage, currentUser.ResourcePoolRate, organizationSet, licenseSet, sectorSet);

            // Return
            return View("AllInOne", newResourcePool);
        }

        IQueryable<Organization> GetGenericIndexOrganizationQuery(string indexPrefix)
        {
            // TODO To have a correct sample, only retrieve organizations of that index
            var query = db.OrganizationSet
                .Include(organization => organization.Sector)
                .Include(organization => organization.License)
                .Where(organization => organization.Name.StartsWith(indexPrefix));

            return query;
        }

        IQueryable<Organization> GetAllInOneOrganizationQuery()
        {
            // Get all organizations
            return db.OrganizationSet.AsQueryable();
        }

        IQueryable<Organization> GetOrganizationQueryByReturnAction(string returnAction)
        {
            switch (returnAction.Replace("Private", "").Replace("Public", ""))
            {
                case "TotalCostIndex": return GetGenericIndexOrganizationQuery("TCI - ");
                case "KnowledgeIndex": return GetGenericIndexOrganizationQuery("KI - ");
                case "QualityIndex": return GetGenericIndexOrganizationQuery("QI - ");
                case "SectorIndex": return GetGenericIndexOrganizationQuery("SI - ");
                case "CustomerSatisfactionIndex": return GetGenericIndexOrganizationQuery("CSI - ");
                case "EmployeeSatisfactionIndex": return GetGenericIndexOrganizationQuery("ESI - ");
                case "DistanceIndex": return GetGenericIndexOrganizationQuery("DI - ");
                case "AllInOne": return GetAllInOneOrganizationQuery();
            }

            return null;
        }

        [HttpPost]
        public async Task<ActionResult> IncreaseNumberOfSales(string returnAction)
        {
            return await UpdateNumberOfSales(returnAction, false);
        }

        [HttpPost]
        public async Task<ActionResult> ResetNumberOfSales(string returnAction)
        {
            return await UpdateNumberOfSales(returnAction, true);
        }

        async Task<ActionResult> UpdateNumberOfSales(string returnAction, bool isReset)
        {
            // Get the organizations
            var organizationSet = await GetOrganizationQueryByReturnAction(returnAction).ToListAsync();

            foreach (var organization in organizationSet)
            {
                var userOrganization = organization.UserOrganizationRatingSet.Single(item => item.UserId == CurrentUserId && item.OrganizationId == organization.Id);
                userOrganization.NumberOfSales = isReset ? 0 : userOrganization.NumberOfSales + 1;
                userOrganization.ModifiedOn = DateTime.Now;
                db.Entry(userOrganization).State = EntityState.Modified;
            }

            await db.SaveChangesAsync();

            // Return
            if (string.IsNullOrWhiteSpace(returnAction))
                returnAction = "TotalCostIndex";
            return RedirectToAction(returnAction);        
        }
    }
}
