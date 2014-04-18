using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using BusinessObjects;
using DataObjects;
using Facade;
using System.Threading.Tasks;
using BusinessObjects.Dto;
using System.Reflection;

namespace Web.Controllers.Api
{
    public class ApplicationController : ApiController
    {
        [HttpGet]
        public ApplicationInfo CurrentVersion()
        {
            return new ApplicationInfo() { CurrentVersion = Assembly.GetAssembly(this.GetType()).GetName().Version.ToString() };
        }
    }

    public class ApplicationInfo
    {
        public string CurrentVersion { get; set; }
    }
}