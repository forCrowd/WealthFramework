namespace DataObjects.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    using System.Text;
    
    public partial class Initial_Manual : DbMigration
    {
        public override void Up()
        {
            // ResourcePool ResourcePoolRateAverage
            Sql(PrepareGetResourcePoolRateAverageFunction());
            Sql("ALTER TABLE dbo.ResourcePool DROP COLUMN ResourcePoolRateAverage;");
            Sql("ALTER TABLE dbo.ResourcePool ADD ResourcePoolRateAverage AS dbo.getResourcePoolRateAverage(Id);");

            // ResourcePool ResourcePoolRateCount
            Sql(PrepareGetResourcePoolRateCountFunction());
            Sql("ALTER TABLE dbo.ResourcePool DROP COLUMN ResourcePoolRateCount;");
            Sql("ALTER TABLE dbo.ResourcePool ADD ResourcePoolRateCount AS dbo.getResourcePoolRateCount(Id);");

            // ElementFieldIndex IndexRatingAverage
            Sql(PrepareGetElementFieldIndexRatingAverageFunction());
            Sql("ALTER TABLE dbo.ElementFieldIndex DROP COLUMN IndexRatingAverage;");
            Sql("ALTER TABLE dbo.ElementFieldIndex ADD IndexRatingAverage AS dbo.getElementFieldIndexRatingAverage(Id);");

            // ElementFieldIndex IndexRatingCount
            Sql(PrepareGetElementFieldIndexRatingCountFunction());
            Sql("ALTER TABLE dbo.ElementFieldIndex DROP COLUMN IndexRatingCount;");
            Sql("ALTER TABLE dbo.ElementFieldIndex ADD IndexRatingCount AS dbo.getElementFieldIndexRatingCount(Id);");

            // ElementCell RatingAverage
            Sql(PrepareGetElementCellRatingAverageFunction());
            Sql("ALTER TABLE dbo.ElementCell DROP COLUMN RatingAverage;");
            Sql("ALTER TABLE dbo.ElementCell ADD RatingAverage AS dbo.getElementCellRatingAverage(Id);");

            // ElementCell RatingCount
            Sql(PrepareGetElementCellRatingCountFunction());
            Sql("ALTER TABLE dbo.ElementCell DROP COLUMN RatingCount;");
            Sql("ALTER TABLE dbo.ElementCell ADD RatingCount AS dbo.getElementCellRatingCount(Id);");
        }

        public override void Down()
        {
            // ResourcePool ResourcePoolRateAverage
            Sql("ALTER TABLE dbo.ResourcePool DROP COLUMN ResourcePoolRateAverage;");
            Sql("ALTER TABLE dbo.ResourcePool ADD ResourcePoolRateAverage [decimal](18,2);");
            Sql("DROP FUNCTION dbo.getResourcePoolRateAverage;");

            // ResourcePool ResourcePoolRateCount
            Sql("ALTER TABLE dbo.ResourcePool DROP COLUMN ResourcePoolRateCount;");
            Sql("ALTER TABLE dbo.ResourcePool ADD ResourcePoolRateCount int;");
            //Sql("ALTER TABLE dbo.ResourcePool ADD ResourcePoolRateCount int CONSTRAINT [DF_ResourcePool_ResourcePoolRateCount] DEFAULT ((0));");
            Sql("DROP FUNCTION dbo.getResourcePoolRateCount;");

            // ElementFieldIndex IndexRatingAverage
            Sql("ALTER TABLE dbo.ElementFieldIndex DROP COLUMN IndexRatingAverage;");
            Sql("ALTER TABLE dbo.ElementFieldIndex ADD IndexRatingAverage [decimal](18,2);");
            Sql("DROP FUNCTION dbo.getElementFieldIndexRatingAverage;");

            // ElementFieldIndex IndexRatingCount
            Sql("ALTER TABLE dbo.ElementFieldIndex DROP COLUMN IndexRatingCount;");
            Sql("ALTER TABLE dbo.ElementFieldIndex ADD IndexRatingCount int;");
            //Sql("ALTER TABLE dbo.ElementFieldIndex ADD IndexRatingCount int CONSTRAINT [DF_ElementFieldIndex_IndexRatingCount] DEFAULT ((0));");
            Sql("DROP FUNCTION dbo.getElementFieldIndexRatingCount;");

            // ElementCell RatingAverage
            Sql("ALTER TABLE dbo.ElementCell DROP COLUMN RatingAverage;");
            Sql("ALTER TABLE dbo.ElementCell ADD RatingAverage [decimal](18,2);");
            Sql("DROP FUNCTION dbo.getElementCellRatingAverage;");

            // ElementCell RatingCount
            Sql("ALTER TABLE dbo.ElementCell DROP COLUMN RatingCount;");
            Sql("ALTER TABLE dbo.ElementCell ADD RatingCount int;");
            //Sql("ALTER TABLE dbo.ElementCell ADD RatingCount int CONSTRAINT [DF_ElementCell_RatingCount] DEFAULT ((0));");
            Sql("DROP FUNCTION dbo.getElementCellRatingCount;");
        }

        string PrepareGetResourcePoolRateAverageFunction()
        {
            var sbOutput = new StringBuilder();
            sbOutput.AppendLine("CREATE FUNCTION dbo.getResourcePoolRateAverage(@resourcePoolId int)");
            sbOutput.AppendLine("RETURNS decimal");
            sbOutput.AppendLine("AS");
            sbOutput.AppendLine("BEGIN");
            sbOutput.AppendLine("    DECLARE @result decimal");
            sbOutput.AppendLine("    SELECT @result = AVG(ResourcePoolRate) FROM UserResourcePool WHERE ResourcePoolId = @resourcePoolId AND DeletedOn IS NULL");
            sbOutput.AppendLine("    RETURN @result");
            sbOutput.AppendLine("END");
            return sbOutput.ToString();
        }

        string PrepareGetResourcePoolRateCountFunction()
        {
            var sbOutput = new StringBuilder();
            sbOutput.AppendLine("CREATE FUNCTION dbo.getResourcePoolRateCount(@resourcePoolId int)");
            sbOutput.AppendLine("RETURNS int");
            sbOutput.AppendLine("AS");
            sbOutput.AppendLine("BEGIN");
            sbOutput.AppendLine("    DECLARE @result int");
            sbOutput.AppendLine("    SELECT @result = COUNT(ResourcePoolRate) FROM UserResourcePool WHERE ResourcePoolId = @resourcePoolId AND DeletedOn IS NULL");
            sbOutput.AppendLine("    RETURN @result");
            sbOutput.AppendLine("END");
            return sbOutput.ToString();
        }

        string PrepareGetElementFieldIndexRatingAverageFunction()
        {
            var sbOutput = new StringBuilder();
            sbOutput.AppendLine("CREATE FUNCTION dbo.getElementFieldIndexRatingAverage(@elementFieldIndexId int)");
            sbOutput.AppendLine("RETURNS decimal");
            sbOutput.AppendLine("AS");
            sbOutput.AppendLine("BEGIN");
            sbOutput.AppendLine("    DECLARE @result decimal");
            sbOutput.AppendLine("    SELECT @result = AVG(Rating) FROM UserElementFieldIndex WHERE ElementFieldIndexId = @elementFieldIndexId AND DeletedOn IS NULL");
            sbOutput.AppendLine("    RETURN @result");
            sbOutput.AppendLine("END");
            return sbOutput.ToString();
        }

        string PrepareGetElementFieldIndexRatingCountFunction()
        {
            var sbOutput = new StringBuilder();
            sbOutput.AppendLine("CREATE FUNCTION dbo.getElementFieldIndexRatingCount(@elementFieldIndexId int)");
            sbOutput.AppendLine("RETURNS int");
            sbOutput.AppendLine("AS");
            sbOutput.AppendLine("BEGIN");
            sbOutput.AppendLine("    DECLARE @result int");
            sbOutput.AppendLine("    SELECT @result = COUNT(Rating) FROM UserElementFieldIndex WHERE ElementFieldIndexId = @elementFieldIndexId AND DeletedOn IS NULL");
            sbOutput.AppendLine("    RETURN @result");
            sbOutput.AppendLine("END");
            return sbOutput.ToString();
        }

        string PrepareGetElementCellRatingAverageFunction()
        {
            var sbOutput = new StringBuilder();
            sbOutput.AppendLine("CREATE FUNCTION dbo.getElementCellRatingAverage(@elementCellId int)");
            sbOutput.AppendLine("RETURNS decimal");
            sbOutput.AppendLine("AS");
            sbOutput.AppendLine("BEGIN");
            sbOutput.AppendLine("    DECLARE @result decimal");
            sbOutput.AppendLine("    SELECT @result = AVG(DecimalValue) FROM UserElementCell WHERE ElementCellId = @elementCellId AND NOT DecimalValue IS NULL AND DeletedOn IS NULL");
            sbOutput.AppendLine("    RETURN @result");
            sbOutput.AppendLine("END");
            return sbOutput.ToString();
        }

        string PrepareGetElementCellRatingCountFunction()
        {
            var sbOutput = new StringBuilder();
            sbOutput.AppendLine("CREATE FUNCTION dbo.getElementCellRatingCount(@elementCellId int)");
            sbOutput.AppendLine("RETURNS int");
            sbOutput.AppendLine("AS");
            sbOutput.AppendLine("BEGIN");
            sbOutput.AppendLine("    DECLARE @result int");
            sbOutput.AppendLine("    SELECT @result = COUNT(DecimalValue) FROM UserElementCell WHERE ElementCellId = @elementCellId AND NOT DecimalValue IS NULL AND DeletedOn IS NULL");
            sbOutput.AppendLine("    RETURN @result");
            sbOutput.AppendLine("END");
            return sbOutput.ToString();
        }
    }
}
