/*
 * This file has been copied from the following example;
 * http://aspnet.codeplex.com/SourceControl/changeset/view/9cb7243bd9fe3b2df484bf2409af943f39533588#Samples/WebApi/ODataCompositeKeySample/ReadMe.txt
 * */
namespace forCrowd.WealthEconomy.WebApi.Conventions
{
    using System.Linq;
    using System.Web.Http.Controllers;
    using System.Web.Http.OData.Routing;
    using System.Web.Http.OData.Routing.Conventions;

    // This is a sample implementation of routing convention to support composit keys.
    // The implementation will fail if key value has ',' in it. Please implement your own 
    // convention to handle it.
    public class CompositeKeyRoutingConvention : EntityRoutingConvention
    {
        public override string SelectAction(ODataPath odataPath, HttpControllerContext controllerContext, ILookup<string, HttpActionDescriptor> actionMap)
        {
            var action = base.SelectAction(odataPath, controllerContext, actionMap);
            if (action != null)
            {
                var routeValues = controllerContext.RouteData.Values;
                if (routeValues.ContainsKey(ODataRouteConstants.Key))
                {
                    if (routeValues[ODataRouteConstants.Key] is string keyRaw)
                    {
                        var compoundKeyPairs = keyRaw.Split(',');
                        if (!compoundKeyPairs.Any())
                        {
                            return action;
                        }

                        foreach (var compoundKeyPair in compoundKeyPairs)
                        {
                            var pair = compoundKeyPair.Split('=');
                            if (pair.Length != 2)
                            {
                                continue;
                            }
                            var keyName = pair[0].Trim();
                            var keyValue = pair[1].Trim();

                            routeValues.Add(keyName, keyValue);
                        }
                    }
                }
            }

            return action;
        }
    }
}