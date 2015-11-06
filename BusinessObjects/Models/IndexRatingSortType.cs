namespace forCrowd.WealthEconomy.BusinessObjects
{
    public enum IndexRatingSortType : byte
    {
        /// <summary>
        /// Low rating is better.
        /// </summary>
        LowestToHighest = 1,

        /// <summary>
        /// Default type.
        /// High rating is better.
        /// </summary>
        HighestToLowest = 2
    }
}
