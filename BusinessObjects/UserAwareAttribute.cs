using System;
using System.Data.Entity.Core.Metadata.Edm;
using System.Linq;

namespace BusinessObjects
{
    /// <summary>
    /// Attribute used to mark all entities which should be filtered based on userId
    /// </summary>
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = false)]
    public class UserAwareAttribute : Attribute
    {
        public const string UserAnnotation = "UserAnnotation";
        public const string UserIdFilterParameterName = "UserIdParameter";
        
        public string ColumnName { get; private set; }

        public UserAwareAttribute(string columnName)
        {
            if (string.IsNullOrEmpty(columnName))
            {
                throw new ArgumentNullException("columnName");
            }
            ColumnName = columnName;
        }

        public static string GetUserColumnName(EdmType type)
        {
            MetadataProperty annotation =
                type.MetadataProperties.SingleOrDefault(
                    p => p.Name.EndsWith(string.Format("customannotation:{0}", UserAnnotation)));

            return annotation == null ? null : (string)annotation.Value;
        }

    }
}