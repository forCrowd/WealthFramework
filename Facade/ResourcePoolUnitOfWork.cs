namespace Facade
{
    using BusinessObjects;
    using DataObjects;

    public partial class ResourcePoolUnitOfWork
    {
        // TODO Insert with sample Sector + License + Organization

        public override void Delete(params object[] id)
        {
            var resourcePool = Find(id);

            // Delete child items first

            // TODO UserOrganization
            // TODO UserResourcePool
            // TODO Organization
            // TODO Sector
            // TODO License

            //var resourcePoolOrganizationRepository = new ResourcePoolOrganizationRepository(Context);
            //var userResourcePoolOrganizationRepository = new UserResourcePoolOrganizationRepository(Context);

            //var resourceOrganizationSet = resourcePool.ResourcePoolOrganizationSet;
            //foreach (var item in resourceOrganizationSet)
            //    userResourcePoolOrganizationRepository.DeleteRange(item.UserResourcePoolOrganizationSet);
            //resourcePoolOrganizationRepository.DeleteRange(resourceOrganizationSet);

            // Delete main item
            base.Delete(id);
        }
    }
}