using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Data.Entity.Core.Common.CommandTrees;
using System.Data.Entity.Core.Common.CommandTrees.ExpressionBuilder;
using System.Data.Entity.Core.Metadata.Edm;
using System.Data.Entity.Infrastructure.Interception;
using System.Linq;
using System.Security.Claims;
using System.Threading;

namespace BusinessObjects
{
    /// <summary>
    /// Custom implementation of <see cref="IDbCommandTreeInterceptor"/> which filters based on userId.
    /// </summary>
    public class UserCommandTreeInterceptor : IDbCommandTreeInterceptor
    {
        public void TreeCreated(DbCommandTreeInterceptionContext interceptionContext)
        {
            if (interceptionContext.OriginalResult.DataSpace == DataSpace.SSpace)
            {
                // Check that there is an authenticated user in this context
                var identity = Thread.CurrentPrincipal.Identity as ClaimsIdentity;
                if (identity == null)
                {
                    return;
                }
                var userIdclaim = identity.Claims.SingleOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
                if (userIdclaim == null)
                {
                    return;
                }

                if (InterceptQueryCommand(interceptionContext))
                {
                    return;
                }

                var userId = 0;
                int.TryParse(userIdclaim.Value, out userId);
                if (InterceptInsertCommand(interceptionContext, userId))
                {
                    return;
                }

                if (InterceptUpdate(interceptionContext, userId))
                {
                    return;
                }

                InterceptDeleteCommand(interceptionContext, userId);
            }
        }


        /// <summary>
        /// In case of query command change the query by adding a filtering based on userId 
        /// </summary>
        static bool InterceptQueryCommand(DbCommandTreeInterceptionContext interceptionContext)
        {
            var queryCommand = interceptionContext.Result as DbQueryCommandTree;
            if (queryCommand != null)
            {
                var newQuery = queryCommand.Query.Accept(new UserQueryVisitor());
                interceptionContext.Result = new DbQueryCommandTree(
                    queryCommand.MetadataWorkspace,
                    queryCommand.DataSpace,
                    newQuery);
                return true;
            }

            return false;
        }

        /// <summary>
        /// In case of an insert command we always assign the correct value to the userId
        /// </summary>
        static bool InterceptInsertCommand(DbCommandTreeInterceptionContext interceptionContext, int userId)
        {
            var insertCommand = interceptionContext.Result as DbInsertCommandTree;
            if (insertCommand != null)
            {
                var column = UserAwareAttribute.GetUserColumnName(insertCommand.Target.VariableType.EdmType);
                if (!string.IsNullOrEmpty(column))
                {
                    // Create the variable reference in order to create the property
                    var variableReference = DbExpressionBuilder.Variable(insertCommand.Target.VariableType,
                        insertCommand.Target.VariableName);
                    // Create the property to which will assign the correct value
                    var userProperty = DbExpressionBuilder.Property(variableReference, column);
                    // Create the set clause, object representation of sql insert command
                    var userSetClause =
                        DbExpressionBuilder.SetClause(userProperty, DbExpression.FromInt32(userId));

                    // Remove potential assignment of userId for extra safety 
                    var filteredSetClauses =
                        insertCommand.SetClauses.Cast<DbSetClause>()
                            .Where(sc => ((DbPropertyExpression)sc.Property).Property.Name != column);

                    // Construct the final clauses, object representation of sql insert command values
                    var finalSetClauses =
                        new ReadOnlyCollection<DbModificationClause>(new List<DbModificationClause>(filteredSetClauses)
                        {
                            userSetClause
                        });

                    // Construct the new command
                    var newInsertCommand = new DbInsertCommandTree(
                        insertCommand.MetadataWorkspace,
                        insertCommand.DataSpace,
                        insertCommand.Target,
                        finalSetClauses,
                        insertCommand.Returning);

                    interceptionContext.Result = newInsertCommand;
                    // True means an interception successfully happened so there is no need to continue
                    return true;
                }
            }
            return false;
        }

        /// <summary>
        /// In case of an update command we always filter based on the userId
        /// </summary>
        static bool InterceptUpdate(DbCommandTreeInterceptionContext interceptionContext, int userId)
        {
            var updateCommand = interceptionContext.Result as DbUpdateCommandTree;
            if (updateCommand != null)
            {
                var column = UserAwareAttribute.GetUserColumnName(updateCommand.Target.VariableType.EdmType);
                if (!string.IsNullOrEmpty(column))
                {
                    // Create the variable reference in order to create the property
                    var variableReference = DbExpressionBuilder.Variable(updateCommand.Target.VariableType,
                        updateCommand.Target.VariableName);
                    // Create the property to which will assign the correct value
                    var userProperty = DbExpressionBuilder.Property(variableReference, column);
                    // Create the userId where predicate, object representation of sql where userId = value statement
                    var userIdWherePredicate = DbExpressionBuilder.Equal(userProperty, DbExpression.FromInt32(userId));

                    // Remove potential assignment of userId for extra safety
                    var filteredSetClauses =
                        updateCommand.SetClauses.Cast<DbSetClause>()
                            .Where(sc => ((DbPropertyExpression)sc.Property).Property.Name != column);

                    // Construct the final clauses, object representation of sql insert command values
                    var finalSetClauses =
                        new ReadOnlyCollection<DbModificationClause>(new List<DbModificationClause>(filteredSetClauses));

                    // The initial predicate is the sql where statement
                    var initialPredicate = updateCommand.Predicate;
                    // Add to the initial statement the userId statement which translates in sql AND UserId = 'value'
                    var finalPredicate = initialPredicate.And(userIdWherePredicate);

                    var newUpdateCommand = new DbUpdateCommandTree(
                        updateCommand.MetadataWorkspace,
                        updateCommand.DataSpace,
                        updateCommand.Target,
                        finalPredicate,
                        finalSetClauses,
                        updateCommand.Returning);

                    interceptionContext.Result = newUpdateCommand;
                    // True means an interception successfully happened so there is no need to continue
                    return true;
                }
            }
            return false;
        }

        /// <summary>
        /// In case of a delete command we always filter based on the userId
        /// </summary>
        static void InterceptDeleteCommand(DbCommandTreeInterceptionContext interceptionContext, int userId)
        {
            var deleteCommand = interceptionContext.Result as DbDeleteCommandTree;
            if (deleteCommand != null)
            {
                var column = UserAwareAttribute.GetUserColumnName(deleteCommand.Target.VariableType.EdmType);
                if (!string.IsNullOrEmpty(column))
                {
                    // Create the variable reference in order to create the property
                    var variableReference = DbExpressionBuilder.Variable(deleteCommand.Target.VariableType,
                        deleteCommand.Target.VariableName);
                    // Create the property to which will assign the correct value
                    var userProperty = DbExpressionBuilder.Property(variableReference, column);
                    var userIdWherePredicate = DbExpressionBuilder.Equal(userProperty, DbExpression.FromInt32(userId));

                    // The initial predicate is the sql where statement
                    var initialPredicate = deleteCommand.Predicate;
                    // Add to the initial statement the userId statement which translates in sql AND userId = 'value'
                    var finalPredicate = initialPredicate.And(userIdWherePredicate);

                    var newDeleteCommand = new DbDeleteCommandTree(
                        deleteCommand.MetadataWorkspace,
                        deleteCommand.DataSpace,
                        deleteCommand.Target,
                        finalPredicate);

                    interceptionContext.Result = newDeleteCommand;
                }
            }
        }

    }
}