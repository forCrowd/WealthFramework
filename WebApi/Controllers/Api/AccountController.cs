namespace forCrowd.WealthEconomy.WebApi.Controllers.Api
{
    using BusinessObjects;
    using Extensions;
    using Microsoft.AspNet.Identity;
    using Microsoft.Owin.Security;
    using Models;
    using Results;
    using System;
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

        // POST api/Account/ChangeUserName
        public async Task<IHttpActionResult> ChangeUserName(ChangeUserNameBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Get the user
            var currentUser = await UserManager.FindByIdAsync(this.GetCurrentUserId().Value);
            var result = await UserManager.ChangeUserName(currentUser.Id, model.UserName);
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
        public IHttpActionResult ExternalLogin(string provider, string clientReturnUrl)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Request a redirect to the external login provider
            var callBackUrl = string.Format("/api/Account/ExternalLoginCallback?clientReturnUrl={0}", clientReturnUrl);
            return new ChallengeResult(Request, provider, callBackUrl);
        }

        // GET api/Account/ExternalLoginCallback
        [HttpGet]
        [AllowAnonymous]
        public async Task<IHttpActionResult> ExternalLoginCallback(string clientReturnUrl, string error = null)
        {
            var clientAppUrl = Framework.AppSettings.ClientAppUrl;
            var location = string.Format("{0}/_system/account/login?clientReturnUrl={1}", clientAppUrl, clientReturnUrl);

            // Error message from the provider, pass it on
            if (!string.IsNullOrWhiteSpace(error))
            {
                return Redirect(string.Format("{0}&error={1}", location, error));
            }

            // Since this method MUST return RedirectResult, cover the whole block with try & catch,
            // so it always redirect the user back to ngClient and won't get stuck on WebApi in case of an error
            // SH - 16 Jan. '16
            try
            {
                var content = await GetLoginInfoText();

                var externalLoginInfo = await Authentication.GetExternalLoginInfoAsync();

                // We will switch to local account, sign out from the external
                Authentication.SignOut(DefaultAuthenticationTypes.ExternalCookie);

                // Validate external login info
                if (externalLoginInfo == null)
                {
                    // User canceled the operation?
                    return Redirect(string.Format("{0}&error={1}", location, "Login failed, please try again"));
                }

                // Validate email
                var email = externalLoginInfo.Email;
                if (string.IsNullOrWhiteSpace(email))
                {
                    // User didn't give permission for email address
                    return Redirect(string.Format("{0}&error={1}", location, "Login failed, please give permission to access your email address"));
                }

                var user = await UserManager.FindAsync(externalLoginInfo.Login);

                // There is no externalLogin with these info
                if (user == null)
                {
                    user = await UserManager.FindByEmailAsync(externalLoginInfo.Email);

                    // And there is no user with this email address: New user
                    if (user == null)
                    {
                        var userName = await UserManager.GetUniqueUserNameFromEmail(email);
                        user = new User(userName, email);

                        var result = await UserManager.CreateAsync(user, externalLoginInfo.Login);

                        var errorMessage = GetErrorMessage(result);
                        if (errorMessage != null)
                        {
                            return Redirect(string.Format("{0}&error={1}", location, errorMessage));
                        }

                        // init=true: to let the client knows that this account is newly created (first login from this external login)
                        location = string.Format("{0}&init=true", location);
                    }
                    else // There is a user with this email: Link accounts
                    {
                        var result = await UserManager.LinkLoginAsync(user, externalLoginInfo.Login);

                        var errorMessage = GetErrorMessage(result);
                        if (errorMessage != null)
                        {
                            return Redirect(string.Format("{0}&error={1}", location, errorMessage));
                        }
                    }
                }
                else // Existing user
                {
                    // If the email address has changed meanwhile
                    if (user.Email != email)
                    {
                        user.Email = email;
                    }

                    await UserManager.AddSingleUseTokenAsync(user);
                }

                // Redirect
                return Redirect(string.Format("{0}&token={1}", location, user.SingleUseToken));
            }
            catch (Exception ex)
            {
                // Log the exception with Elmah
                var logger = new ExceptionHandling.ElmahExceptionLogger();
                logger.Log(ex, Request, "AccountController.ExternalLoginCallback");

                // Redirect the user back to the client
                return Redirect(string.Format("{0}&error={1}", location, "Login failed, please try again later"));
            }
        }

        // POST api/Account/Register
        [AllowAnonymous]
        public async Task<IHttpActionResult> Register(RegisterBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = new User(model.UserName, model.Email)
            {
                IsAnonymous = false
            };

            var result = await UserManager.CreateAsync(user, model.Password);
            var errorResult = GetErrorResult(result);

            if (errorResult != null)
            {
                return errorResult;
            }

            // TODO This should be Created?
            return Ok(user);
        }

        // POST api/Account/RegisterAnonymous
        [AllowAnonymous]
        public async Task<IHttpActionResult> RegisterAnonymous(RegisterAnonymousBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = new User(model.UserName, model.Email)
            {
                IsAnonymous = true
            };

            var result = await UserManager.CreateAnonymousAsync(user);
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

        [AllowAnonymous]
        public async Task<IHttpActionResult> ResetPassword(ResetPasswordBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var currentUser = await UserManager.FindByEmailAsync(model.Email);
            var result = await UserManager.ResetPasswordAsync(currentUser.Id, model.Token, model.NewPassword);
            var errorResult = GetErrorResult(result);

            if (errorResult != null)
            {
                return errorResult;
            }

            return Ok(currentUser);
        }

        [AllowAnonymous]
        public async Task<IHttpActionResult> ResetPasswordRequest(ResetPasswordRequestBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var currentUser = await UserManager.FindByEmailAsync(model.Email);
            await UserManager.SendResetPasswordEmailAsync(currentUser.Id);

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

        /// <summary>
        /// String version of GetErrorResult for ExternalLoginCallback function
        /// </summary>
        /// <param name="result"></param>
        /// <returns></returns>
        private string GetErrorMessage(IdentityResult result)
        {
            if (result == null)
            {
                return "Internal server error";
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    return string.Join(" - ", result.Errors);
                }
                else
                {
                    return "Bad request";
                }
            }

            return null;
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
