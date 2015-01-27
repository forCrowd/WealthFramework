using BusinessObjects.ViewModels;
using Facade;
using System;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using Web.Controllers.Extensions;

namespace Web.Controllers.Api
{
    [RoutePrefix("api/ElementCustom")]
    public class ElementCustomController : BaseApiController
    {
        public ElementCustomController()
        {
        }

        // POST api/ElementCustom/IncreaseMultiplier/1
        //[HttpPost]
        [Route("IncreaseMultiplier/{elementId:int:min(1)}")]
        public async Task<IHttpActionResult> IncreaseMultiplier(int elementId)
        {
            using (var manager = new ElementUnitOfWork())
            {

                var element = await manager.FindAsync(elementId);

                if (element == null)
                    return NotFound();

                var currentUserId = this.GetCurrentUserId().Value;
                var currentUser = await manager.FindUserById(currentUserId);

                element.FilterSettings.CurrentUser = currentUser;

                await manager.IncreaseMultiplierAsync(element, currentUser);
            }

            return Ok(string.Empty);
        }

        // POST api/ElementCustom/DecreaseMultiplier/1
        //[HttpPost]
        [Route("DecreaseMultiplier/{elementId:int:min(1)}")]
        public async Task<IHttpActionResult> DecreaseMultiplier(int elementId)
        {
            using (var manager = new ElementUnitOfWork())
            {
                var element = await manager.FindAsync(elementId);

                if (element == null)
                    return NotFound();

                var currentUserId = this.GetCurrentUserId().Value;
                var currentUser = await manager.FindUserById(currentUserId);

                element.FilterSettings.CurrentUser = currentUser;

                await manager.DecreaseMultiplierAsync(element, currentUser);
            }

            return Ok(string.Empty);
        }

        // POST api/ElementCustom/ResetMultiplier/1
        //[HttpPost]
        [Route("ResetMultiplier/{elementId:int:min(1)}")]
        public async Task<IHttpActionResult> ResetMultiplier(int elementId)
        {
            using (var manager = new ElementUnitOfWork())
            {
                var element = await manager.FindAsync(elementId);

                if (element == null)
                    return NotFound();

                var currentUserId = this.GetCurrentUserId().Value;
                var currentUser = await manager.FindUserById(currentUserId);

                element.FilterSettings.CurrentUser = currentUser;

                await manager.ResetMultiplierAsync(element, currentUser);
            }

            return Ok(string.Empty);
        }
    }
}
