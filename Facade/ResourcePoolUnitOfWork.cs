namespace Facade
{
    using BusinessObjects;
    using DataObjects;

    public partial class ResourcePoolUnitOfWork
    {
        public override void Delete(params object[] id)
        {
            var resourcePool = Find(id);

            // Delete child items first
            var resourcePoolOrganizationRepository = new ResourcePoolOrganizationRepository(Context);
            var userResourcePoolOrganizationRepository = new UserResourcePoolOrganizationRepository(Context);

            var resourceOrganizationSet = resourcePool.ResourcePoolOrganizationSet;
            foreach (var item in resourceOrganizationSet)
                userResourcePoolOrganizationRepository.DeleteRange(item.UserResourcePoolOrganizationSet);
            resourcePoolOrganizationRepository.DeleteRange(resourceOrganizationSet);

            // Delete main item
            base.Delete(id);
        }
    }
}