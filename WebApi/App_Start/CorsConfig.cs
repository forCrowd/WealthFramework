namespace forCrowd.WealthEconomy.WebApi
{
    using Microsoft.Owin.Cors;
    using Owin;
    using System.Threading.Tasks;
    using System.Web.Cors;

    public class CorsConfig
    {
        public static void ConfigureCors(IAppBuilder app)
        {
            var policy = new CorsPolicy()
            {
                AllowAnyHeader = true,
                AllowAnyMethod = true,
                SupportsCredentials = true
            };

            foreach (var allowedDomain in Framework.AppSettings.AllowedDomains)
            {
                policy.Origins.Add(allowedDomain);
            }

            app.UseCors(new CorsOptions
            {
                PolicyProvider = new CorsPolicyProvider
                {
                    PolicyResolver = context => Task.FromResult(policy)
                }
            });
        }
    }
}
