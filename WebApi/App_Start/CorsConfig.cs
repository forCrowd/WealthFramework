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
            policy.Origins.Add(Framework.AppSettings.ClientAppUrl);

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
