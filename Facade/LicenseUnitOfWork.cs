namespace Facade
{
    using BusinessObjects;
    using DataObjects;

    public partial class LicenseUnitOfWork
    {
        public override void Delete(params object[] id)
        {
            var license = Find(id);

            // Delete child items first
            new UserLicenseRatingRepository(Context).DeleteRange(license.UserLicenseRatingSet);

            // Main
            base.Delete(id);
        }
    }
}