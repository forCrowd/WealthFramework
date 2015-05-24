using BusinessObjects;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Data.Entity.Validation;
using System.Threading.Tasks;
using System.Linq;
using System.Data.Entity;
using System.Security.Claims;
using System.Collections.Generic;
using System.Threading;

namespace DataObjects.Tests
{
    [TestClass]
    public class ResourcePoolRepositoryTests : BaseTests
    {
        #region - Variables & Initialize & Cleanup -

        public TestContext TestContext { get; set; }
        ResourcePoolRepository resourcePoolRepository;
        UserResourcePoolRepository userResourcePoolRepository;

        [TestInitialize]
        public void Initialize()
        {
            TestContext.WriteLine("Test initializing");

            CreateNewStore();
        }

        [TestCleanup]
        public void Cleanup()
        {
            TestContext.WriteLine("Test cleaning up");
            // TODO Dispose?
        }

        void CreateNewStore()
        {
            resourcePoolRepository = new ResourcePoolRepository(Context);
            userResourcePoolRepository = new UserResourcePoolRepository(Context);
        }

        void RefreshStore()
        {
            base.InitializeContext();
            CreateNewStore();
        }

        #endregion

        [TestMethod]
        public async Task InsertNewResourcePool_IdShouldBeBiggerThanZero()
        {
            // Arrange
            var resourcePool = new ResourcePool("ResourcePool");
            
            // Act
            resourcePoolRepository.Insert(resourcePool);
            await Context.SaveChangesAsync();

            // Assert
            Assert.IsTrue(resourcePool.Id > 0);
        }

        [TestMethod]
        public async Task AddUserResourcePool_IdShouldBeBiggerThanZero()
        {
            // Arrange
            var userStore = new UserStore(Context);
            userStore.AutoSaveChanges = false;

            var user = new User("User");

            await userStore.CreateAsync(user);
            await Context.SaveChangesAsync();

            LoginAs(user);

            var resourcePool = new ResourcePool("ResourcePool");
            var userResourcePool = resourcePool.AddUserResourcePool(100);

            // Act
            resourcePoolRepository.Insert(resourcePool);
            await Context.SaveChangesAsync();

            // Assert
            Assert.IsTrue(user.Id > 0);
            Assert.IsTrue(resourcePool.Id > 0);
            //Assert.IsTrue(userResourcePool.Id > 0);
        }

        // DbCommandInterceptor tests, insert + query
        [TestMethod]
        public async Task DbInterceptor_ShouldOnlyGetAuthenticatedUserData()
        {
            // Arrange
            var userStore = new UserStore(Context);
            userStore.AutoSaveChanges = false;

            var user1 = new User("User 1");
            var user2 = new User("User 2");

            await userStore.CreateAsync(user1);
            await userStore.CreateAsync(user2);
            await Context.SaveChangesAsync();

            // Act
            var resourcePool = new ResourcePool("ResourcePool");
            resourcePoolRepository.Insert(resourcePool);

            LoginAs(user1);
            resourcePool.AddUserResourcePool(100);
            await Context.SaveChangesAsync();

            LoginAs(user2);
            resourcePool.AddUserResourcePool(100);
            await Context.SaveChangesAsync();

            // Assert: Clear the context and retrieve the data one more time, it should only get the authenticated user's data
            RefreshStore();

            var resourcePoolFromDb = resourcePoolRepository
                .AllLiveIncluding(item => item.UserResourcePoolSet)
                .OrderByDescending(item => item.CreatedOn)
                .First();

            Assert.IsTrue(resourcePoolFromDb.Id == resourcePool.Id);
            Assert.IsTrue(resourcePoolFromDb.UserResourcePoolSet.Count == 1);
            Assert.IsTrue(resourcePoolFromDb.UserResourcePoolSet.Single().UserId == user2.Id);
        }

        [TestMethod]
        public async Task DbInterceptor_NoLoggedInUser_ShouldNotGetAnyUserData()
        {
            // Arrange
            var userStore = new UserStore(Context);
            userStore.AutoSaveChanges = false;

            var user1 = new User("User 1");
            var user2 = new User("User 2");

            await userStore.CreateAsync(user1);
            await userStore.CreateAsync(user2);
            await Context.SaveChangesAsync();

            // Act
            var resourcePool = new ResourcePool("ResourcePool");
            resourcePoolRepository.Insert(resourcePool);

            LoginAs(user1);
            resourcePool.AddUserResourcePool(100);
            await Context.SaveChangesAsync();

            LoginAs(user2);
            resourcePool.AddUserResourcePool(100);
            await Context.SaveChangesAsync();

            // Assert: Clear the context and retrieve the data one more time, since there is no logged in user, it shouldn't retrieve any user level data
            Logout();
            
            RefreshStore();

            var resourcePoolFromDb = resourcePoolRepository
                .AllLiveIncluding(item => item.UserResourcePoolSet)
                .OrderByDescending(item => item.CreatedOn)
                .First();

            Assert.IsTrue(resourcePoolFromDb.Id == resourcePool.Id);
            TestContext.WriteLine("resourcePoolFromDb.UserResourcePoolSet.Count: " + resourcePoolFromDb.UserResourcePoolSet.Count);
            Assert.IsTrue(resourcePoolFromDb.UserResourcePoolSet.Count == 1);
            Assert.IsTrue(resourcePoolFromDb.UserResourcePoolSet.Single().UserId == user2.Id);
        }

