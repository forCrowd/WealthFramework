namespace BusinessObjects
{
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
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }

        public virtual DbSet<Element> Element { get; set; }
        public virtual DbSet<ElementField> ElementField { get; set; }
        public virtual DbSet<ElementItem> ElementItem { get; set; }
        public virtual DbSet<ElementCell> ElementCell { get; set; }
        public virtual DbSet<ResourcePool> ResourcePool { get; set; }
        public virtual DbSet<ResourcePoolIndex> ResourcePoolIndex { get; set; }
        public virtual DbSet<User> User { get; set; }
        public virtual DbSet<UserElementCell> UserElementCell { get; set; }
        public virtual DbSet<UserResourcePool> UserResourcePool { get; set; }
        public virtual DbSet<UserResourcePoolIndex> UserResourcePoolIndex { get; set; }
    }
}
