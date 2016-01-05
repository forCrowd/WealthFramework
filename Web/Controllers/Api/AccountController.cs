namespace forCrowd.WealthEconomy.Web.Controllers.Api
{
    using BusinessObjects;
    using Extensions;
    using Microsoft.AspNet.Identity;
    using Microsoft.Owin.Security;
    using Models;
    using System.Linq;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Http;

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

        // POST api/Account/AddPassword
        public async Task<IHttpActionResult> AddPassword(AddPasswordBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var currentUser = await UserManager.FindByIdAsync(this.GetCurrentUserId().Value);
            var result = await UserManager.AddPasswordAsync(currentUser.Id, model.Password);
            var errorResult = GetErrorResult(result);

            if (errorResult != null)
            {
                return errorResult;
            }

            return Ok(currentUser);
        }

        // POST api/Account/ChangeEmail
        public async Task<IHttpActionResult> ChangeEmail(ChangeEmailBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Get the user
            var currentUser = await UserManager.FindByIdAsync(this.GetCurrentUserId().Value);
            var result = await UserManager.SetEmailAsync(currentUser.Id, model.Email);
            var errorResult = GetErrorResult(result);

            if (errorResult != null)
            {
                return errorResult;
            }

            return Ok(currentUser);
        }

        // POST api/Account/ChangePassword
        public async Task<IHttpActionResult> ChangePassword(ChangePasswordBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var currentUser = await UserManager.FindByIdAsync(this.GetCurrentUserId().Value);
            var result = await UserManager.ChangePasswordAsync(currentUser.Id, model.CurrentPassword, model.NewPassword);
            var errorResult = GetErrorResult(result);

            if (errorResult != null)
            {
                return errorResult;
            }

            return Ok(currentUser);
        }

        // POST api/Account/ConfirmEmail
        public async Task<IHttpActionResult> ConfirmEmail(ConfirmEmailBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var currentUser = await UserManager.FindByIdAsync(this.GetCurrentUserId().Value);
            var result = await UserManager.ConfirmEmailAsync(currentUser.Id, model.Token);
            var errorResult = GetErrorResult(result);

            if (errorResult != null)
            {
                return errorResult;
            }

            return Ok(currentUser);
        }

        // GET api/Account/ExternalLogin
        [HttpGet]
        [AllowAnonymous]
        public IHttpActionResult ExternalLogin(string provider)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Request a redirect to the external login provider
            return new Results.ChallengeResult(Request, provider, "/api/Account/ExternalLoginCallback");
        }

        // GET api/Account/ExternalLoginCallback
        [HttpGet]
        [AllowAnonymous]
        public async Task<IHttpActionResult> ExternalLoginCallback(string error = null)
        {
            var baseUrl = Framework.AppSettings.BaseUrl;

            // TODO Error check!
            if (!string.IsNullOrWhiteSpace(error))
            {
                // TODO With error message?
                return Redirect(string.Format("{0}/account/login", baseUrl));
            }

            var content = await GetLoginInfoText();

            var externalLoginInfo = await Authentication.GetExternalLoginInfoAsync();

            // SignOut first
            Authentication.SignOut(DefaultAuthenticationTypes.ExternalCookie);

            // Validate external login info
            if (externalLoginInfo == null)
            {
                // TODO With error message?
                return Redirect(string.Format("{0}/account/login", baseUrl));
            }

            // Validate email
            var email = externalLoginInfo.Email;
            if (string.IsNullOrWhiteSpace(email))
            {
                // TODO With error message?
                return Redirect(string.Format("{0}/account/login", baseUrl));
            }

            var tempToken = string.Empty;
            var user = await UserManager.FindAsync(externalLoginInfo.Login);

            // There is no externalLogin with these info
            if (user == null)
            {
                user = await UserManager.FindByEmailAsync(externalLoginInfo.Email);

                // And there is no user with this email address: New user
                if (user == null)
                {
                    user = new User(email);

                    var result = await UserManager.CreateAsync(user, externalLoginInfo.Login);

                    var errorResult = GetErrorResult(result);
                    if (errorResult != null)
                    {
                        // TODO This has to be a redirect?
                        return errorResult;
                    }
                }
                else // There is a user with this email: Link accounts
                {
                    var result = await UserManager.LinkLoginAsync(user, externalLoginInfo.Login);

                    var errorResult = GetErrorResult(result);
                    if (errorResult != null)
                    {
                        // TODO This has to be a redirect?
                        return errorResult;
                    }
                }
            }
            else // Existing user
            {
                // If the email address has changed meanwhile
                if (user.Email != email)
                    user.Email = email;

                await UserManager.AddTempTokenClaimAsync(user);
            }

            // Get the temp token
            tempToken = user.Claims.Single(claim => claim.ClaimType == "TempToken").ClaimValue;

            // Redirect
            var location = string.Format("{0}/account/externalLogin?tempToken={1}", baseUrl, tempToken);
            return Redirect(location);
        }

        // POST api/Account/Register
        [AllowAnonymous]
        public async Task<IHttpActionResult> Register(RegisterBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = new User(model.Email);

            var result = await UserManager.CreateAsync(user, model.Password);
            var errorResult = GetErrorResult(result);

            if (errorResult != null)
            {
                return errorResult;
            }

            // TODO This should be Created?
            return Ok(user);
        }

        // POST api/Account/ResendConfirmationEmail
        public async Task<IHttpActionResult> ResendConfirmationEmail()
        {
            var currentUserId = this.GetCurrentUserId();

            await UserManager.SendConfirmationEmailAsync(currentUserId.Value, true);

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

        private async Task<string> GetLoginInfoText()
        {
            var loginInfo = await Authentication.GetExternalLoginInfoAsync();

            var text = string.Empty;

            if (loginInfo != null)
            {
                text += "loginInfo.DefaultUserName: " + loginInfo.DefaultUserName + " - ";
                text += "loginInfo.Email: " + loginInfo.Email + " - ";
                text += "loginInfo.ExternalIdentity.AuthenticationType: " + loginInfo.ExternalIdentity.AuthenticationType + " - ";
                text += "loginInfo.ExternalIdentity.Claims.Count(): " + loginInfo.ExternalIdentity.Claims.Count() + " - ";
                foreach (var claim in loginInfo.ExternalIdentity.Claims)
                {
                    text += "claim.Type: " + claim.Type + " - ";
                    text += "claim.Value: " + claim.Value + " - ";
                }
                text += "loginInfo.ExternalIdentity.IsAuthenticated: " + loginInfo.ExternalIdentity.IsAuthenticated + " - ";
                text += "loginInfo.ExternalIdentity.Name: " + loginInfo.ExternalIdentity.Name + " - ";
                text += "loginInfo.ExternalIdentity.NameClaimType: " + loginInfo.ExternalIdentity.NameClaimType + " - ";
                text += "loginInfo.ExternalIdentity.RoleClaimType: " + loginInfo.ExternalIdentity.RoleClaimType + " - ";
                text += "loginInfo.Login.LoginProvider: " + loginInfo.Login.LoginProvider + " - ";
                text += "loginInfo.Login.ProviderKey: " + loginInfo.Login.ProviderKey + " - ";
            }

            return text;
        }

        #endregion
    }
}
