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
    public class UserStoreTests
    {
        #region - Variables & Initialize & Cleanup -

        WealthEconomyContext context;
        RoleStore roleStore;
        UserStore userStore;

        [TestInitialize]
        public void Initialize()
        {
            context = new WealthEconomyContext();
            context.Database.Initialize(true);

            userStore = new UserStore(context);
            userStore.AutoSaveChanges = false;
            
            roleStore = new RoleStore(context);
        }

        [TestCleanup]
        public void Cleanup()
        {
            userStore.Dispose();
            context.Dispose();
        }

        #endregion

        [TestMethod]
        public async Task CreateValidUser()
        {
            // Arrange + act
            var user = await CreateUserAsync();

            // Assert
            Assert.IsTrue(user.Id > 0);
        }

        [TestMethod]
        public async Task UserNameValidationException()
        {
            // Arrange
            var user = new User();
            await userStore.CreateAsync(user);

            try
            {
                // Act
                await context.SaveChangesAsync();
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
        public async Task UpdateUser()
        {
            // Arrange
            var user = await CreateUserAsync();
            var userId = user.Id;

            // Act
            user.FirstName = "First Name";
            user.LastName = "Last Name";
            await userStore.UpdateAsync(user);
            await context.SaveChangesAsync();
            var updatedUser = await userStore.FindByIdAsync(userId);

            // Assert
            Assert.IsTrue(updatedUser.Id == user.Id);
            Assert.IsTrue(updatedUser.FirstName == "First Name");
            Assert.IsTrue(updatedUser.LastName == "Last Name");
        }

        [TestMethod]
        public async Task DeleteUser()
        {
            // Arrange
            var user = await CreateUserAsync();
            var userId = user.Id;

            // Act
            await userStore.DeleteAsync(user);
            await context.SaveChangesAsync();
            var deletedUser = await userStore.FindByIdAsync(userId);

            // Assert
            Assert.IsNull(deletedUser);
        }

        [TestMethod]
        public async Task AddToRole()
        {
            // Arrange
            const string roleName = "test role";
            var role = new Role(roleName);
            if (!roleStore.Roles.Any(item => item.Name == roleName))
                await roleStore.CreateAsync(role);
            var user = await CreateUserAsync();

            // Act
            await userStore.AddToRoleAsync(user, roleName);
            await context.SaveChangesAsync();
            var foundUser = await userStore.FindByIdAsync(user.Id);

            // Assert
            var isInRole = await userStore.IsInRoleAsync(foundUser, roleName);
            Assert.IsTrue(isInRole);
        }

        async Task<User> CreateUserAsync()
        {
            var userName = string.Format("user_{0:yyyyMMdd_HHmmssfff}@wealth.azurewebsites.com", DateTime.Now);
            var user = new User() { Email = userName, UserName = userName };

            // TODO Add password validation?

            await userStore.CreateAsync(user);
            await context.SaveChangesAsync();

            return user;
        }
    }
}
