namespace BusinessObjects
{
    using Microsoft.AspNet.Identity.EntityFramework;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.ModelConfiguration.Conventions;
    using System.Data.Entity.Validation;
    using System.Linq;
    using System.Text;
    using System.Threading;
    using System.Threading.Tasks;

    public class WealthEconomyContext : IdentityDbContext<User, Role, int, UserLogin, UserRole, UserClaim>
    {
        public WealthEconomyContext()
            : base(nameOrConnectionString: "WealthEconomyContext")
        {
        }

        public WealthEconomyContext(string nameOrConnectionString)
            : base(nameOrConnectionString)
        {
        }

        public static WealthEconomyContext Create()
        {
            return new WealthEconomyContext();
        }

        // These definitions are used in generating OData metadata at the moment / SH - 07 Nov '14
        public virtual DbSet<ResourcePool> ResourcePool { get; set; }
        public virtual DbSet<Element> Element { get; set; }
        public virtual DbSet<ElementField> ElementField { get; set; }
        public virtual DbSet<ElementFieldIndex> ElementFieldIndex { get; set; }
        public virtual DbSet<ElementItem> ElementItem { get; set; }
        public virtual DbSet<ElementCell> ElementCell { get; set; }
        public virtual DbSet<UserResourcePool> UserResourcePool { get; set; }
        public virtual DbSet<UserElementFieldIndex> UserElementFieldIndex { get; set; }
        public virtual DbSet<UserElementCell> UserElementCell { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Conventions
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();

            // Table names
            modelBuilder.Entity<User>().ToTable("User");
            modelBuilder.Entity<UserClaim>().ToTable("UserClaim");
            modelBuilder.Entity<UserLogin>().ToTable("UserLogin");
            modelBuilder.Entity<UserRole>().ToTable("UserRole");
            modelBuilder.Entity<Role>().ToTable("Role");

            // Cascade deletes
            modelBuilder.Entity<ElementCell>()
                .HasRequired<ElementField>(item => item.ElementField)
                .WithMany(item => item.ElementCellSet)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<UserResourcePool>()
                .HasRequired<User>(item => item.User)
                .WithMany(item => item.UserResourcePoolSet)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<UserElementFieldIndex>()
                .HasRequired<User>(item => item.User)
                .WithMany(item => item.UserElementFieldIndexSet)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<UserElementCell>()
                .HasRequired<User>(item => item.User)
                .WithMany(item => item.UserElementCellSet)
                .WillCascadeOnDelete(false);
        }

        public override int SaveChanges()
        {
            ProcessChangeTrackerEntries();

            try
            {
                return base.SaveChanges();
            }
            catch (DbEntityValidationException entityException)
            {
                throw new Exception(CatchDbEntityValidationException(entityException), entityException);
            }
        }

        public override Task<int> SaveChangesAsync()
        {
            ProcessChangeTrackerEntries();

            try
            {
                return base.SaveChangesAsync();
            }
            catch (DbEntityValidationException entityException)
            {
                throw new Exception(CatchDbEntityValidationException(entityException), entityException);
            }
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken)
        {
            ProcessChangeTrackerEntries();

            try
            {
                return base.SaveChangesAsync(cancellationToken);
            }
            catch (DbEntityValidationException entityException)
            {
                throw new Exception(CatchDbEntityValidationException(entityException), entityException);
            }
        }

        void ProcessChangeTrackerEntries()
        {
            var entries = ChangeTracker.Entries().Where(e => e.State == EntityState.Added || e.State == EntityState.Modified);
            foreach (var item in entries)
            {
                var changedOrAddedItem = item.Entity as IEntity;
                if (changedOrAddedItem != null)
                {
                    if (item.State == EntityState.Added)
                        changedOrAddedItem.CreatedOn = DateTime.UtcNow;
                    changedOrAddedItem.ModifiedOn = DateTime.UtcNow;
                }
            }
        }

        string CatchDbEntityValidationException(DbEntityValidationException entityException)
        {
            var errors = entityException.EntityValidationErrors;
            var result = new StringBuilder();
            foreach (var error in errors)
                foreach (var validationError in error.ValidationErrors)
                    result.AppendFormat("\r\n  Entity of type {0} has validation error \"{1}\" for property {2}.\r\n", error.Entry.Entity.GetType().ToString(), validationError.ErrorMessage, validationError.PropertyName);
            return result.ToString();
        }
    }
}
