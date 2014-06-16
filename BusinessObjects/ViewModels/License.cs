namespace BusinessObjects.ViewModels
{
    public class License
    {
        public License() { }

        public License(BusinessObjects.License license)
        {
            LicenseName = license.Name;
            RatingCount = license.UserLicenseRatingSet.Count;
            AverageRating = license.GetAverageRating();
        }

        public string LicenseName { get; set; }
        public int RatingCount { get; set; }
        public decimal AverageRating { get; set; }
    }
}
