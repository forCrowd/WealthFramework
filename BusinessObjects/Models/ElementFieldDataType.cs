namespace forCrowd.WealthEconomy.BusinessObjects
{
    public enum ElementFieldDataType : byte
    {
        /// <summary>
        /// A field that holds string value.
        /// Use StringValue property to set its value on ElementItem level.
        /// </summary>
        String = 1,

        /// <summary>
        /// A field that holds boolean value.
        /// Use BooleanValue property to set its value on ElementItem level.
        /// </summary>
        Boolean = 2,

        /// <summary>
        /// A field that holds integer value.
        /// Use IntegerValue property to set its value on ElementItem level.
        /// </summary>
        Integer = 3,

        /// <summary>
        /// A field that holds decimal value.
        /// Use DecimalValue property to set its value on ElementItem level.
        /// </summary>
        Decimal = 4,
        
        /// <summary>
        /// A field that holds DateTime value.
        /// Use DateTimeValue property to set its value on ElementItem level.
        /// </summary>
        DateTime = 5,
        
        /// <summary>
        /// A field that holds another defined Element object within the resource pool.
        /// Use SelectedElementItem property to set its value on ElementItem level.
        /// </summary>
        Element = 6,
        
        /// <summary>
        /// The field that presents each item's main income (e.g. Sales Price).
        /// Also resource pool amount will be calculated based on this field.
        /// Defined once per Element (at the moment, can be changed to per Resource Pool).
        /// Use DecimalValue property to set its value on ElementItem level.
        /// </summary>
        DirectIncome = 11,

        /// <summary>
        /// The multiplier of the resource pool (e.g. Number of sales, number of users).
        /// Defined once per Element (at the moment, can be changed to per Resource Pool).
        /// Use DecimalValue property to set its value on ElementItem level.
        /// </summary>
        Multiplier = 12
    }
}
