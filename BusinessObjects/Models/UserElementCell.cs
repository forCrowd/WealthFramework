namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using Framework;
    using System;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations.Schema;

    [DisplayName("User Element Cell")]
    public class UserElementCell : BaseEntity
    {
        [Obsolete("Parameterless constructors used by OData & EF. Make them private when possible.")]
        public UserElementCell()
        { }

        //public UserElementCell(User user, ElementCell elementCell, decimal rating)
        public UserElementCell(User user, ElementCell elementCell)
        {
            Validations.ArgumentNullOrDefault(user, "user");
            Validations.ArgumentNullOrDefault(elementCell, "elementCell");

            User = user;
            ElementCell = elementCell;
            //Rating = rating;
        }

        bool? booleanValue = null;
        int? integerValue = null;
        decimal? decimalValue = null;
        DateTime? dateTimeValue = null;

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        [Index("IX_UserIdElementCellId", 1, IsUnique = true)]
        public int UserId { get; set; }

        [Index("IX_UserIdElementCellId", 2, IsUnique = true)]
        public int ElementCellId { get; set; }

        public bool? BooleanValue
        {
            get { return booleanValue; }
            set
            {
                ClearValues();
                booleanValue = value;
            }
        }

        public int? IntegerValue
        {
            get { return integerValue; }
            set
            {
                ClearValues();
                integerValue = value;
            }
        }

        public decimal? DecimalValue
        {
            get { return decimalValue; }
            set
            {
                ClearValues();
                decimalValue = value;
            }
        }

        public DateTime? DateTimeValue
        {
            get { return dateTimeValue; }
            set
            {
                ClearValues();
                dateTimeValue = value;
            }
        }

        //public decimal Rating { get; set; }

        public virtual User User { get; set; }

        public virtual ElementCell ElementCell { get; set; }

        public decimal Value
        {
            get
            {
                var fieldType = (ElementFieldTypes)ElementCell.ElementField.ElementFieldType;

                switch (fieldType)
                {
                    case ElementFieldTypes.Boolean:
                        return Convert.ToDecimal(BooleanValue.GetValueOrDefault());
                    case ElementFieldTypes.Integer:
                        return Convert.ToDecimal(IntegerValue.GetValueOrDefault());
                    case ElementFieldTypes.Decimal:
                    // TODO This calculation is the same as Decimal type? Are we using the types in a wrong way?
                    case ElementFieldTypes.ResourcePool:
                    case ElementFieldTypes.Multiplier:
                        return DecimalValue.GetValueOrDefault();
                    case ElementFieldTypes.DateTime:
                        // TODO Check GetValueOrDefault() method for this type
                        return Convert.ToDecimal(DateTimeValue.GetValueOrDefault());
                    case ElementFieldTypes.String:
                    case ElementFieldTypes.Element:
                        // TODO At least for now
                        throw new InvalidOperationException("Value property is not available for this field type");
                    default:
                        throw new ArgumentOutOfRangeException();
                }
            }
        }

        #region - Methods -

        // TODO Validations for SetValue() methods?
        // FieldType check for instance?

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

        void ClearValues()
        {
            booleanValue = null;
            integerValue = null;
            decimalValue = null;
            dateTimeValue = null;
        }

        #endregion

    }
}
