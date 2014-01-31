namespace DataObjects
{
    using BusinessObjects;
    using System;
    using System.Collections;
    using System.Data.Entity;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Threading.Tasks;

    public partial class UserDistributionIndexRatingRepository
    {
        public async Task<UserDistributionIndexRatingAverage> GetAverageAsync()
        {
            var query = AllLive;

            var result = new UserDistributionIndexRatingAverage();
            result.RatingCount = query.Count();
            result.TotalCostIndexRating = await query.AverageAsync(rating => rating.TotalCostIndexRating);
            result.KnowledgeIndexRating = await query.AverageAsync(rating => rating.KnowledgeIndexRating);
            result.QualityIndexRating = await query.AverageAsync(rating => rating.QualityIndexRating);
            result.SectorIndexRating = await query.AverageAsync(rating => rating.SectorIndexRating);
            result.EmployeeIndexRating = await query.AverageAsync(rating => rating.EmployeeIndexRating);
            result.CustomerIndexRating = await query.AverageAsync(rating => rating.CustomerIndexRating);
            result.DistanceIndexRating = await query.AverageAsync(rating => rating.DistanceIndexRating);

            return result;
        }
    }
}
