namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public enum ResourcePoolIndexType : byte
    {
        SectorIndex = 1,
        KnowledgeIndex = 2,
        TotalCostIndex = 3,
        DynamicOrganizationIndex = 4,
        DynamicElementIndex = 5
    }
}
