using BusinessObjects;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Web.Controllers.Mvc
{
    public partial class UserResourcePoolController
    {
        // GET: /UserResourcePool/TotalCostIndex
        public async Task<ActionResult> TotalCostIndex()
        {
            return await GenericResourcePoolView(1, UserResourcePoolType.Private, "TotalCostIndex");
        }

        // GET: /UserResourcePool/KnowledgeIndexPrivate
        public async Task<ActionResult> KnowledgeIndexPrivate()
        {
            ViewBag.ReturnAction = "KnowledgeIndexPrivate";
            return await KnowledgeIndex(UserResourcePoolType.Private);
        }

        // GET: /UserResourcePool/KnowledgeIndexPublic
        public async Task<ActionResult> KnowledgeIndexPublic()
        {
            ViewBag.ReturnAction = "KnowledgeIndexPublic";
            return await KnowledgeIndex(UserResourcePoolType.Public);
        }

        async Task<ActionResult> KnowledgeIndex(UserResourcePoolType userResourcePoolType)
        {
            return await GenericResourcePoolView(2, userResourcePoolType, "KnowledgeIndex");
        }

        // GET: /UserResourcePool/QualityIndexPrivate
        public async Task<ActionResult> QualityIndexPrivate()
        {
            ViewBag.ReturnAction = "QualityIndexPrivate";
            return await QualityIndex(UserResourcePoolType.Private);
        }

        // GET: /UserResourcePool/QualityIndexPublic
        public async Task<ActionResult> QualityIndexPublic()
        {
            ViewBag.ReturnAction = "QualityIndexPublic";
            return await QualityIndex(UserResourcePoolType.Public);
        }

        async Task<ActionResult> QualityIndex(UserResourcePoolType userResourcePoolType)
        {
            return await GenericResourcePoolView(3, userResourcePoolType, "QualityIndex");
        }

        // GET: /UserResourcePool/EmployeeSatisfactionIndexPrivate
        public async Task<ActionResult> EmployeeSatisfactionIndexPrivate()
        {
            ViewBag.ReturnAction = "EmployeeSatisfactionIndexPrivate";
            return await EmployeeSatisfactionIndex(UserResourcePoolType.Private);
        }

        // GET: /UserResourcePool/EmployeeSatisfactionIndexPublic
        public async Task<ActionResult> EmployeeSatisfactionIndexPublic()
        {
            ViewBag.ReturnAction = "EmployeeSatisfactionIndexPublic";
            return await EmployeeSatisfactionIndex(UserResourcePoolType.Public);
        }

        async Task<ActionResult> EmployeeSatisfactionIndex(UserResourcePoolType userResourcePoolType)
        {
            return await GenericResourcePoolView(4, userResourcePoolType, "EmployeeSatisfactionIndex");
        }

        // GET: /UserResourcePool/CustomerSatisfactionIndexPrivate
        public async Task<ActionResult> CustomerSatisfactionIndexPrivate()
        {
            ViewBag.ReturnAction = "CustomerSatisfactionIndexPrivate";
            return await CustomerSatisfactionIndex(UserResourcePoolType.Private);
        }

        // GET: /UserResourcePool/CustomerSatisfactionIndexPublic
        public async Task<ActionResult> CustomerSatisfactionIndexPublic()
        {
            ViewBag.ReturnAction = "CustomerSatisfactionIndexPublic";
            return await CustomerSatisfactionIndex(UserResourcePoolType.Public);
        }

        async Task<ActionResult> CustomerSatisfactionIndex(UserResourcePoolType userResourcePoolType)
        {
            return await GenericResourcePoolView(5, userResourcePoolType, "CustomerSatisfactionIndex");
        }

        // GET: /UserResourcePool/SectorIndexPrivate
        public async Task<ActionResult> SectorIndexPrivate()
        {
            ViewBag.ReturnAction = "SectorIndexPrivate";
            return await SectorIndex(UserResourcePoolType.Private);
        }

        // GET: /UserResourcePool/SectorIndexPublic
        public async Task<ActionResult> SectorIndexPublic()
        {
            ViewBag.ReturnAction = "SectorIndexPublic";
            return await SectorIndex(UserResourcePoolType.Public);
        }

        async Task<ActionResult> SectorIndex(UserResourcePoolType userResourcePoolType)
        {
            return await GenericResourcePoolView(6, userResourcePoolType, "SectorIndex");
        }

        // GET: /UserResourcePool/DistanceIndex
        public async Task<ActionResult> DistanceIndex()
        {
            return await GenericResourcePoolView(7, UserResourcePoolType.Private, "DistanceIndex");
        }

        // GET: /UserResourcePool/AllInOnePrivate
        public async Task<ActionResult> AllInOnePrivate()
        {
            ViewBag.ReturnAction = "AllInOnePrivate";
            return await AllInOne(UserResourcePoolType.Private);
        }

        // GET: /UserResourcePool/AllInOnePublic
        public async Task<ActionResult> AllInOnePublic()
        {
            ViewBag.ReturnAction = "AllInOnePublic";
            return await AllInOne(UserResourcePoolType.Public);
        }

        async Task<ActionResult> AllInOne(UserResourcePoolType userResourcePoolType)
        {
            return await GenericResourcePoolView(8, userResourcePoolType, "AllInOne");
        }

        async Task<ActionResult> GenericResourcePoolView(int resourcePoolId, UserResourcePoolType userResourcePoolType, string viewName)
        {
            // Get the user resource pool
            var userResourcePool = await GetUserResourcePool(resourcePoolId);

            // Type
            userResourcePool.UserResourcePoolType = userResourcePoolType;

            // Return
            return View(viewName, userResourcePool);        
        }

        async Task<UserResourcePool> GetUserResourcePool(int resourcePoolId)
        {
            // Get the current user
            var currentUser = await unitOfWork.FindUserAsync(CurrentUserId);

            // Return the user resource pool
            return currentUser.UserResourcePoolSet.Single(pool => pool.ResourcePoolId == resourcePoolId);
        }

        async Task<UserResourcePool> GetUserResourcePoolByReturnAction(string returnAction)
        {
            returnAction = returnAction.Replace("Private", "").Replace("Public", "");

            switch (returnAction)
            {
                case "TotalCostIndex": return await GetUserResourcePool(1);
                case "KnowledgeIndex": return await GetUserResourcePool(2);
                case "QualityIndex": return await GetUserResourcePool(3);
                case "EmployeeSatisfactionIndex": return await GetUserResourcePool(4);
                case "CustomerSatisfactionIndex": return await GetUserResourcePool(5);
                case "SectorIndex": return await GetUserResourcePool(6);
                case "DistanceIndex": return await GetUserResourcePool(7);
                case "AllInOne": return await GetUserResourcePool(8);
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
            var userResourcePool = await GetUserResourcePoolByReturnAction(returnAction);

            foreach (var item in userResourcePool.UserResourcePoolOrganizationSet)
            {
                item.NumberOfSales = isReset ? 0 : item.NumberOfSales + 1;
                unitOfWork.InsertOrUpdateUserResourcePoolOrganization(item);
            }

            await unitOfWork.SaveAsync();

            // Return
            if (string.IsNullOrWhiteSpace(returnAction))
                returnAction = "TotalCostIndex";
            return RedirectToAction(returnAction);        
        }
    }
}
