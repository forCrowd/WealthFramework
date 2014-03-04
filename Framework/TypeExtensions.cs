using System;

namespace Framework
{
    #region - String -

    public static class TypeExtensions
    {
        public static T ToEnum<T>(this string value)
        {
            return (T)Enum.Parse(typeof(T), value, true);
        }
    }

    #endregion
}
