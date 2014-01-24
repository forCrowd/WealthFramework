using System;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using BusinessObjects;
using DataObjects;

namespace DataObjects.Tests
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public void NewUser()
        {
            //var user = new Data
            var newUser = new User()
            {
                Email = string.Format("user_{0:yyyyMMdd_HHmmss}@wealtheconomy.com", DateTime.Now),
            };

            var userRepository = new UserRepository(new WealthEconomyEntities());
            userRepository.InsertOrUpdate(newUser);
            userRepository.Save();
        }

        [TestMethod]
        public void NewUserDistributionIndexRating()
        {
            using (var context = new WealthEconomyEntities())
            {
                var userRepository = new UserRepository(context);
                var userRatingRepository = new UserDistributionIndexRatingRepository(context);

                var existingUser = userRepository.AllLive.Single(u => u.Email == "serkanholat@hotmail.com");

                var rating =  existingUser.UserDistributionIndexRatingSet.FirstOrDefault();

                if (rating == null)
                    rating = new UserDistributionIndexRating() { User = existingUser };

                rating.TotalCostIndexRating = 10;
                rating.KnowledgeIndexRating = 1;
                rating.QualityIndexRating = 1;
                rating.SectorIndexRating = 1;
                rating.EmployeeIndexRating = 1;
                rating.CustomerIndexRating = 1;

                userRatingRepository.InsertOrUpdate(rating);

                context.SaveChanges();
            }
        }
    }
}
