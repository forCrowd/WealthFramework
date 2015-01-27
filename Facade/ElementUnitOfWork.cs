namespace Facade
{
    using BusinessObjects;
    using DataObjects;
    using System.Data.Entity;
    using System.Linq;
    using System.Threading.Tasks;

    public partial class ElementUnitOfWork
    {
        UserStore userStore;

        UserStore UserStore
        {
            get { return userStore ?? (userStore = new UserStore(Context)); }
        }

        public async Task<User> FindUserById(int userId)
        {
            return await UserStore.FindByIdAsync(userId);
        }

        public async Task<UserResourcePool> FindUserResourcePoolAsync(int userId, int resourcePoolId)
        {
            var repository = new ResourcePoolRepository(Context);

            return await repository.FindUserResourcePoolAsync(userId, resourcePoolId);
        }

        public async Task<ResourcePool> FindByUserResourcePoolIdAsync(int userResourcePoolId)
        {
            var repository = new ResourcePoolRepository(Context);
            return await repository.FindByUserResourcePoolIdAsync(userResourcePoolId);
        }

        public async Task IncreaseMultiplierAsync(Element element, User user)
        {
            Framework.Validations.ArgumentNullOrDefault(element, "element");
            Framework.Validations.ArgumentNullOrDefault(user, "user");

            await LoadMultiplierIncludes(element.Id);

            element.IncreaseMultiplier(user);
            await base.UpdateAsync(element);
        }

        public async Task DecreaseMultiplierAsync(Element element, User user)
        {
            Framework.Validations.ArgumentNullOrDefault(element, "element");
            Framework.Validations.ArgumentNullOrDefault(user, "user");

            await LoadMultiplierIncludes(element.Id);

            element.DecreaseMultiplier(user);
            await base.UpdateAsync(element);
        }

        public async Task ResetMultiplierAsync(Element element, User user)
        {
            Framework.Validations.ArgumentNullOrDefault(element, "element");
            Framework.Validations.ArgumentNullOrDefault(user, "user");

            await LoadMultiplierIncludes(element.Id);

            element.ResetMultiplier(user);
            await base.UpdateAsync(element);
        }

        async Task LoadMultiplierIncludes(int elementId)
        {
            // Includes

            // TODO ResourcePool include?

            await AllLive
                //.Include(item => item.ResourcePool)
                .Include(element => element.ElementFieldSet)
                .Where(element => element.Id == elementId)
                .ToListAsync();

            await AllLive
                .Include(element => element.ElementItemSet)
                .Include(element => element.ElementItemSet.Select(elementItem => elementItem.ElementCellSet))
                .Include(element => element.ElementItemSet.Select(elementItem => elementItem.ElementCellSet.Select(elementCell => elementCell.UserElementCellSet)))
                .Where(element => element.Id == elementId)
                .ToListAsync();
        }
    }
}