using System.Linq;
using System.Data.Entity.Core.Common.CommandTrees;
using System.Data.Entity.Core.Common.CommandTrees.ExpressionBuilder;
using System.Threading;
using System.Security;
using System.Security.Claims;

namespace forCrowd.WealthEconomy.BusinessObjects
{
    /// <summary>
    /// Visitor pattern implementation class that adds filtering for userId column if applicable
    /// </summary>
    public class UserQueryVisitor : DefaultExpressionVisitor
    {
        public override DbExpression Visit(DbScanExpression expression)
        {
            expression = (DbScanExpression)base.Visit(expression);

            var column = UserAwareAttribute.GetUserColumnName(expression.Target.ElementType);
            if (!string.IsNullOrEmpty(column))
            {
                // Check that there is an authenticated user in this context
                var principal = Thread.CurrentPrincipal;

                var identity = principal.Identity as ClaimsIdentity;
                if (identity == null)
                {
                    throw new SecurityException("Unauthenticated access");
                }

                var userIdclaim = identity.Claims.SingleOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
                if (userIdclaim == null)
                {
                    throw new SecurityException("Unauthenticated access");
                }

                // If it's admin, then no need to filter
                if (principal.IsInRole("Administrator"))
                {
                    return expression;
                }

                // Get the current expression binding 
                var currentExpressionBinding = DbExpressionBuilder.Bind(expression);
                var newFilterExpression = BuildFilterExpression(currentExpressionBinding, column);
                if (newFilterExpression != null)
                {
                    //  If not null, a new DbFilterExpression has been created with our dynamic filters.
                    return newFilterExpression;
                }
            }

            return expression;
        }

        /// <summary>
        /// Helper method creating the correct filter expression based on the supplied parameters
        /// </summary>
        private DbFilterExpression BuildFilterExpression(DbExpressionBinding binding, string column)
        {
            var variableReference = DbExpressionBuilder.Variable(binding.VariableType, binding.VariableName);
            // Create the property based on the variable in order to apply the equality
            var userProperty = DbExpressionBuilder.Property(variableReference, column);
            // Create the parameter which is an object representation of a sql parameter.
            // We have to create a parameter and not perform a direct comparison with Equal function for example
            // as this logic is cached per query and called only once
            var userParameter = DbExpressionBuilder.Parameter(userProperty.Property.TypeUsage,
                UserAwareAttribute.UserIdFilterParameterName);
            // Apply the equality between property and parameter.
            DbExpression newPredicate = DbExpressionBuilder.Equal(userProperty, userParameter);

            return DbExpressionBuilder.Filter(binding, newPredicate);
        }
    }
}