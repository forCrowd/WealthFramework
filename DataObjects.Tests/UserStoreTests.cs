using BusinessObjects;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Data.Entity.Validation;
using System.Threading.Tasks;
using System.Linq;
using System.Data.Entity;

namespace DataObjects.Tests
{
    [TestClass]
    public class UserStoreTests : BaseTests
    {
        #region - Variables & Initialize & Cleanup -

        UserStore userStore;

        [TestInitialize]
        public void Initialize()
        {
            userStore = new UserStore(Context);
            userStore.AutoSaveChanges = false;
        }

        [TestCleanup]
        public void Cleanup()
        {
            userStore.Dispose();
        }

        #endregion

        [TestMethod]
        public async Task CreateValidUserAsync()
        {
            // Arrange + act
            var user = await CreateUserAsync();

            // Assert
            Assert.IsTrue(user.Id > 0);
        }

        [TestMethod]
        public async Task UserNameValidationExceptionAsync()
        {
            // Arrange
            var user = GenerateUser();
            user.Email = string.Empty;
            await userStore.CreateAsync(user);

            try
            {
                // Act
                await Context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                var entityException = (DbEntityValidationException) ex.InnerException;
                var errors = entityException.EntityValidationErrors;
                var error = errors.First();
                var validationError = error.ValidationErrors.First();

                // Assert
                Assert.IsTrue(validationError.PropertyName == "UserName");
                Assert.IsTrue(validationError.ErrorMessage == "The UserName field is required.");
            }
        }

        [TestMethod]
        public async Task FindByIdAsync()
        {
            // Arrange
            var user = await CreateUserAsync();
            var userId = user.Id;

            // Act
            var createdUser = await userStore.FindByIdAsync(userId);

            // Assert
            Assert.IsTrue(user.Id == createdUser.Id);
            Assert.IsTrue(user.Email == createdUser.Email);
        }

        [TestMethod]
        public async Task UpdateUserAsync()
        {
            // Arrange
            var user = await CreateUserAsync();
            var userId = user.Id;

            // Act
            user.FirstName = "First Name";
            user.LastName = "Last Name";
            await userStore.UpdateAsync(user);
            await Context.SaveChangesAsync();
            var updatedUser = await userStore.FindByIdAsync(userId);

            // Assert
            Assert.IsTrue(updatedUser.Id == user.Id);
            Assert.IsTrue(updatedUser.FirstName == "First Name");
            Assert.IsTrue(updatedUser.LastName == "Last Name");
        }

        [TestMethod]
        public async Task DeleteUserAsync()
        {
            // Arrange
            var user = await CreateUserAsync();
            var userId = user.Id;

            // Act
            await userStore.DeleteAsync(user);
            await Context.SaveChangesAsync();
            var deletedUser = await userStore.FindByIdAsync(userId);

            // Assert
            Assert.IsNull(deletedUser);
        }

        [TestMethod]
        public async Task AddToRoleAsync()
        {
            // Arrange
            const string roleName = "Administrator"; // Already created in seed method
            var user = await CreateUserAsync();

            // Act
            await userStore.AddToRoleAsync(user, roleName);
            await Context.SaveChangesAsync();
            var foundUser = await userStore.FindByIdAsync(user.Id);

            // Assert
            var isInRole = await userStore.IsInRoleAsync(foundUser, roleName);
            Assert.IsTrue(isInRole);
        }

        [TestMethod]
        public async Task CopySampleDataAsync()
        {
            // Act
            var sourceUser = await userStore.FindByIdAsync(2); // Already created in seed method
            // var targetUser = await CreateUserAsync();
            var targetUser = GenerateUser();

            // Arrange
            await userStore.CopySampleDataAsync(sourceUser.Id, targetUser);
            await userStore.SaveChangesAsync();

            // Assert
            var userResourcePools = targetUser.UserResourcePoolSet.Where(item => item.ResourcePool.IsSample);
            Assert.IsTrue(userResourcePools.Any());

            foreach (var userResourcePool in userResourcePools)
            {
                // Must have 101 (tax) rate and one Index with 100 rating
                Assert.IsTrue(userResourcePool.ResourcePoolRate == 101);
                Assert.IsTrue(userResourcePool.UserResourcePoolIndexSet.Count == 1);
                Assert.IsTrue(userResourcePool.UserResourcePoolIndexSet.First().Rating == 100);

                // And must have at least one cell
                Assert.IsTrue(targetUser.UserElementCellSet.Any(cell => cell.ElementCell.ElementField.Element.ResourcePool == userResourcePool.ResourcePool));
            }
        }

        User GenerateUser()
        {
            var email = string.Format("user_{0:yyyyMMdd_HHmmssfff}@wealth.azurewebsites.com", DateTime.Now);
            return new User(email);
        }

        async Task<User> CreateUserAsync()
        {
            var user = GenerateUser();

            // TODO Add password validation?

            await userStore.CreateAsync(user);
            await Context.SaveChangesAsync();

            return user;
        }
    }
}
