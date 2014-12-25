
using System;
namespace BusinessObjects.ViewModels
{
    public class ElementFieldIndex
    {
        public ElementFieldIndex() { }

        public ElementFieldIndex(BusinessObjects.ElementFieldIndex elementFieldIndex)
        {
            Id = elementFieldIndex.Id;
            ElementFieldId = elementFieldIndex.ElementFieldId;
            Name = elementFieldIndex.Name;
            IndexRatingCount = elementFieldIndex.IndexRatingCount;
            IndexRatingAverage = elementFieldIndex.IndexRatingAverage;
            IndexRatingPercentage = elementFieldIndex.IndexRatingPercentage;
            IndexShare = elementFieldIndex.IndexShare;
        }

        public int Id { get; set; }
        public Nullable<int> ElementFieldId { get; set; }
        public string Name { get; set; }
        public decimal IndexRatingCount { get; set; }
        public decimal IndexRatingAverage { get; set; }
        public decimal IndexRatingPercentage { get; set; }
        public decimal IndexShare { get; set; }
    }
}
