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

        public decimal UserRating
        {
            get
            {
                if (UserLicenseRatingSet.Count == 0)
                    return 0;
                return UserLicenseRatingSet.Average(rating => rating.Rating);
            }
        }
    }
}
