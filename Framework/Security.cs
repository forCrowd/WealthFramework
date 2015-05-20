using System.Collections.Generic;
using System.Security.Claims;
using System.Threading;

namespace Framework
{
    public static class Security
    {
        public const string AUTHENTICATIONTYPE = "LocalAuth";

        public static void LoginAs(int userId)
        {
            var nameIdentifierClaim = new Claim(ClaimTypes.NameIdentifier, userId.ToString(), ClaimValueTypes.Integer32);
            var claims = new HashSet<Claim>() { nameIdentifierClaim };
            var sampleIdentity = new ClaimsIdentity(claims, AUTHENTICATIONTYPE);
            var samplePrincipal = new ClaimsPrincipal(sampleIdentity);
            Thread.CurrentPrincipal = samplePrincipal;
        }
    }
}
