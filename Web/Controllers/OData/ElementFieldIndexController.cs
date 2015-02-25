namespace Web.Controllers.OData
{
    using BusinessObjects;
    using Web.Controllers.Extensions;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    using System.Linq;
    using System.Net;
    using System.Threading.Tasks;
    using System.Web.Http;
    using System.Web.Http.OData.Query;

    public partial class ElementFieldIndexController
    {
        //// GET odata/ElementFieldIndex
        ////[Queryable]
        ////[Queryable]
        //public override IQueryable<ElementFieldIndex> Get()
        //{
        //    var userId = this.GetCurrentUserId();
        //    if (!userId.HasValue)
        //        throw new HttpResponseException(HttpStatusCode.Unauthorized);

        //    var query = MainUnitOfWork
        //        .AllLive
        //        .Include(item => item.UserElementFieldIndexSet);
        //        //.Where(index => index.UserElementFieldIndexSet.Any(userIndex => userIndex.UserId == 1));
        //        // .Select(item => item.)
        //        //.Where(index => index.UserElementFieldIndexSet.Any(userIndex => userIndex.UserId == userId.Value));
        //        //.Where(index => index.UserElementFieldIndexSet.Any(userIndex => userIndex.UserId == userId.Value));

        //    // query = query.Select(item => new ElementFieldIndex())
        //    query = query.Select(item => (ElementFieldIndex) new { ElementFieldIndex = item });

        //    // query = query.Select(x => x).

        //    var result = query.ToList();

        //    return query;
        //    //return new System.Collections.Generic.HashSet<ElementFieldIndex>().AsQueryable();
        //}
    }
}
