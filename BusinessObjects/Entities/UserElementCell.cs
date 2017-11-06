using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using forCrowd.WealthEconomy.Framework;

namespace forCrowd.WealthEconomy.BusinessObjects.Entities
{
    [UserAware("UserId")]
    public class UserElementCell : BaseEntity
    {
        [Obsolete("Parameterless constructors used by OData & EF. Make them private when possible.")]
        public UserElementCell()
        { }

        public UserElementCell(ElementCell elementCell) : this()
        {
            Validations.ArgumentNullOrDefault(elementCell, nameof(elementCell));

            ElementCell = elementCell;
        }

        [Key]
        [Column(Order = 1)]
        public int UserId { get; set; }

        [Key]
        [Column(Order = 2)]
        public int ElementCellId { get; set; }

        public decimal? DecimalValue { get; set; }

        public virtual User User { get; set; }

        public virtual ElementCell ElementCell { get; set; }

        #region - Methods -

        // TODO Validations for SetValue() methods?
        // FieldType check for instance?

        internal void SetValue(decimal value)
        {
            DecimalValue = value;
        }

        #endregion

    }
}
