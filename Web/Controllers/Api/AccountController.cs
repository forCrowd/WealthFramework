using BusinessObjects;
using Facade;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using Web.App_Code;
using Web.Models;

namespace Web.Controllers.Api
{
    [RoutePrefix("api/Account")]
    public class AccountController : ApiController
    {
        private const string LocalLoginProvider = "Local";

        //public AccountController()
        //    : this(Startup.UserManagerFactory(), Startup.OAuthOptions.AccessTokenFormat)
        //{
        //}

        //public AccountController(AspNetUserManager userManager,
        //    ISecureDataFormat<AuthenticationTicket> accessTokenFormat)
        //{
        //    UserManager = userManager;
        //    AccessTokenFormat = accessTokenFormat;
        //}

        public AccountController()
            : this(Startup.UserManagerFactory())
        {
        }

        public AccountController(AspNetUserManager userManager)
        {
            UserManager = userManager;
        }


        public AspNetUserManager UserManager { get; private set; }
        // public ISecureDataFormat<AuthenticationTicket> AccessTokenFormat { get; private set; }

        // POST api/Account/ChangePassword
        public async Task<IHttpActionResult> ChangePassword(ChangePasswordBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await UserManager.ChangePasswordAsync(User.Identity.GetUserId<int>(), model.CurrentPassword,
                model.NewPassword);
            var errorResult = GetErrorResult(result);

            if (errorResult != null)
            {
                return errorResult;
            }

            return Ok();
        }

        // GET api/Account/UserInfo
        [Route("UserInfo")]
        public async Task<UserInfoViewModel> GetUserInfo()
        {
            // var aspNetUserId = User.Identity.GetUserId();
            //User currentUser;
            //using (var unitOfWork = new UserUnitOfWork())
            //    currentUser = unitOfWork.AllLive.Single(user => user.AspNetUserId == aspNetUserId);

            // var appUser = User.Identity.

            var userId = User.Identity.GetUserId<int>();
            var currentUser = await UserManager.FindByIdAsync(User.Identity.GetUserId<int>()); 

            return new UserInfoViewModel
            {
                Id = currentUser.Id,
                Email = currentUser.Email,
                IsAdmin =  User.IsInRole("Administrator")
            };
        }

        // POST api/Account/Logout
        public IHttpActionResult Logout()
        {
            Request.GetOwinContext().Authentication.SignOut(CookieAuthenticationDefaults.AuthenticationType);
            return Ok();
        }

        // POST api/Account/Register
        [AllowAnonymous]
        public async Task<IHttpActionResult> Register(RegisterBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var aspNetUser = new User
            {
                UserName = model.Email,
                Email = model.Email,
                CreatedOn = System.DateTime.UtcNow,
                ModifiedOn = System.DateTime.UtcNow
            };

            // Create AspNetUser
            var result = await UserManager.CreateAsync(aspNetUser, model.Password);
            var errorResult = GetErrorResult(result);

            if (errorResult != null)
            {
                return errorResult;
            }

            //// Create the application user in relation with AspNetUser
            //using (var unitOfWork = new UserUnitOfWork())
            //{
            //    var user = new User()
            //    {
            //        //AspNetUserId = aspNetUser.Id,
            //        Email = aspNetUser.UserName,
            //    };

            //    await unitOfWork.InsertAsync(user, ApplicationSettings.SampleUserId);
            //}

            return Ok();
        }

        // POST api/Account/Register
        [HttpPost]
        public async Task<IHttpActionResult> ResetSampleData()
        {
            throw new System.NotImplementedException("yet");

            var currentUser = await UserManager.FindByIdAsync(User.Identity.GetUserId<int>());

            // var aspNetUserId = User.Identity.GetUserId();
            //using (var unitOfWork = new UserUnitOfWork())
            //{
            //    var currentUser = unitOfWork.AllLive.Single(user => user.AspNetUserId == aspNetUserId);
            //    await unitOfWork.ResetSampleDataAsync(currentUser.Id, ApplicationSettings.SampleUserId);
            //}

            return Ok();
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
                        ModelState.AddModelError("", error);
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
