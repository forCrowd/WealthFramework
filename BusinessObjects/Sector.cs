namespace BusinessObjects
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class Sector
    {
        // TODO ?
        internal ResourcePool ResourcePool { get; set; }

        public decimal GetAverageUserRating()
        {
            return GetAverageUserRating(0);
        }

        public decimal GetAverageUserRating(int userId)
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
