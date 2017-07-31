using System.Collections.Generic;
using System.Security.Claims;
using System.Threading;

namespace forCrowd.WealthEconomy.Framework
{
    public static class Security
    {
        public const string AUTHENTICATIONTYPE = "LocalAuth";

        public static void LoginAs(int userId, string role)
        {
            var nameIdentifierClaim = new Claim(ClaimTypes.NameIdentifier, userId.ToString(), ClaimValueTypes.Integer32);
            var roleClaim = new Claim(ClaimTypes.Role, role);
            var claims = new HashSet<Claim>() { nameIdentifierClaim, roleClaim };
            var sampleIdentity = new ClaimsIdentity(claims, AUTHENTICATIONTYPE);
            var samplePrincipal = new ClaimsPrincipal(sampleIdentity);
            Thread.CurrentPrincipal = samplePrincipal;
        }
    }
}
