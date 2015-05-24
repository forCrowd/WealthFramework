namespace DataObjects.Migrations
{
    using System.Data.Entity.Migrations;
    using System.Text;

    public partial class Initial_Manual : DbMigration
    {
        public override void Up()
        {
            // ResourcePool ResourcePoolRateAverage
            Sql(PrepareDropFunctionBlock("ResourcePool", "ResourcePoolRateAverage", "getResourcePoolRateAverage"));
            Sql(PrepareGetResourcePoolRateAverageFunctionBlock());
            Sql("ALTER TABLE dbo.ResourcePool DROP COLUMN ResourcePoolRateAverage;");
            Sql("ALTER TABLE dbo.ResourcePool ADD ResourcePoolRateAverage AS dbo.getResourcePoolRateAverage(Id);");

            // ResourcePool ResourcePoolRateCount
            Sql(PrepareDropFunctionBlock("ResourcePool", "ResourcePoolRateCount", "getResourcePoolRateCount"));
            Sql(PrepareGetResourcePoolRateCountFunctionBlock());
            Sql("ALTER TABLE dbo.ResourcePool DROP COLUMN ResourcePoolRateCount;");
            Sql("ALTER TABLE dbo.ResourcePool ADD ResourcePoolRateCount AS dbo.getResourcePoolRateCount(Id);");

            // ElementFieldIndex IndexRatingAverage
            Sql(PrepareDropFunctionBlock("ElementFieldIndex", "IndexRatingAverage", "getElementFieldIndexRatingAverage"));
            Sql(PrepareGetElementFieldIndexRatingAverageFunctionBlock());
            Sql("ALTER TABLE dbo.ElementFieldIndex DROP COLUMN IndexRatingAverage;");
            Sql("ALTER TABLE dbo.ElementFieldIndex ADD IndexRatingAverage AS dbo.getElementFieldIndexRatingAverage(Id);");

            // ElementFieldIndex IndexRatingCount
            Sql(PrepareDropFunctionBlock("ElementFieldIndex", "IndexRatingCount", "getElementFieldIndexRatingCount"));
            Sql(PrepareGetElementFieldIndexRatingCountFunctionBlock());
            Sql("ALTER TABLE dbo.ElementFieldIndex DROP COLUMN IndexRatingCount;");
            Sql("ALTER TABLE dbo.ElementFieldIndex ADD IndexRatingCount AS dbo.getElementFieldIndexRatingCount(Id);");

            // ElementCell RatingAverage
            Sql(PrepareDropFunctionBlock("ElementCell", "RatingAverage", "getElementCellRatingAverage"));
            Sql(PrepareGetElementCellRatingAverageFunctionBlock());
            Sql("ALTER TABLE dbo.ElementCell DROP COLUMN RatingAverage;");
            Sql("ALTER TABLE dbo.ElementCell ADD RatingAverage AS dbo.getElementCellRatingAverage(Id);");

            // ElementCell RatingCount
            Sql(PrepareDropFunctionBlock("ElementCell", "RatingCount", "getElementCellRatingCount"));
            Sql(PrepareGetElementCellRatingCountFunctionBlock());
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
            Sql("DROP FUNCTION dbo.getResourcePoolRateCount;");

            // ElementFieldIndex IndexRatingAverage
            Sql("ALTER TABLE dbo.ElementFieldIndex DROP COLUMN IndexRatingAverage;");
            Sql("ALTER TABLE dbo.ElementFieldIndex ADD IndexRatingAverage [decimal](18,2);");
            Sql("DROP FUNCTION dbo.getElementFieldIndexRatingAverage;");

            // ElementFieldIndex IndexRatingCount
            Sql("ALTER TABLE dbo.ElementFieldIndex DROP COLUMN IndexRatingCount;");
            Sql("ALTER TABLE dbo.ElementFieldIndex ADD IndexRatingCount int;");
            Sql("DROP FUNCTION dbo.getElementFieldIndexRatingCount;");

            // ElementCell RatingAverage
            Sql("ALTER TABLE dbo.ElementCell DROP COLUMN RatingAverage;");
            Sql("ALTER TABLE dbo.ElementCell ADD RatingAverage [decimal](18,2);");
            Sql("DROP FUNCTION dbo.getElementCellRatingAverage;");

            // ElementCell RatingCount
            Sql("ALTER TABLE dbo.ElementCell DROP COLUMN RatingCount;");
            Sql("ALTER TABLE dbo.ElementCell ADD RatingCount int;");
            Sql("DROP FUNCTION dbo.getElementCellRatingCount;");
        }

        string PrepareGetResourcePoolRateAverageFunctionBlock()
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

        string PrepareGetResourcePoolRateCountFunctionBlock()
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

        string PrepareGetElementFieldIndexRatingAverageFunctionBlock()
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

        string PrepareGetElementFieldIndexRatingCountFunctionBlock()
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

        string PrepareGetElementCellRatingAverageFunctionBlock()
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

        string PrepareGetElementCellRatingCountFunctionBlock()
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

        string PrepareDropFunctionBlock(string tableName, string columnName, string functionName)
        {
            var sbOutput = new StringBuilder();
            sbOutput.AppendFormat("IF object_id(N'{0}', N'FN') IS NOT NULL", functionName).AppendLine();
            sbOutput.AppendLine("BEGIN");
            sbOutput.AppendFormat("    IF COLUMNPROPERTY(object_id('{0}'), '{1}', 'IsComputed') = 1", tableName, columnName).AppendLine();
            sbOutput.AppendLine("    BEGIN");
            sbOutput.AppendFormat("        ALTER TABLE dbo.{0} DROP COLUMN {1};", tableName, columnName).AppendLine();
            sbOutput.AppendFormat("        ALTER TABLE dbo.{0} ADD {1} [decimal](18,2);", tableName, columnName).AppendLine();
            sbOutput.AppendLine("    END");
            sbOutput.AppendFormat("    DROP FUNCTION {0}", functionName).AppendLine();
            sbOutput.AppendLine("END");
            return sbOutput.ToString();
        }
    }
}
