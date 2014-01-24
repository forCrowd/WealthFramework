using DataObjects;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Web.Controllers.Mvc
{
    public partial class UserDistributionIndexRatingController : Controller
    {
        public async Task<ActionResult> Report()
        {
            var repository = new UserDistributionIndexRatingRepository(db);
            return View(await repository.GetAverageAsync());
        }
    }
}
