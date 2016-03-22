namespace forCrowd.WealthEconomy.BusinessObjects
{
    using forCrowd.WealthEconomy.Framework;
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [UserAware("UserId")]
    public class UserElementCell : BaseEntity
    {
        [Obsolete("Parameterless constructors used by OData & EF. Make them private when possible.")]
        public UserElementCell()
        { }

        public UserElementCell(ElementCell elementCell) : this()
        {
            Validations.ArgumentNullOrDefault(elementCell, "elementCell");

            ElementCell = elementCell;
        }

        string stringValue = null;
        bool? booleanValue = null;
        int? integerValue = null;
        decimal? decimalValue = null;
        DateTime? dateTimeValue = null;

        [Key]
        [Column(Order = 1)]
        public int UserId { get; set; }

        [Key]
        [Column(Order = 2)]
        public int ElementCellId { get; set; }

        public string StringValue
        {
            get { return stringValue; }
            set
            {
                if (stringValue != value)
                {
                    ClearValues();
                    stringValue = value;
                }
            }
        }

        public bool? BooleanValue
        {
            get { return booleanValue; }
            set
            {
                if (booleanValue != value)
                {
                    ClearValues();
                    booleanValue = value;
                }
            }
        }

        public int? IntegerValue
        {
            get { return integerValue; }
            set
            {
                if (integerValue != value)
                {
                    ClearValues();
                    integerValue = value;
                }
            }
        }

        public decimal? DecimalValue
        {
            get { return decimalValue; }
            set
            {
                if (decimalValue != value)
                {
                    ClearValues();
                    decimalValue = value;
                }
            }
        }

        public DateTime? DateTimeValue
        {
            get { return dateTimeValue; }
            set
            {
                if (dateTimeValue != value)
                {
                    ClearValues();
                    dateTimeValue = value;
                }
            }
        }

        //public decimal Rating { get; set; }

        public virtual User User { get; set; }

        public virtual ElementCell ElementCell { get; set; }

        //public decimal Value
        //{
        //    get
        //    {
        //        var fieldType = (ElementFieldDataType)ElementCell.ElementField.DataType;

        //        switch (fieldType)
        //        {
        //            case ElementFieldDataType.Boolean:
        //                return Convert.ToDecimal(BooleanValue.GetValueOrDefault());
        //            case ElementFieldDataType.Integer:
        //                return Convert.ToDecimal(IntegerValue.GetValueOrDefault());
        //            case ElementFieldDataType.Decimal:
        //            // TODO This calculation is the same as Decimal type? Are we using the types in a wrong way?
        //            case ElementFieldDataType.ResourcePool:
        //            case ElementFieldDataType.Multiplier:
        //                return DecimalValue.GetValueOrDefault();
        //            case ElementFieldDataType.DateTime:
        //                // TODO Check GetValueOrDefault() method for this type
        //                return Convert.ToDecimal(DateTimeValue.GetValueOrDefault());
        //            case ElementFieldDataType.String:
        //            case ElementFieldDataType.Element:
        //                // TODO At least for now
        //                throw new InvalidOperationException("Value property is not available for this field type");
        //            default:
        //                throw new ArgumentOutOfRangeException();
        //        }
        //    }
        //}

        #region - Methods -

        // TODO Validations for SetValue() methods?
        // FieldType check for instance?

        internal UserElementCell SetValue(string value)
        {
            StringValue = value;
            return this;
        }

        internal UserElementCell SetValue(bool value)
        {
            BooleanValue = value;
            return this;
        }

        internal UserElementCell SetValue(int value)
        {
            IntegerValue = value;
            return this;
        }

        internal UserElementCell SetValue(decimal value)
        {
            DecimalValue = value;
            return this;
        }

        internal UserElementCell SetValue(DateTime value)
        {
            DateTimeValue = value;
            return this;
        }

        /// <summary>
        /// Clears all the fields, to be sure that there is no value one them, except the one that's being used
        /// </summary>
        void ClearValues()
        {
            stringValue = null;
            booleanValue = null;
            integerValue = null;
            decimalValue = null;
            dateTimeValue = null;
        }

        #endregion

    }
}
