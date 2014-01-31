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

        public decimal UserRating
        {
            get
            {
                if (UserSectorRating.Count == 0)
                    return 0;
                return UserSectorRating.Average(rating => rating.Rating);
            }
        }
    }
}
