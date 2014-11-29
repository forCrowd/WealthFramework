using System;
using System.Collections.Generic;
using System.Linq;

namespace Framework
{
    public static class Validation
    {
        public static void ArgumentNullOrDefault<T>(T arg, string paramName)
        {
            if (arg.IsNullOrDefault())
            {
                throw new ArgumentNullOrDefaultException(paramName);
            }
        }

        public static void ArgumentNullOrDefault<T>(T? arg, string paramName) where T : struct
        {
            if (arg.IsNullOrDefault())
            {
                throw new ArgumentNullOrDefaultException(paramName);
            }
        }
    }
}
