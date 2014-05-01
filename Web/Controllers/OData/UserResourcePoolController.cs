using BusinessObjects;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.OData;
// using System.Web;

namespace Web.Controllers.OData
{
    public partial class UserResourcePoolController
    {
        //// GET: /UserResourcePool/TotalCostIndex
        //public async Task<ActionResult> TotalCostIndex()
        //{
        //    return await GenericResourcePoolView(1, UserResourcePoolType.Private, "TotalCostIndex");
        //}

        //// GET: /UserResourcePool/KnowledgeIndexPrivate
        //public async Task<ActionResult> KnowledgeIndexPrivate()
        //{
        //    return await KnowledgeIndex(UserResourcePoolType.Private);
        //}

        //// GET: /UserResourcePool/KnowledgeIndexPublic
        //public async Task<ActionResult> KnowledgeIndexPublic()
        //{
        //    return await KnowledgeIndex(UserResourcePoolType.Public);
        //}

        //async Task<ActionResult> KnowledgeIndex(UserResourcePoolType userResourcePoolType)
        //{
        //    return await GenericResourcePoolView(2, userResourcePoolType, "KnowledgeIndex");
        //}

        //// GET: /UserResourcePool/QualityIndexPrivate
        //public async Task<ActionResult> QualityIndexPrivate()
        //{
        //    return await QualityIndex(UserResourcePoolType.Private);
        //}

        //// GET: /UserResourcePool/QualityIndexPublic
        //public async Task<ActionResult> QualityIndexPublic()
        //{
        //    return await QualityIndex(UserResourcePoolType.Public);
        //}

        //async Task<ActionResult> QualityIndex(UserResourcePoolType userResourcePoolType)
        //{
        //    return await GenericResourcePoolView(3, userResourcePoolType, "QualityIndex");
        //}

        //// GET: /UserResourcePool/EmployeeSatisfactionIndexPrivate
        //public async Task<ActionResult> EmployeeSatisfactionIndexPrivate()
        //{
        //    return await EmployeeSatisfactionIndex(UserResourcePoolType.Private);
        //}

        //// GET: /UserResourcePool/EmployeeSatisfactionIndexPublic
        //public async Task<ActionResult> EmployeeSatisfactionIndexPublic()
        //{
        //    return await EmployeeSatisfactionIndex(UserResourcePoolType.Public);
        //}

        //async Task<ActionResult> EmployeeSatisfactionIndex(UserResourcePoolType userResourcePoolType)
        //{
        //    return await GenericResourcePoolView(4, userResourcePoolType, "EmployeeSatisfactionIndex");
        //}

        //// GET: /UserResourcePool/CustomerSatisfactionIndexPrivate
        //public async Task<ActionResult> CustomerSatisfactionIndexPrivate()
        //{
        //    return await CustomerSatisfactionIndex(UserResourcePoolType.Private);
        //}

        //// GET: /UserResourcePool/CustomerSatisfactionIndexPublic
        //public async Task<ActionResult> CustomerSatisfactionIndexPublic()
        //{
        //    return await CustomerSatisfactionIndex(UserResourcePoolType.Public);
        //}

        //async Task<ActionResult> CustomerSatisfactionIndex(UserResourcePoolType userResourcePoolType)
        //{
        //    return await GenericResourcePoolView(5, userResourcePoolType, "CustomerSatisfactionIndex");
        //}

        //// GET: /UserResourcePool/SectorIndexPrivate
        //public async Task<ActionResult> SectorIndexPrivate()
        //{
        //    return await SectorIndex(UserResourcePoolType.Private);
        //}

        //// GET: /UserResourcePool/SectorIndexPublic
        //public async Task<ActionResult> SectorIndexPublic()
        //{
        //    return await SectorIndex(UserResourcePoolType.Public);
        //}

        //async Task<ActionResult> SectorIndex(UserResourcePoolType userResourcePoolType)
        //{
        //    return await GenericResourcePoolView(6, userResourcePoolType, "SectorIndex");
        //}

