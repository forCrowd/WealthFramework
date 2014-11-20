namespace DataObjects
{
    using BusinessObjects;
    using DataObjects.Migrations;
    using Microsoft.AspNet.Identity;
    using System;
    using System.Data.Entity;

    public class DropCreateDatabaseAlways : DropCreateDatabaseAlways<WealthEconomyContext>
    {
        protected override void Seed(WealthEconomyContext context)
        {
            base.Seed(context);

            DatabaseInitializer.SeedInitialData(context);
        }
    }
}
