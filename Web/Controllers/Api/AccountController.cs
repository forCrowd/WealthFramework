using BusinessObjects;
using Microsoft.AspNet.Identity;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using Web.Controllers.Extensions;
using Web.Models;

namespace Web.Controllers.Api
{
    [RoutePrefix("api/Account")]
    public class AccountController : BaseApiController
    {
        private const string LocalLoginProvider = "Local";

        public AccountController()
        {
        }

        public AccountController(ISecureDataFormat<AuthenticationTicket> accessTokenFormat)
        {
            AccessTokenFormat = accessTokenFormat;
        }

        public ISecureDataFormat<AuthenticationTicket> AccessTokenFormat { get; private set; }

        // GET api/Account/UserInfo
        [AllowAnonymous]
        [Route("UserInfo")]
        public async Task<UserInfoViewModel> GetUserInfo()
        {
            var currentUser = await GetCurrentUserAsync();

            if (currentUser == null)
            {
                return null;
            }

            var userInfo = new UserInfoViewModel
            {
                Id = currentUser.Id,
                Email = currentUser.Email,
                IsAdmin = this.GetCurrentUserIsAdmin()
            };

            return userInfo;
        }

        // POST api/Account/ChangePassword
        public async Task<IHttpActionResult> ChangePassword(ChangePasswordBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var currentUserId = this.GetCurrentUserId();

            // TODO Is this correct result?
            if (!currentUserId.HasValue)
                return InternalServerError();

            var result = await UserManager.ChangePasswordAsync(currentUserId.Value, model.CurrentPassword,
                model.NewPassword);
            var errorResult = GetErrorResult(result);

            if (errorResult != null)
            {
                return errorResult;
            }

            return Ok(string.Empty);
        }

        // POST api/Account/Logout
        public IHttpActionResult Logout()
        {
            Authentication.SignOut(CookieAuthenticationDefaults.AuthenticationType);
            return Ok(string.Empty);
        }

        // POST api/Account/Register
        [AllowAnonymous]
        public async Task<IHttpActionResult> Register(RegisterBindingModel model)
        {
            // ModelState.Add(new System.Collections.Generic.KeyValuePair<string,ModelState>("key1", new ModelState() { }))
            // .ModelStateModelState.Add()
            //ModelState.AddModelError("error1", "error message 1");
            //ModelState.AddModelError("error1", new System.Exception("exception message 1"));
            //return BadRequest(ModelState);

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = new User(model.Email);

            var result = await UserManager.CreateWithSampleDataAsync(user, model.Password, Framework.AppSettings.SampleUserId);
            var errorResult = GetErrorResult(result);

            if (errorResult != null)
            {
                return errorResult;
            }

            return Ok(string.Empty);
        }

        // POST api/Account/Register
        //[HttpPost]
        public async Task<IHttpActionResult> ResetSampleData()
        {
            var currentUserId = this.GetCurrentUserId();

            // TODO Is this correct result?
            if (!currentUserId.HasValue)
                return InternalServerError();

            await UserManager.ResetSampleDataAsync(currentUserId.Value, Framework.AppSettings.SampleUserId);

            return Ok(string.Empty);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                UserManager.Dispose();
            }

            base.Dispose(disposing);
        }

        #region Helpers

        private IAuthenticationManager Authentication
        {
            get { return Request.GetOwinContext().Authentication; }
        }

        private IHttpActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return InternalServerError();
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (string error in result.Errors)
                    {
                        ModelState.AddModelError("Errors", error);
                    }
                }

                if (ModelState.IsValid)
                {
                    // No ModelState errors are available to send, so just return an empty BadRequest.
                    return BadRequest();
                }

                return BadRequest(ModelState);
            }

            return null;
        }

        #endregion
    }
}
