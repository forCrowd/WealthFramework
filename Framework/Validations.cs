using System;
using System.Collections.Generic;
using System.Linq;

namespace Framework
{
    public static class Validations
    {
        /// <summary>
        /// Argument null or default validation for all types, except nullables.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="arg"></param>
        /// <param name="paramName"></param>
        public static void ArgumentNullOrDefault<T>(T arg, string paramName)
        {
            if (arg.IsNullOrDefault())
            {
                throw new ArgumentNullOrDefaultException(paramName);
                //throw new ArgumentNullException(paramName);
            }
        }

        /// <summary>
        /// Argument null or default validation for nullables.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="arg"></param>
        /// <param name="paramName"></param>
        public static void ArgumentNullOrDefault<T>(T? arg, string paramName) where T : struct
        {
            if (arg.IsNullOrDefault())
            {
                throw new ArgumentNullOrDefaultException(paramName);
                //throw new ArgumentNullException(paramName);
            }
        }
    }
}
