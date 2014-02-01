namespace BusinessObjects
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    public partial class UserDistributionIndexRating
    {
        public decimal TotalIndexRating
        {
            get
            {
                return TotalCostIndexRating
                    + KnowledgeIndexRating
                    + QualityIndexRating
                    + EmployeeSatisfactionIndexRating
                    + CustomerSatisfactionIndexRating
                    + SectorIndexRating
                    + DistanceIndexRating;
            }
        }

        public decimal TotalCostIndexWeightedAverage
        {
            get
            {
                if (TotalIndexRating == 0)
                    return 0;
                return TotalCostIndexRating / TotalIndexRating;
            }
        }

        public decimal KnowledgeIndexWeightedAverage
        {
            get
            {
                if (TotalIndexRating == 0)
                    return 0;
                return KnowledgeIndexRating / TotalIndexRating;
            }
        }

        public decimal QualityIndexWeightedAverage
        {
            get
            {
                if (TotalIndexRating == 0)
                    return 0;
                return QualityIndexRating / TotalIndexRating;
            }
        }

        public decimal EmployeeIndexWeightedAverage
        {
            get
            {
                if (TotalIndexRating == 0)
                    return 0;
                return EmployeeSatisfactionIndexRating / TotalIndexRating;
            }
        }

        public decimal CustomerIndexWeightedAverage
        {
            get
            {
                if (TotalIndexRating == 0)
                    return 0;
                return CustomerSatisfactionIndexRating / TotalIndexRating;
            }
        }

        public decimal SectorIndexWeightedAverage
        {
            get
            {
                if (TotalIndexRating == 0)
                    return 0;
                return SectorIndexRating / TotalIndexRating;
            }
        }

        public decimal DistanceIndexWeightedAverage
        {
            get
            {
                if (TotalIndexRating == 0)
                    return 0;
                return DistanceIndexRating / TotalIndexRating;
            }
        }
    }
}
