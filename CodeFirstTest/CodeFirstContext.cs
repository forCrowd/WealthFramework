using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace CodeFirstTest
{
    public class CodeFirstContext : DbContext
    {
        public CodeFirstContext()
        {
        }

        public CodeFirstContext(string nameOrConnectionString) : base(nameOrConnectionString)
        {
        }

        public DbSet<License> LicenseSet { get; set; }
        public DbSet<Organization> OrganizationSet { get; set; }
    }
}