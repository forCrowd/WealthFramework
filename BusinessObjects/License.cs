namespace BusinessObjects
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class License
    {
        // TODO ?
        internal ResourcePool ResourcePool { get; set; }

        //public decimal UserRating
        //{
        //    get
        //    {
        //        if (UserLicenseRatingSet.Count == 0)
        //            return 0;
        //        return UserLicenseRatingSet.Average(rating => rating.Rating);
        //    }
        //}

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
