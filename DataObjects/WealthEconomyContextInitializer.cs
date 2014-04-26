namespace DataObjects
{
    using BusinessObjects;
    using System;
    using System.Data.Entity;

    public class WealthEconomyContextInitializer : DropCreateDatabaseIfModelChanges<WealthEconomyContext>
    {
        protected override void Seed(WealthEconomyContext context)
        {
            base.Seed(context);

            //// User
            //var newUser = new User()
            //{
            //    Email = "serkanholat@hotmail.com",
            //    Password = "1",
            //    UserAccountTypeId = 1,
            //    CreatedOn = DateTime.Now,
            //    ModifiedOn = DateTime.Now
            //};

            //context.User.Add(newUser);
            //context.SaveChanges();
        }
    }
}
