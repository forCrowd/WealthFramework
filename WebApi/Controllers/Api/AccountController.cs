using forCrowd.WealthEconomy.BusinessObjects.Entities;

namespace forCrowd.WealthEconomy.WebApi.Controllers.Api
{
    using BusinessObjects;
    using Microsoft.AspNet.Identity;
    using Microsoft.Owin.Security;
    using Models;
    using Results;
    using System;
    using System.Net;
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
            var currentUserId = User.Identity.GetUserId<int>();
            var currentUser = await UserManager.FindByIdAsync(currentUserId);

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
            // Get the user
            var currentUserId = User.Identity.GetUserId<int>();
            var currentUser = await UserManager.FindByIdAsync(currentUserId);

            var result = await UserManager.SetEmailAsync(currentUser.Id, model.Email, model.ClientAppUrl);
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
            var currentUserId = User.Identity.GetUserId<int>();
            var currentUser = await UserManager.FindByIdAsync(currentUserId);

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
            // Get the user
            var currentUserId = User.Identity.GetUserId<int>();
            var currentUser = await UserManager.FindByIdAsync(currentUserId);

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
            var currentUserId = User.Identity.GetUserId<int>();
            var currentUser = await UserManager.FindByIdAsync(currentUserId);

            var result = await UserManager.ConfirmEmailAsync(currentUser.Id, model.Token);
            var errorResult = GetErrorResult(result);

            if (errorResult != null)
            {
                return errorResult;
            }

            return Ok(currentUser);
        }

        // GET api/Account/CurrentUser
        [HttpGet]
        [AllowAnonymous]
        public async Task<User> CurrentUser()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return null;
            }

            var currentUserId = User.Identity.GetUserId<int>();

            return await UserManager.FindByIdAsync(currentUserId);
        }

        // GET api/Account/ExternalLogin
        [HttpGet]
        [AllowAnonymous]
        public IHttpActionResult ExternalLogin(string provider, string clientReturnUrl)
        {
            // Request a redirect to the external login provider
            var callBackUrl = $"/api/Account/ExternalLoginCallback?clientReturnUrl={clientReturnUrl}";
            return new ChallengeResult(Request, provider, callBackUrl);
        }

        // GET api/Account/ExternalLoginCallback
        [HttpGet]
        [AllowAnonymous]
        public async Task<IHttpActionResult> ExternalLoginCallback(string clientReturnUrl, string error = null)
        {
            // Error message from the provider, pass it on
            if (!string.IsNullOrWhiteSpace(error))
            {
                return Redirect($"{clientReturnUrl};error={error}");
            }

            // Since this method MUST return RedirectResult, cover the whole block with try & catch,
            // so it always redirect the user back to ngClient and won't get stuck on WebApi in case of an error
            // coni2k - 16 Jan. '16
            try
            {
                var externalLoginInfo = await Request.GetOwinContext().Authentication.GetExternalLoginInfoAsync();

                // We will switch to local account, sign out from the external
                Request.GetOwinContext().Authentication.SignOut(DefaultAuthenticationTypes.ExternalCookie);

                // Validate external login info
                if (externalLoginInfo == null)
                {
                    // User canceled the operation?
                    return Redirect($"{clientReturnUrl};error=Login failed, please try again");
                }

                // Validate email
                var email = externalLoginInfo.Email;
                if (string.IsNullOrWhiteSpace(email))
                {
                    // User didn't give permission for email address
                    return Redirect(
                        $"{clientReturnUrl};error=Login failed, please give permission to access your email address");
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

                        var result = await UserManager.CreateUserWithExternalLoginAsync(user, externalLoginInfo.Login);

                        var errorMessage = GetErrorMessage(result);
                        if (errorMessage != null)
                        {
                            return Redirect($"{clientReturnUrl};error={errorMessage}");
                        }

                        // init=true: to let the client knows that this account is newly created (first login from this external login)
                        clientReturnUrl = $"{clientReturnUrl};init=true";
                    }
                    else // There is a user with this email: Link accounts
                    {
                        var result = await UserManager.LinkLoginAsync(user, externalLoginInfo.Login);

                        var errorMessage = GetErrorMessage(result);
                        if (errorMessage != null)
                        {
                            return Redirect($"{clientReturnUrl};error={errorMessage}");
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
                return Redirect($"{clientReturnUrl};token={user.SingleUseToken}");
            }
            catch (Exception ex)
            {
                // Log the exception with Elmah
                var logger = new ExceptionHandling.ElmahExceptionLogger();
                logger.Log(ex, Request, "AccountController.ExternalLoginCallback");

                // Redirect the user back to the client
                return Redirect($"{clientReturnUrl};error=Login failed, please try again later");
            }
        }

        // POST api/Account/Register
        [AllowAnonymous]
        public async Task<IHttpActionResult> Register(RegisterBindingModel model)
        {
            var user = new User(model.UserName, model.Email);

            var result = await UserManager.CreateUserAsync(user, model.Password, model.AutoGenerated, model.ClientAppUrl);
            var errorResult = GetErrorResult(result);

            if (errorResult != null)
            {
                return errorResult;
            }

            // TODO This should be Created?
            return Ok(user);
        }

        // POST api/Account/ResendConfirmationEmail
        public async Task<IHttpActionResult> ResendConfirmationEmail(ResendConfirmationEmailBindingModel model)
        {
            var currentUserId = User.Identity.GetUserId<int>();

            await UserManager.ResendConfirmationEmailAsync(currentUserId, model.ClientAppUrl);

            return StatusCode(HttpStatusCode.NoContent);
        }

        [AllowAnonymous]
        public async Task<IHttpActionResult> ResetPassword(ResetPasswordBindingModel model)
        {
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
            var currentUser = await UserManager.FindByEmailAsync(model.Email);

            if (currentUser == null)
            {
                return BadRequest("Incorrect email");
            }

            await UserManager.SendResetPasswordEmailAsync(currentUser.Id, model.ClientAppUrl);

            return StatusCode(HttpStatusCode.NoContent);
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
                    foreach (var error in result.Errors)
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
