using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using System.Web.Http.OData;
using System.Web.Http.OData.Routing;
using BusinessObjects;
using DataObjects;

namespace Web.Controllers.OData
{
    public class A1Controller : ODataController
    {
        private WealthEconomyEntities db = new WealthEconomyEntities();

        // GET odata/Organization
        [Queryable]
        public IQueryable<A1> GetA1()
        {
            return db.A1;
        }
    }
}
