using System.Data.SqlClient;

namespace Web.Controllers.Mvc
{
    // TODO Remove or what?
    public partial class DatabaseAlterationController : BaseController
    {
        public string ExecuteScript_0_1_4()
        {
            // 1.
            // ExecuteSqlCommand(ALTER TABLE [dbo].[User] ADD [ResourcePoolRate] [decimal] (18,2) NOT NULL CONSTRAINT [DF_User_ResourcePoolRate] DEFAULT ((0)));

            // 2.
            //ExecuteSqlCommand("ALTER TABLE [dbo].[Sector] ALTER COLUMN [Description] [nvarchar] (max) COLLATE Latin1_General_CI_AS NULL");
            //ExecuteSqlCommand("ALTER TABLE [dbo].[Sector] ALTER COLUMN [Name] [nvarchar] (50) COLLATE Latin1_General_CI_AS NOT NULL");
            //ExecuteSqlCommand("ALTER TABLE [dbo].[License] ALTER COLUMN [Description] [nvarchar] (max) COLLATE Latin1_General_CI_AS NULL");
            //ExecuteSqlCommand("ALTER TABLE [dbo].[License] ALTER COLUMN [Name] [nvarchar] (50) COLLATE Latin1_General_CI_AS NOT NULL");
            //ExecuteSqlCommand("ALTER TABLE [dbo].[License] ALTER COLUMN [Text] [nvarchar] (max) COLLATE Latin1_General_CI_AS NOT NULL");
            //ExecuteSqlCommand("ALTER TABLE [dbo].[Organization] ALTER COLUMN [Name] [nvarchar] (100) COLLATE Latin1_General_CI_AS NOT NULL");

            return "OK";
        }

        public void ExecuteSqlCommand(string commandText)
        {
            //var db = new WealthEconomyEntities();
            //using (var sqlConnection = new SqlConnection(db.Database.Connection.ConnectionString))
            //{
            //    using (var sqlCommand = new SqlCommand(commandText, sqlConnection))
            //    {
            //        sqlConnection.Open();
            //        sqlCommand.ExecuteNonQuery();
            //        sqlConnection.Close();
            //    }
            //}
        }
    }
}
