namespace BusinessObjects.Dto
{
    using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

    public partial class ResourcePoolDto
    {
        public decimal TotalDynamicIndexRating { get; set; }
        public IEnumerable<ResourcePoolIndexDto> ResourcePoolIndexSet { get; set; }
    }
}
