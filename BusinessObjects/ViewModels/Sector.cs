using System.Collections.Generic;
using System.Linq;

namespace BusinessObjects.ViewModels
{
    public class Sector
    {
        public Sector() { }

        public Sector(BusinessObjects.Sector sector)
        {
            SectorName = sector.Name;
            RatingCount = sector.UserSectorRatingSet.Count();
            RatingAverage = sector.RatingAverage;
        }

        public string SectorName { get; set; }
        public int RatingCount { get; set; }
        public decimal RatingAverage { get; set; }
    }
}
