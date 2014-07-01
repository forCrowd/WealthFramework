
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
            //SectorIndexRatingAverage = resourcePool.SectorIndexRatingAverage;
            //KnowledgeIndexRatingAverage = resourcePool.KnowledgeIndexRatingAverage;
            //TotalCostIndexRatingAverage = resourcePool.TotalCostIndexRatingAverage;
            //QualityIndexRatingAverage = resourcePool.QualityIndexRatingAverage;
            //EmployeeSatisfactionIndexRatingAverage = resourcePool.EmployeeSatisfactionIndexRatingAverage;
            //CustomerSatisfactionIndexRatingAverage = resourcePool.CustomerSatisfactionIndexRatingAverage;
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public int RatingCount { get; set; }
        //public decimal SectorIndexRatingAverage { get; set; }
        //public decimal KnowledgeIndexRatingAverage { get; set; }
        //public decimal TotalCostIndexRatingAverage { get; set; }
        //public decimal QualityIndexRatingAverage { get; set; }
        //public decimal EmployeeSatisfactionIndexRatingAverage { get; set; }
        //public decimal CustomerSatisfactionIndexRatingAverage { get; set; }
    }
}
