using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace Web.CodeFirst
{
    public class CodeFirstContext : DbContext
    {
        public DbSet<License> LicenseSet { get; set; }
        public DbSet<Organization> OrganizationSet { get; set; }
    }
}