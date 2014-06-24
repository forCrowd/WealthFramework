
namespace BusinessObjects.ViewModels
{
    public class ResourcePool
    {
        public ResourcePool() { }

        public ResourcePool(BusinessObjects.ResourcePool resourcePool)
        {
            Id = resourcePool.Id;
            Name = resourcePool.Name;
            RatingCount = resourcePool.UserResourcePoolSet.Count;
            TotalCostIndexRatingAverage = resourcePool.TotalCostIndexRatingAverage;
            KnowledgeIndexRatingAverage = resourcePool.KnowledgeIndexRatingAverage;
            QualityIndexRatingAverage = resourcePool.QualityIndexRatingAverage;
            SectorIndexRatingAverage = resourcePool.SectorIndexRatingAverage;
            EmployeeSatisfactionIndexRatingAverage = resourcePool.EmployeeSatisfactionIndexRatingAverage;
            CustomerSatisfactionIndexRatingAverage = resourcePool.CustomerSatisfactionIndexRatingAverage;
            //DistanceIndexRatingAverage = resourcePool.DistanceIndexRatingAverage;
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public int RatingCount { get; set; }
        public decimal TotalCostIndexRatingAverage { get; set; }
        public decimal KnowledgeIndexRatingAverage { get; set; }
        public decimal QualityIndexRatingAverage { get; set; }
        public decimal SectorIndexRatingAverage { get; set; }
        public decimal EmployeeSatisfactionIndexRatingAverage { get; set; }
        public decimal CustomerSatisfactionIndexRatingAverage { get; set; }
        //public decimal DistanceIndexRatingAverage { get; set; }
    }
}
