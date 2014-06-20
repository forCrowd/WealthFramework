namespace BusinessObjects.Dto
{
    using System;
    using System.ComponentModel.DataAnnotations;

    public partial class ResourcePoolIndexDto
    {
        public decimal IndexRatingCount { get; set; }
        public decimal IndexRatingAverage { get; set; }
        public decimal IndexRatingWeightedAverage { get; set; }
        public decimal IndexValueAverage { get; set; }
    }
}
