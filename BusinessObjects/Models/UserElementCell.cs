namespace forCrowd.WealthEconomy.BusinessObjects
{
    using forCrowd.WealthEconomy.BusinessObjects.Attributes;
    using forCrowd.WealthEconomy.Framework;
    using System;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [UserAware("UserId")]
    [DisplayName("User Element Cell")]
    public class UserElementCell : BaseEntity
    {
        [Obsolete("Parameterless constructors used by OData & EF. Make them private when possible.")]
        public UserElementCell()
        { }

        //public UserElementCell(User user, ElementCell elementCell, decimal rating)
        //public UserElementCell(User user, ElementCell elementCell) : this()
        public UserElementCell(ElementCell elementCell) : this()
        {
            //Validations.ArgumentNullOrDefault(user, "user");
            Validations.ArgumentNullOrDefault(elementCell, "elementCell");

            //User = user;
            ElementCell = elementCell;
            //Rating = rating;
        }

        string stringValue = null;
        bool? booleanValue = null;
        int? integerValue = null;
        decimal? decimalValue = null;
        DateTime? dateTimeValue = null;

        //[DisplayOnListView(false)]
        //[DisplayOnEditView(false)]
        //public int Id { get; set; }

        //[Index("IX_UserIdElementCellId", 1, IsUnique = true)]
        [Key]
        [Column(Order = 1)]
        public int UserId { get; set; }

        //[Index("IX_UserIdElementCellId", 2, IsUnique = true)]
        [Key]
        [Column(Order = 2)]
        public int ElementCellId { get; set; }

        [Display(Name = "String Value")]
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

        [Display(Name = "Boolean Value")]
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

        [Display(Name = "Integer Value")]
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

        [Display(Name = "Decimal Value")]
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

        [Display(Name = "Date Time Value")]
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
        //        var fieldType = (ElementFieldTypes)ElementCell.ElementField.ElementFieldType;

        //        switch (fieldType)
        //        {
        //            case ElementFieldTypes.Boolean:
        //                return Convert.ToDecimal(BooleanValue.GetValueOrDefault());
        //            case ElementFieldTypes.Integer:
        //                return Convert.ToDecimal(IntegerValue.GetValueOrDefault());
        //            case ElementFieldTypes.Decimal:
        //            // TODO This calculation is the same as Decimal type? Are we using the types in a wrong way?
        //            case ElementFieldTypes.ResourcePool:
        //            case ElementFieldTypes.Multiplier:
        //                return DecimalValue.GetValueOrDefault();
        //            case ElementFieldTypes.DateTime:
        //                // TODO Check GetValueOrDefault() method for this type
        //                return Convert.ToDecimal(DateTimeValue.GetValueOrDefault());
        //            case ElementFieldTypes.String:
        //            case ElementFieldTypes.Element:
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
