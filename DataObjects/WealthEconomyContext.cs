namespace DataObjects
{
    using BusinessObjects;
    using DataObjects.Migrations;
    using Microsoft.AspNet.Identity.EntityFramework;
    using System.Data.Entity;
    using System.Data.Entity.ModelConfiguration.Conventions;

    public class WealthEconomyContext : IdentityDbContext<IdentityUser>
    {
        public WealthEconomyContext()
            : base(nameOrConnectionString: "WealthEconomyContext")
        {
        }

        public WealthEconomyContext(string nameOrConnectionString)
            : base(nameOrConnectionString)
        {
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Conventions
            // a. Don't pluralize
            modelBuilder.Conventions.Remove<System.Data.Entity.ModelConfiguration.Conventions.PluralizingTableNameConvention>();

            // b. Disable cascade delete
            // TODO This was necessary because both Sector - Organization refers to ResourcePool?
            modelBuilder.Conventions.Remove<OneToManyCascadeDeleteConvention>();
        }

        public static void InitializeDatabase()
        {
            Database.SetInitializer(new MigrateDatabaseToLatestVersion<WealthEconomyContext, Configuration>());
        }

        public virtual DbSet<License> License { get; set; }
        public virtual DbSet<Organization> Organization { get; set; }
        public virtual DbSet<Sector> Sector { get; set; }
        public virtual DbSet<User> User { get; set; }
        public virtual DbSet<UserLicenseRating> UserLicenseRating { get; set; }
        public virtual DbSet<UserSectorRating> UserSectorRating { get; set; }
        public virtual DbSet<ResourcePool> ResourcePool { get; set; }
        public virtual DbSet<UserResourcePool> UserResourcePool { get; set; }
        public virtual DbSet<UserOrganization> UserOrganization { get; set; }
    }
}
