namespace DataObjects.Migrations
{
    using DataObjects;
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity.Migrations;

    internal sealed class Configuration : DbMigrationsConfiguration<WealthEconomyContext>
    {
        readonly IEnumerable<string> pendingMigrations;

        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
            ContextKey = "DataObjects.WealthEconomyContext";

            var migrator = new DbMigrator(this);
            pendingMigrations = migrator.GetPendingMigrations();
        }

        protected override void Seed(WealthEconomyContext context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data. E.g.
            //
            //    context.People.AddOrUpdate(
            //      p => p.FullName,
            //      new Person { FullName = "Andrew Peters" },
            //      new Person { FullName = "Brice Lambson" },
            //      new Person { FullName = "Rowan Miller" }
            //    );
            //

            foreach (var migration in pendingMigrations)
            {
                switch (migration)
                {
                    case "201405080802306_V0_10_8":
                        {
                            // For an unknown reason, context variable doesn't work with RoleManager and UserManager
                            var dbContext = new WealthEconomyContext();

                            // Admin
                            var roleStore = new RoleStore<IdentityRole>(dbContext);
                            var roleManager = new RoleManager<IdentityRole>(roleStore);
                            var adminRole = new IdentityRole("Administrator");
                            var adminRoleResult = roleManager.Create(adminRole);

                            // TODO result error check?
                            if (adminRoleResult == null)
                                return;

                            var userManager = new UserManager<IdentityUser>(new UserStore<IdentityUser>(dbContext));
                            var adminUser = new IdentityUser("admin");
                            var adminPassword = DateTime.Now.ToString("yyyyMMddHH");
                            
                            // TODO Make this better?
                            var adminUserResult = userManager.Create(adminUser, adminPassword);

                            // TODO result error check?
                            if (adminUserResult == null)
                                return;

                            var addToRoleResult = userManager.AddToRole(adminUser.Id, "Administrator");

                            // TODO result error check?

                            var userRepository = new UserRepository(dbContext);
                            userRepository.Insert(new BusinessObjects.User() { AspNetUserId = adminUser.Id, Email = adminUser.UserName });
                            userRepository.SaveChanges();

                            // TODO Handle this part by raising event and catching it in Facade layer, so UnitOfWork classes could be used?
                            // DatabaseSeeding.. ?

                            break;
                        }
                    default:
                        break;
                }            
            }
        }
    }
}
