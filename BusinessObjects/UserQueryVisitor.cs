using System.Linq;
using System.Data.Entity.Core.Common.CommandTrees;
using System.Data.Entity.Core.Common.CommandTrees.ExpressionBuilder;

namespace BusinessObjects
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
                var identity = System.Threading.Thread.CurrentPrincipal.Identity as System.Security.Claims.ClaimsIdentity;
                if (identity == null)
                {
                    throw new System.Security.SecurityException("Unauthenticated access");
                }
                var userIdclaim = identity.Claims.SingleOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier);
                if (userIdclaim == null)
                {
                    throw new System.Security.SecurityException("Unauthenticated access");
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