        void LoginAs(User user)
        {
            var nameIdentifierClaim = new Claim(ClaimTypes.NameIdentifier, user.Id.ToString(), ClaimValueTypes.Integer32);
            var claims = new HashSet<Claim>() { nameIdentifierClaim };
            var sampleIdentity = new ClaimsIdentity(claims, "TestAuth");
            // TestContext.WriteLine("sampleIdentity.IsAuthenticated: " + sampleIdentity.IsAuthenticated);
            var samplePrincipal = new ClaimsPrincipal(sampleIdentity);
            Thread.CurrentPrincipal = samplePrincipal;
        }

        void Logout()
        {
            Thread.CurrentPrincipal = null;
        }

        //[TestMethod]
        //public async Task CreateValidUserAsync()
        //{
        //    // Arrange + act
        //    var user = await CreateUserAsync();

        //    // Assert
        //    Assert.IsTrue(user.Id > 0);
        //}

        //[TestMethod]
        //public async Task UserNameValidationExceptionAsync()
        //{
        //    // Arrange
        //    var user = GenerateUser();
        //    user.Email = string.Empty;
        //    await userStore.CreateAsync(user);

        //    try
        //    {
        //        // Act
        //        await Context.SaveChangesAsync();
        //    }
        //    catch (Exception ex)
        //    {
        //        var entityException = (DbEntityValidationException) ex.InnerException;
        //        var errors = entityException.EntityValidationErrors;
        //        var error = errors.First();
        //        var validationError = error.ValidationErrors.First();

        //        // Assert
        //        Assert.IsTrue(validationError.PropertyName == "UserName");
        //        Assert.IsTrue(validationError.ErrorMessage == "The UserName field is required.");
        //    }
        //}

        //[TestMethod]
        //public async Task FindByIdAsync()
        //{
        //    // Arrange
        //    var user = await CreateUserAsync();
        //    var userId = user.Id;

        //    // Act
        //    var createdUser = await userStore.FindByIdAsync(userId);

        //    // Assert
        //    Assert.IsTrue(user.Id == createdUser.Id);
        //    Assert.IsTrue(user.Email == createdUser.Email);
        //}

        //[TestMethod]
        //public async Task UpdateUserAsync()
        //{
        //    // Arrange
        //    var user = await CreateUserAsync();
        //    var userId = user.Id;

        //    // Act
        //    user.FirstName = "First Name";
        //    user.LastName = "Last Name";
        //    await userStore.UpdateAsync(user);
        //    await Context.SaveChangesAsync();
        //    var updatedUser = await userStore.FindByIdAsync(userId);

        //    // Assert
        //    Assert.IsTrue(updatedUser.Id == user.Id);
        //    Assert.IsTrue(updatedUser.FirstName == "First Name");
        //    Assert.IsTrue(updatedUser.LastName == "Last Name");
        //}

        //[TestMethod]
        //public async Task DeleteUserAsync()
        //{
        //    // Arrange
        //    var user = await CreateUserAsync();
        //    var userId = user.Id;

        //    // Act
        //    await userStore.DeleteAsync(user);
        //    await Context.SaveChangesAsync();
        //    var deletedUser = await userStore.FindByIdAsync(userId);

        //    // Assert
        //    Assert.IsNull(deletedUser);
        //}

        //[TestMethod]
        //public async Task AddToRoleAsync()
        //{
        //    // Arrange
        //    const string roleName = "Administrator"; // Already created in seed method
        //    var user = await CreateUserAsync();

        //    // Act
        //    await userStore.AddToRoleAsync(user, roleName);
        //    await Context.SaveChangesAsync();
        //    var foundUser = await userStore.FindByIdAsync(user.Id);

        //    // Assert
        //    var isInRole = await userStore.IsInRoleAsync(foundUser, roleName);
        //    Assert.IsTrue(isInRole);
        //}

        //[TestMethod]
        //public async Task CopySampleDataAsync()
        //{
        //    // Arrange
        //    var sourceUser = await userStore.FindByIdAsync(2); // Already created in seed method
        //    // var targetUser = await CreateUserAsync();
        //    var targetUser = GenerateUser();

        //    // Act
        //    await userStore.CopySampleDataAsync(sourceUser.Id, targetUser);
        //    await userStore.SaveChangesAsync();

        //    // Assert
        //    var userResourcePools = targetUser.UserResourcePoolSet.Where(item => item.ResourcePool.IsSample);
        //    Assert.IsTrue(userResourcePools.Any());
        //}

        //[TestMethod]
        //public async Task ResetSampleDataAsync()
        //{

        //    // Arrange
        //    var sourceUser = await userStore.FindByIdAsync(2); // Already created in seed method
        //    var targetUser = GenerateUser();
        //    // await userStore.SaveChangesAsync();

        //    await userStore.CopySampleDataAsync(sourceUser.Id, targetUser);
        //    await userStore.SaveChangesAsync();

        //    // TODO Improve this test
        //    // To be able to simulate a real situation, ResetSampleDataAsync method has to run on a brand new Context
        //    RefreshUserStore();

        //    // Act
        //    await userStore.ResetSampleDataAsync(targetUser.Id, sourceUser.Id);
        //    await userStore.SaveChangesAsync();

        //    // Assert
        //    var userResourcePools = targetUser.UserResourcePoolSet.Where(item => item.ResourcePool.IsSample);
        //    Assert.IsTrue(userResourcePools.Any());
        //}

        //User GenerateUser()
        //{
        //    var email = string.Format("user_{0:yyyyMMdd_HHmmssfff}@wealth.azurewebsites.com", DateTime.Now);
        //    return new User(email);
        //}

        //async Task<User> CreateUserAsync()
        //{
        //    var user = GenerateUser();

        //    // TODO Add password validation?

        //    await userStore.CreateAsync(user);
        //    await Context.SaveChangesAsync();

        //    return user;
        //}
    }
}
