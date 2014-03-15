using BusinessObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Web.Controllers.Mvc
{
    public partial class UserController
    {
        public ActionResult Login()
        {
            ViewBag.Title = "Login";

            ViewBag.UserId = new SelectList(unitOfWork.AllLive.AsEnumerable(), "Id", "Email");
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Login(int UserId, string Password)
        {
            ViewBag.UserId = new SelectList(unitOfWork.AllLive.AsEnumerable(), "Id", "Email");

            // Authenticate user
            var isAuthenticated = await unitOfWork.AuthenticateUser(UserId, Password);

            // TODO ?!
            if (!isAuthenticated)
                return View();

            var selectedUser = await unitOfWork.FindAsync(UserId);

            // Save user id in the session
            // TODO Use token system
            System.Web.HttpContext.Current.Session.Add("CurrentUserId", selectedUser.Id);
            System.Web.HttpContext.Current.Session.Add("CurrentUserEmail", selectedUser.Email);
            System.Web.HttpContext.Current.Session.Add("CurrentUserAccountTypeId", selectedUser.UserAccountTypeId);
            return RedirectToAction("Index", "Home");
        }

        public ActionResult Logout()
        {
            System.Web.HttpContext.Current.Session.Abandon();
            return RedirectToAction("Index", "Home");
        }

        IEnumerable<dynamic> GetAvailableUserAccountTypes()
        {
            // User account types
            var userAccountTypes = Enum.GetValues(typeof(UserAccountType))
                .OfType<UserAccountType>()
                .Select(item => new { Id = item, Name = item.ToString() });

            // If it's not admin, show only the current option
            if (!(IsAuthenticated && CurrentUserAccountTypeId == UserAccountType.Administrator))
                userAccountTypes = userAccountTypes.Where(accountType => accountType.Id == UserAccountType.Standard);

            // Return
            return userAccountTypes;
        }
    }
}
