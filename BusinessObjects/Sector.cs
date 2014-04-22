namespace BusinessObjects
{
    using System.Linq;

    public partial class Sector
    {
        public decimal GetAverageRating()
        {
            return GetAverageRating(0);
        }

        public decimal GetAverageRating(int userId)
        {
            var ratings = userId > 0
                ? UserSectorRatingSet.Where(rating => rating.UserId == userId)
                : UserSectorRatingSet;

            if (!ratings.Any())
                return 0;

            return ratings.Average(rating => rating.Rating);
        }
    }
}