        //// GET: /UserResourcePool/DistanceIndex
        //public async Task<ActionResult> DistanceIndex()
        //{
        //    return await GenericResourcePoolView(7, UserResourcePoolType.Private, "DistanceIndex");
        //}

        //// GET: /UserResourcePool/AllInOnePrivate
        //public async Task<ActionResult> AllInOnePrivate()
        //{
        //    return await AllInOne(UserResourcePoolType.Private);
        //}

        //// GET: /UserResourcePool/AllInOnePublic
        //public async Task<ActionResult> AllInOnePublic()
        //{
        //    return await AllInOne(UserResourcePoolType.Public);
        //}

        //async Task<ActionResult> AllInOne(UserResourcePoolType userResourcePoolType)
        //{
        //    return await GenericResourcePoolView(8, userResourcePoolType, "AllInOne");
        //}

        //async Task<ActionResult> GenericResourcePoolView(int resourcePoolId, UserResourcePoolType userResourcePoolType, string viewName)
        //{
        //    // Get the user resource pool
        //    var userResourcePool = await GetUserResourcePool(resourcePoolId);

        //    // Type
        //    userResourcePool.UserResourcePoolType = userResourcePoolType;

        //    // Return
        //    return View(viewName, userResourcePool);        
        //}

        //async Task<UserResourcePool> GetUserResourcePool(int resourcePoolId)
        //{
        //    // Get the current user
        //    var currentUser = await unitOfWork.FindUserAsync(CurrentUserId);

        //    // Return the user resource pool
        //    return currentUser.UserResourcePoolSet.First(pool => pool.ResourcePoolId == resourcePoolId);
        //}

        //async Task<UserResourcePool> GetUserResourcePoolByReturnAction(string returnAction)
        //{
        //    returnAction = returnAction.Replace("Private", "").Replace("Public", "");

        //    switch (returnAction)
        //    {
        //        case "TotalCostIndex": return await GetUserResourcePool(1);
        //        case "KnowledgeIndex": return await GetUserResourcePool(2);
        //        case "QualityIndex": return await GetUserResourcePool(3);
        //        case "EmployeeSatisfactionIndex": return await GetUserResourcePool(4);
        //        case "CustomerSatisfactionIndex": return await GetUserResourcePool(5);
        //        case "SectorIndex": return await GetUserResourcePool(6);
        //        case "DistanceIndex": return await GetUserResourcePool(7);
        //        case "AllInOne": return await GetUserResourcePool(8);
        //    }

        //    return null;
        //}

        //// [Route("odata/Test")]
        //[HttpPost]
        //public string Test([FromODataUri] int key)
        //{
        //    return "test value";
        //}

        ////[HttpPost]
        //[HttpPost]
        //public UserResourcePool GetUserResourcePoolPublic()
        //{
        //    var list = unitOfWork.AllLive.Where(item => item.Id == 1).AsEnumerable();
        //    var pool = list.First();
        //    pool.UserResourcePoolType = UserResourcePoolType.Public;
        //    return pool;
        //}

        // POST odata/UserResourcePool
        [HttpPost]
        [Authorize]
        public async Task<IHttpActionResult> IncreaseNumberOfSales([FromODataUri] int key)
        {
            return await UpdateNumberOfSales(key, false);
        }
        
        [HttpPost]
        public async Task<IHttpActionResult> ResetNumberOfSales([FromODataUri] int key)
        {
            return await UpdateNumberOfSales(key, true);
        }

        async Task<IHttpActionResult> UpdateNumberOfSales(int userResourcePoolId, bool isReset)
        {
            // Get the organizations
            var userResourcePool = GetUserResourcePool(userResourcePoolId).Queryable.SingleOrDefault();

            // Not found
            if (userResourcePool == null)
                return NotFound();
            
            // Reset or increase number of sales
            if (isReset)
                unitOfWork.ResetNumberOfSales(userResourcePool);
            else
                unitOfWork.IncreaseNumberOfSales(userResourcePool);
            
            await unitOfWork.SaveAsync();

            return Updated(userResourcePool);
        }
    }
}
