using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.OData;

namespace Web.Controllers.OData
{
    public partial class UserSectorRatingController
    {
        public override async Task<IHttpActionResult> Patch(int key, Delta<BusinessObjects.UserSectorRating> patch)
        {
            var entity = patch.GetEntity();

            if (entity.Rating < 0)
                entity.Rating = 0;

            return await base.Patch(key, patch);
        }
    }
}
