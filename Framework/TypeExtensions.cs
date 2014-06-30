using System;
using System.Collections.Generic;
using System.Linq;

namespace Framework
{
    public static class TypeExtensions
    {
        #region - String -
        public static T ToEnum<T>(this string value)
        {
            return (T)Enum.Parse(typeof(T), value, true);
        }
        #endregion
    }
}
