namespace Facade
{
    using BusinessObjects;
    using DataObjects;
    using System.Linq;
    using System.Threading.Tasks;

    public partial class UserResourcePoolUnitOfWork
    {
        ResourcePoolRepository resourcePoolRepository;
        UserElementFieldIndexRepository userElementFieldIndexRepository;

        public override async Task<int> DeleteAsync(params object[] id)
        {
            // TODO How about retrieving it by using Include?
            var userResourcePool = Find(id);

            // TODO Delete child items first ?

            // Delete main item
            return await base.DeleteAsync(id);
        }
    }
}