using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(forCrowd.WealthEconomy.Web.Startup))]

namespace forCrowd.WealthEconomy.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
