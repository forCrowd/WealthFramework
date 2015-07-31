namespace forCrowd.WealthEconomy.DataObjects.Migrations
{
    using System.Data.Entity.Migrations;
    using System.Text;

    public partial class Initial_Manual : DbMigration
    {
        public override void Up()
        {
            // ResourcePool ResourcePoolRateTotal
            Sql(PrepareDropFunctionBlock("ResourcePool", "ResourcePoolRateTotal", "getResourcePoolRateTotal"));
            Sql(PrepareGetResourcePoolRateTotalFunctionBlock());
            Sql("ALTER TABLE dbo.ResourcePool DROP COLUMN ResourcePoolRateTotal;");
            Sql("ALTER TABLE dbo.ResourcePool ADD ResourcePoolRateTotal AS dbo.getResourcePoolRateTotal(Id);");

            // ResourcePool ResourcePoolRateCount
            Sql(PrepareDropFunctionBlock("ResourcePool", "ResourcePoolRateCount", "getResourcePoolRateCount"));
            Sql(PrepareGetResourcePoolRateCountFunctionBlock());
            Sql("ALTER TABLE dbo.ResourcePool DROP COLUMN ResourcePoolRateCount;");
            Sql("ALTER TABLE dbo.ResourcePool ADD ResourcePoolRateCount AS dbo.getResourcePoolRateCount(Id);");

            // ResourcePool RatingCount
            Sql(PrepareDropFunctionBlock("ResourcePool", "RatingCount", "getResourcePoolRatingCount"));
            Sql(PrepareGetResourcePoolRatingCountFunctionBlock());
            Sql("ALTER TABLE dbo.ResourcePool DROP COLUMN RatingCount;");
            Sql("ALTER TABLE dbo.ResourcePool ADD RatingCount AS dbo.getResourcePoolRatingCount(Id);");

            // ElementField IndexRating
            Sql(PrepareDropFunctionBlock("ElementField", "IndexRating", "getElementFieldIndexRating"));
            Sql(PrepareGetElementFieldIndexRatingFunctionBlock());
            Sql("ALTER TABLE dbo.ElementField DROP COLUMN IndexRating;");
            Sql("ALTER TABLE dbo.ElementField ADD IndexRating AS dbo.getElementFieldIndexRating(Id);");

            // ElementField IndexRatingCount
            Sql(PrepareDropFunctionBlock("ElementField", "IndexRatingCount", "getElementFieldIndexRatingCount"));
            Sql(PrepareGetElementFieldIndexRatingCountFunctionBlock());
            Sql("ALTER TABLE dbo.ElementField DROP COLUMN IndexRatingCount;");
            Sql("ALTER TABLE dbo.ElementField ADD IndexRatingCount AS dbo.getElementFieldIndexRatingCount(Id);");

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
            // ResourcePool ResourcePoolRateTotal
            Sql("ALTER TABLE dbo.ResourcePool DROP COLUMN ResourcePoolRateTotal;");
            Sql("ALTER TABLE dbo.ResourcePool ADD ResourcePoolRateTotal [decimal](18,2);");
            Sql("DROP FUNCTION dbo.getResourcePoolRateTotal;");

            // ResourcePool ResourcePoolRateCount
            Sql("ALTER TABLE dbo.ResourcePool DROP COLUMN ResourcePoolRateCount;");
            Sql("ALTER TABLE dbo.ResourcePool ADD ResourcePoolRateCount int;");
            Sql("DROP FUNCTION dbo.getResourcePoolRateCount;");

            // ResourcePool RatingCount
            Sql("ALTER TABLE dbo.ResourcePool DROP COLUMN RatingCount;");
            Sql("ALTER TABLE dbo.ResourcePool ADD RatingCount int;");
            Sql("DROP FUNCTION dbo.getResourcePoolRatingCount;");

            // ElementField IndexRating
            Sql("ALTER TABLE dbo.ElementField DROP COLUMN IndexRating;");
            Sql("ALTER TABLE dbo.ElementField ADD IndexRating [decimal](18,2);");
            Sql("DROP FUNCTION dbo.getElementFieldIndexRating;");

            // ElementField IndexRatingCount
            Sql("ALTER TABLE dbo.ElementField DROP COLUMN IndexRatingCount;");
            Sql("ALTER TABLE dbo.ElementField ADD IndexRatingCount int;");
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

        string PrepareGetResourcePoolRateTotalFunctionBlock()
        {
            var sbOutput = new StringBuilder();
            sbOutput.AppendLine("CREATE FUNCTION dbo.getResourcePoolRateTotal(@resourcePoolId int)");
            sbOutput.AppendLine("RETURNS decimal");
            sbOutput.AppendLine("AS");
            sbOutput.AppendLine("BEGIN");
            sbOutput.AppendLine("    DECLARE @result decimal");
            sbOutput.AppendLine("    SELECT @result = ISNULL(SUM(ResourcePoolRate), 0) FROM UserResourcePool WHERE ResourcePoolId = @resourcePoolId AND DeletedOn IS NULL");
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

        string PrepareGetResourcePoolRatingCountFunctionBlock()
        {
            var sbOutput = new StringBuilder();
            sbOutput.AppendLine("CREATE FUNCTION dbo.getResourcePoolRatingCount(@resourcePoolId int)");
            sbOutput.AppendLine("RETURNS int");
            sbOutput.AppendLine("AS");
            sbOutput.AppendLine("BEGIN");
            sbOutput.AppendLine("    DECLARE @result int");
            sbOutput.AppendLine("    SELECT @result = COUNT(Id) FROM [User] WHERE DeletedOn IS NULL AND Id IN (");
            sbOutput.AppendLine("    SELECT T1.UserId");
            sbOutput.AppendLine("    	FROM UserElementCell T1");
            sbOutput.AppendLine("    	JOIN ElementCell T2 ON T1.ElementCellId = T2.Id");
            sbOutput.AppendLine("    	JOIN ElementField T3 ON T2.ElementFieldId = T3.Id");
            sbOutput.AppendLine("    	JOIN Element T4 ON T3.ElementId = T4.Id");
            sbOutput.AppendLine("    	WHERE T4.ResourcePoolId = @ResourcePoolId");
            sbOutput.AppendLine("    		AND T3.UseFixedValue = 0");
            sbOutput.AppendLine("    		AND T1.DeletedOn IS NULL");
            sbOutput.AppendLine("    UNION ALL");
            sbOutput.AppendLine("    SELECT T1.UserId");
            sbOutput.AppendLine("    	FROM UserElementField T1");
            sbOutput.AppendLine("    	JOIN ElementField T2 ON T1.ElementFieldId = T2.Id");
            sbOutput.AppendLine("    	JOIN Element T3 ON T2.ElementId = T3.Id");
            sbOutput.AppendLine("    	WHERE T3.ResourcePoolId = @ResourcePoolId");
            sbOutput.AppendLine("    		AND T1.DeletedOn IS NULL");
            sbOutput.AppendLine("    UNION ALL");
            sbOutput.AppendLine("    SELECT T1.UserId");
            sbOutput.AppendLine("    	FROM UserResourcePool T1");
            sbOutput.AppendLine("    	JOIN ResourcePool T2 ON T1.ResourcePoolId = T2.Id");
            sbOutput.AppendLine("    	WHERE T1.ResourcePoolId = @ResourcePoolId");
            sbOutput.AppendLine("    		AND T2.UseFixedResourcePoolRate = 0");
            sbOutput.AppendLine("    		AND T1.DeletedOn IS NULL");
            sbOutput.AppendLine("    )");
            sbOutput.AppendLine("    RETURN @result");
            sbOutput.AppendLine("END");
            return sbOutput.ToString();
        }

        string PrepareGetElementFieldIndexRatingFunctionBlock()
        {
            var sbOutput = new StringBuilder();
            sbOutput.AppendLine("CREATE FUNCTION dbo.getElementFieldIndexRating(@elementFieldId int)");
            sbOutput.AppendLine("RETURNS decimal");
            sbOutput.AppendLine("AS");
            sbOutput.AppendLine("BEGIN");
            sbOutput.AppendLine("    DECLARE @result decimal");
            sbOutput.AppendLine("    SELECT @result = ISNULL(SUM(Rating), 0) FROM UserElementField WHERE ElementFieldId = @elementFieldId AND DeletedOn IS NULL");
            sbOutput.AppendLine("    RETURN @result");
            sbOutput.AppendLine("END");
            return sbOutput.ToString();
        }

        string PrepareGetElementFieldIndexRatingCountFunctionBlock()
        {
            var sbOutput = new StringBuilder();
            sbOutput.AppendLine("CREATE FUNCTION dbo.getElementFieldIndexRatingCount(@elementFieldId int)");
            sbOutput.AppendLine("RETURNS int");
            sbOutput.AppendLine("AS");
            sbOutput.AppendLine("BEGIN");
            sbOutput.AppendLine("    DECLARE @result int");
            sbOutput.AppendLine("    SELECT @result = COUNT(Rating) FROM UserElementField WHERE ElementFieldId = @elementFieldId AND DeletedOn IS NULL");
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
            sbOutput.AppendLine("            WHEN 2 THEN ISNULL(SUM(CAST(T1.BooleanValue AS decimal)), 0) -- Boolean");
            sbOutput.AppendLine("            WHEN 3 THEN ISNULL(SUM(CAST(T1.IntegerValue AS decimal)), 0) -- Integer");
            sbOutput.AppendLine("            WHEN 4 THEN ISNULL(SUM(T1.DecimalValue), 0) -- Decimal");
            sbOutput.AppendLine("            WHEN 5 THEN ISNULL(SUM(CAST(T1.DateTimeValue AS decimal)), 0) -- DateTime");
            sbOutput.AppendLine("            WHEN 6 THEN NULL -- Element");
            sbOutput.AppendLine("            WHEN 11 THEN ISNULL(SUM(T1.DecimalValue), 0) -- DirectIncome");
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
