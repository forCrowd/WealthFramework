//using System;
//using System.Collections.Generic;
//using System.Data;
//using System.Data.Entity;
//using System.Data.Entity.Infrastructure;
//using System.Linq;
//using System.Net;
//using System.Net.Http;
//using System.Web.Http;
//using System.Web.Http.Description;
//using BusinessObjects;
//using DataObjects;
//using Facade;
//using System.Threading.Tasks;
//using BusinessObjects.Dto;

//namespace Web.Controllers.Api
//{
//    public class UserHelperController : ApiController
//    {
//        [HttpGet]
//        public async Task<UserDto> CurrentUser()
//        {
//            if (System.Web.HttpContext.Current == null)
//                return null;

//            if (System.Web.HttpContext.Current.Session["CurrentUserId"] == null)
//                return null;

//            var currentUserId = (int)System.Web.HttpContext.Current.Session["CurrentUserId"];

//            var unitOfWork = new UserUnitOfWork();
//            var currentUser = await unitOfWork.FindAsync(currentUserId);
//            return new UserDto(currentUser);
//        }

//        [HttpPost]
//        public IHttpActionResult Login([FromBody] UserDto userDto)
//        {
//            var unitOfWork = new UserUnitOfWork();

//            // Authenticate user
//            var user = unitOfWork.AuthenticateUser2(userDto.Email, userDto.Password);

//            if (user == null)
//                return BadRequest();

//            // Save user id in the session
//            // TODO Use token system
//            System.Web.HttpContext.Current.Session.Add("CurrentUserId", user.Id);
//            System.Web.HttpContext.Current.Session.Add("CurrentUserEmail", user.Email);
//            System.Web.HttpContext.Current.Session.Add("CurrentUserAccountTypeId", user.UserAccountTypeId);

//            return Ok();
//        }

//        // POST api/UserHelper/Logout
//        [HttpPost]
//        public IHttpActionResult Logout()
//        {
//            System.Web.HttpContext.Current.Session.Abandon();
//            return Ok();
//        }
//    }
//}