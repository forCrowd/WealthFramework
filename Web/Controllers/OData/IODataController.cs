using BusinessObjects;
using Facade;
using Microsoft.AspNet.Identity;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.OData;

namespace Web.Controllers.OData
{
    public interface IODataController<TEntity> where TEntity : class, IEntity
    {
        // GET odata/<TEntity>
        [Queryable]
        IQueryable<TEntity> Get();

        // GET odata/<TEntity>(5)
        [Queryable]
        SingleResult<TEntity> Get([FromODataUri] short key);

        // PUT odata/Sector(5)
        Task<IHttpActionResult> Put([FromODataUri] short key, TEntity item);

        // POST odata/Sector
        Task<IHttpActionResult> Post(TEntity item);

        // PATCH odata/Sector(5)
        [AcceptVerbs("PATCH", "MERGE")]
        Task<IHttpActionResult> Patch([FromODataUri] short key, Delta<Sector> patch);

        // DELETE odata/Sector(5)
        Task<IHttpActionResult> Delete([FromODataUri] short key);
    }
}
