namespace BusinessObjects
{
    using System.Linq;

    public partial class License
    {

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
