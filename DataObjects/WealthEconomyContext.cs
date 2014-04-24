namespace DataObjects
{
    using BusinessObjects;
    using System.Data.Entity;
    using System.Data.Entity.ModelConfiguration.Conventions;

    public class WealthEconomyEntities : DbContext
    {
        public WealthEconomyEntities() : base()
        {
        }

        public WealthEconomyEntities(string nameOrConnectionString)
            : base(nameOrConnectionString)
        {
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            Database.SetInitializer(new DropCreateDatabaseIfModelChanges<WealthEconomyEntities>());
            
            modelBuilder.Conventions.Remove<OneToManyCascadeDeleteConvention>();
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
