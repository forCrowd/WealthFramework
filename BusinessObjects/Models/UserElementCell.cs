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

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        [Index("IX_UserIdElementCellId", 1, IsUnique = true)]
        public int UserId { get; set; }

        [Index("IX_UserIdElementCellId", 2, IsUnique = true)]
        public int ElementCellId { get; set; }

        public Nullable<bool> BooleanValue { get; set; }
        public Nullable<int> IntegerValue { get; set; }
        public Nullable<decimal> DecimalValue { get; set; }
        public Nullable<DateTime> DateTimeValue { get; set; }

        //public decimal Rating { get; set; }
        
        public decimal Rating
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
                        throw new InvalidOperationException("Rating property is not available for this field type");
                    default:
                        throw new ArgumentOutOfRangeException();
                }
            }
        }

        public virtual User User { get; set; }

        public virtual ElementCell ElementCell { get; set; }

        #region - Methods -

        public UserElementCell SetValue(bool? value)
        {
            BooleanValue = value;
            return this;
        }

        public UserElementCell SetValue(int? value)
        {
            IntegerValue = value;
            return this;
        }

        public UserElementCell SetValue(decimal? value)
        {
            DecimalValue = value;
            return this;
        }

        public UserElementCell SetValue(DateTime? value)
        {
            DateTimeValue = value;
            return this;
        }

        #endregion

    }
}
