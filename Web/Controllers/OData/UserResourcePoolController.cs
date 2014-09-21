using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.OData;

namespace Web.Controllers.OData
{
    public partial class UserResourcePoolController
    {
        // POST odata/UserResourcePool(1)/IncreaseNumberOfSales
        [HttpPost]
        public async Task<IHttpActionResult> IncreaseNumberOfSales([FromODataUri] int key)
        {
            var userResourcePool = Get(key).Queryable.SingleOrDefault();

            if (userResourcePool == null)
                return NotFound();
            
            await MainUnitOfWork.IncreaseNumberOfSales(userResourcePool);

            return Ok();
        }

        // POST odata/UserResourcePool(1)/IncreaseNumberOfSales
        [HttpPost]
        public async Task<IHttpActionResult> DecreaseNumberOfSales([FromODataUri] int key)
        {
            var userResourcePool = Get(key).Queryable.SingleOrDefault();

            if (userResourcePool == null)
                return NotFound();

            await MainUnitOfWork.DecreaseNumberOfSales(userResourcePool);

            return Ok();
        }

        // POST odata/UserResourcePool(1)/ResetNumberOfSales
        [HttpPost]
        public async Task<IHttpActionResult> ResetNumberOfSales([FromODataUri] int key)
        {
            var userResourcePool = Get(key).Queryable.SingleOrDefault();

            if (userResourcePool == null)
                return NotFound();

            await MainUnitOfWork.ResetNumberOfSales(userResourcePool);

            return Ok();
        }
    }
}
