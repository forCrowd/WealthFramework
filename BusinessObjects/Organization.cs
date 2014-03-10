namespace BusinessObjects
{
    using System.ComponentModel.DataAnnotations;
    using System.Linq;

    public partial class Organization
    {
        /// <summary>
        /// a.k.a. Markup
        /// </summary>
        public decimal Profit
        {
            get { return SalesPrice - ProductionCost; }
        }

        /// <summary>
        /// a.k.a Markup percentage
        /// </summary>
        [Display(Name = "Profit Percentage")]
        public decimal ProfitPercentage
        {
            get
            {
                if (ProductionCost == 0)
                    return 0;

                return Profit / ProductionCost;
            }
        }

        [Display(Name = "Profit Margin")]
        public decimal ProfitMargin
        {
            get
            {
                if (SalesPrice == 0)
                    return 0;

                return Profit / SalesPrice;
            }
        }
    }
}
