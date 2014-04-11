namespace BusinessObjects
{
    using System.Linq;

    public class UserDto2
    {
        public string Name { get; set; }
    }

    public partial class License
    {

        public string TestValue
        {
            get { return "test"; }
            private set { }
        }

        public UserDto2 User
        {
            get { return new UserDto2(); }
            private set { }
        }

        public decimal GetAverageUserRating()
        {
            return GetAverageUserRating(0);
        }

        public decimal GetAverageUserRating(int userId)
        {
            var ratings = userId > 0
                ? UserLicenseRatingSet.Where(rating => rating.UserId == userId)
                : UserLicenseRatingSet;

            if (!ratings.Any())
                return 0;

            return ratings.Average(rating => rating.Rating);
        }
    }
}
