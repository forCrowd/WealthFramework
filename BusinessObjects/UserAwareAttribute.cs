using System;
using System.Data.Entity.Core.Metadata.Edm;
using System.Linq;

namespace forCrowd.WealthEconomy.BusinessObjects
{
    /// <summary>
    /// Attribute used to mark all entities which should be filtered based on userId
    /// </summary>
    [AttributeUsage(AttributeTargets.Class)]
    public class UserAwareAttribute : Attribute
    {
        public const string UserAnnotation = "UserAnnotation";
        public const string UserIdFilterParameterName = "UserIdParameter";
        
        public string ColumnName { get; private set; }

        public UserAwareAttribute(string columnName)
        {
            if (string.IsNullOrEmpty(columnName))
            {
                throw new ArgumentNullException(nameof(columnName));
            }
            ColumnName = columnName;
        }

        public static string GetUserColumnName(EdmType type)
        {
            var annotation =
                type.MetadataProperties.SingleOrDefault(
                    p => p.Name.EndsWith($"customannotation:{UserAnnotation}"));

            return (string) annotation?.Value;
        }
    }
}
