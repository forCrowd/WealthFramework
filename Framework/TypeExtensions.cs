using System;
using System.Collections.Generic;
using System.Linq;

namespace forCrowd.WealthEconomy.Framework
{
    public static class TypeExtensions
    {
        #region - String -

        public static T ToEnum<T>(this string value)
        {
            return (T)Enum.Parse(typeof(T), value, true);
        }

        #endregion

        #region - Generic -

        /// <summary>
        /// Is Null or Default check for all types, except Nullables. For string type it also makes empty & whitespace check.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="self"></param>
        /// <returns></returns>
        public static bool IsNullOrDefault<T>(this T self)
        {
            if (self is string)
                return string.IsNullOrWhiteSpace(self.ToString());
            else
                return object.Equals(self, default(T));
        }

        /// <summary>
        /// Is Null or Default check for nullable types.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="self"></param>
        /// <returns></returns>
        public static bool IsNullOrDefault<T>(this T? self) where T : struct
        {
            return self.GetValueOrDefault().Equals(default(T));
        }

        #endregion
    }
}
