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

            // ElementCell StringValue
            Sql(PrepareDropFunctionBlock("ElementCell", "StringValue", "getElementCellStringValue"));
            Sql(PrepareGetElementCellStringValueFunctionBlock());
            Sql("ALTER TABLE dbo.ElementCell DROP COLUMN StringValue;");
            Sql("ALTER TABLE dbo.ElementCell ADD StringValue AS dbo.getElementCellStringValue(Id);");

            // ElementCell NumericValue
            Sql(PrepareDropFunctionBlock("ElementCell", "NumericValue", "getElementCellNumericValue"));
            Sql(PrepareGetElementCellNumericValueFunctionBlock());
            Sql("ALTER TABLE dbo.ElementCell DROP COLUMN NumericValue;");
            Sql("ALTER TABLE dbo.ElementCell ADD NumericValue AS dbo.getElementCellNumericValue(Id);");

            // ElementCell NumericValueCount
            Sql(PrepareDropFunctionBlock("ElementCell", "NumericValueCount", "getElementCellNumericValueCount"));
            Sql(PrepareGetElementCellNumericValueCountFunctionBlock());
            Sql("ALTER TABLE dbo.ElementCell DROP COLUMN NumericValueCount;");
            Sql("ALTER TABLE dbo.ElementCell ADD NumericValueCount AS dbo.getElementCellNumericValueCount(Id);");
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

            // ElementCell StringValue
            Sql("ALTER TABLE dbo.ElementCell DROP COLUMN StringValue;");
            Sql("ALTER TABLE dbo.ElementCell ADD StringValue [nvarchar](MAX);");
            Sql("DROP FUNCTION dbo.getElementCellStringValue;");

            // ElementCell NumericValue
            Sql("ALTER TABLE dbo.ElementCell DROP COLUMN NumericValue;");
            Sql("ALTER TABLE dbo.ElementCell ADD NumericValue [decimal](18,2);");
            Sql("DROP FUNCTION dbo.getElementCellNumericValue;");

            // ElementCell NumericValueCount
            Sql("ALTER TABLE dbo.ElementCell DROP COLUMN NumericValueCount;");
            Sql("ALTER TABLE dbo.ElementCell ADD NumericValueCount int;");
            Sql("DROP FUNCTION dbo.getElementCellNumericValueCount;");
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

        string PrepareGetElementFieldRatingAverageFunctionBlock()
        {
            var sbOutput = new StringBuilder();
            sbOutput.AppendLine("CREATE FUNCTION dbo.getElementFieldRatingAverage(@elementFieldId int)");
            sbOutput.AppendLine("RETURNS decimal");
            sbOutput.AppendLine("AS");
            sbOutput.AppendLine("BEGIN");
            sbOutput.AppendLine("    DECLARE @result decimal");
            sbOutput.AppendLine("    SELECT @result = AVG(Rating) FROM UserElementField WHERE ElementFieldId = @elementFieldId AND DeletedOn IS NULL");
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

        string PrepareGetElementFieldRatingCountFunctionBlock()
        {
            var sbOutput = new StringBuilder();
            sbOutput.AppendLine("CREATE FUNCTION dbo.getElementFieldRatingCount(@elementFieldId int)");
            sbOutput.AppendLine("RETURNS int");
            sbOutput.AppendLine("AS");
            sbOutput.AppendLine("BEGIN");
            sbOutput.AppendLine("    DECLARE @result int");
            sbOutput.AppendLine("    SELECT @result = COUNT(Rating) FROM UserElementField WHERE ElementFieldId = @elementFieldId AND DeletedOn IS NULL");
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

        string PrepareGetElementCellStringValueFunctionBlock()
        {
            var sbOutput = new StringBuilder();
            sbOutput.AppendLine("CREATE FUNCTION dbo.getElementCellStringValue(@elementCellId int)");
            sbOutput.AppendLine("RETURNS nvarchar(MAX)");
            sbOutput.AppendLine("AS");
            sbOutput.AppendLine("BEGIN");
            sbOutput.AppendLine("    DECLARE @result nvarchar(MAX)");
            sbOutput.AppendLine("    SELECT @result = StringValue FROM UserElementCell WHERE ElementCellId = @elementCellId AND NOT StringValue IS NULL AND DeletedOn IS NULL");
            sbOutput.AppendLine("    RETURN @result");
            sbOutput.AppendLine("END");
            return sbOutput.ToString();
        }

        string PrepareGetElementCellNumericValueFunctionBlock()
        {
            var sbOutput = new StringBuilder();
            sbOutput.AppendLine("CREATE FUNCTION dbo.getElementCellNumericValue(@elementCellId int)");
            sbOutput.AppendLine("RETURNS decimal");
            sbOutput.AppendLine("AS");
            sbOutput.AppendLine("BEGIN");
            sbOutput.AppendLine("    DECLARE @result decimal");
            sbOutput.AppendLine("    SELECT @result = ");
            sbOutput.AppendLine("        CASE T3.ElementFieldType");
            sbOutput.AppendLine("            WHEN 1 THEN NULL -- String");
            sbOutput.AppendLine("            WHEN 2 THEN AVG(CAST(T1.BooleanValue AS decimal)) -- Boolean");
            sbOutput.AppendLine("            WHEN 3 THEN AVG(CAST(T1.IntegerValue AS decimal)) -- Integer");
            sbOutput.AppendLine("            WHEN 4 THEN AVG(T1.DecimalValue) -- Decimal");
            sbOutput.AppendLine("            WHEN 5 THEN AVG(CAST(T1.DateTimeValue AS decimal)) -- DateTime");
            sbOutput.AppendLine("            WHEN 6 THEN NULL -- Element");
            sbOutput.AppendLine("            WHEN 11 THEN AVG(T1.DecimalValue) -- DirectIncome");
            sbOutput.AppendLine("            WHEN 12 THEN NULL -- Multiplier");
            sbOutput.AppendLine("        END");
            sbOutput.AppendLine("        FROM UserElementCell T1");
            sbOutput.AppendLine("        JOIN ElementCell T2 ON T1.ElementCellId = T2.Id");
            sbOutput.AppendLine("        JOIN ElementField T3 ON T2.ElementFieldId = T3.Id");
            sbOutput.AppendLine("        WHERE T1.ElementCellId = @elementCellId AND T1.DeletedOn IS NULL");
            sbOutput.AppendLine("        GROUP By T3.ElementFieldType");
            sbOutput.AppendLine("    RETURN @result");
            sbOutput.AppendLine("END");
            return sbOutput.ToString();
        }

        string PrepareGetElementCellNumericValueCountFunctionBlock()
        {
            var sbOutput = new StringBuilder();
            sbOutput.AppendLine("CREATE FUNCTION dbo.getElementCellNumericValueCount(@elementCellId int)");
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
