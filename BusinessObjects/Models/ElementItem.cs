namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    [DisplayName("Element Item")]
    [BusinessObjects.Attributes.DefaultProperty("Name")]
    // [ODataControllerAuthorization("Administrator")]
    public class ElementItem : BaseEntity
    {
        string _name;

        public ElementItem()
        {
            ElementCellSet = new HashSet<ElementCell>();
            ElementCellSelectedElementItemSet = new HashSet<ElementCell>();
        }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        [Display(Name = "Element Item")]
        [Required]
        [StringLength(50)]
        public string Name
        {
            get { return _name; }
            set
            {
                _name = value;

                // Always add/update name cell
                if (Element != null)
                {
                    var nameField = Element.ElementFieldSet.SingleOrDefault(field => field.Name == "Name");

                    if (nameField != null)
                    {
                        if (NameCell == null)
                            AddCell(new ElementCell() { ElementField = nameField });
                        else
                            NameCell.StringValue = value;
                    }
                }
            }
        }

        public int ElementId { get; set; }

        public virtual Element Element { get; set; }
        public virtual ICollection<ElementCell> ElementCellSet { get; set; }
        [InverseProperty("SelectedElementItem")]
        public virtual ICollection<ElementCell> ElementCellSelectedElementItemSet { get; set; }

        /* */

        public IEnumerable<ElementCell> BasicElementCellSet
        {
            get
            {
                return ElementCellSet.Where(item => item.ElementField.ElementFieldType != (byte)ElementFieldType.ResourcePool
                    && item.ElementField.ElementFieldType != (byte)ElementFieldType.Multiplier);
            }
        }

        public ElementCell NameCell
        {
            get { return ElementCellSet.SingleOrDefault(item => item.ElementField.Name == "Name"); }
        }

        public ElementCell ResourcePoolCell
        {
            get { return ElementCellSet.SingleOrDefault(item => item.ElementField.ElementFieldType == (byte)ElementFieldType.ResourcePool); }
        }

        public bool HasResourcePoolCell
        {
            get { return ResourcePoolCell != null && ResourcePoolCell.DecimalValue.HasValue; }
        }

        public decimal ResourcePoolCellValue
        {
            get
            {
                return HasResourcePoolCell
                    ? ResourcePoolCell.DecimalValue.Value
                    : 0;
            }
        }

        public decimal ResourcePoolAddition
        {
            get
            {
                return ResourcePoolCellValue * Element.ResourcePool.ResourcePoolRatePercentage;
            }
        }

        public decimal ResourcePoolValueIncludingAddition
        {
            get
            {
                return ResourcePoolCellValue + ResourcePoolAddition;
            }
        }

        public ElementCell MultiplierCell
        {
            get { return ElementCellSet.SingleOrDefault(item => item.ElementField.ElementFieldType == (byte)ElementFieldType.Multiplier); }
        }

        public bool HasMultiplierCell
        {
            get { return MultiplierCell != null && MultiplierCell.DecimalValue.HasValue; }
        }

        public decimal MultiplierCellValue
        {
            get
            {
                if (!HasMultiplierCell)
                    return 0;

                return MultiplierCell.DecimalValue.Value;
            }
        }

        public decimal TotalRating
        {
            get
            {
                var indexCellSet = ElementCellSet
                    .Where(item => Element.ResourcePool.ResourcePoolIndexSet
                        .Any(index => index.ElementField == item.ElementField));

                return indexCellSet.Sum(item => item.ElementField.ElementFieldType == (byte)ElementFieldType.String
                    ? item.UserElementCellSet.Sum(userCell => userCell.Rating)
                    : 0);
                // return ElementCellSet.Where(item => item.ElementField.)
            }
        }

        public decimal TotalResourcePoolValue
        {
            get
            {
                return ResourcePoolCellValue * MultiplierCellValue;
            }
        }

        public decimal TotalResourcePoolAddition
        {
            get
            {
                return ResourcePoolAddition * MultiplierCellValue;
            }
        }

        public decimal TotalResourcePoolValueIncludingAddition
        {
            get
            {
                return ResourcePoolValueIncludingAddition * MultiplierCellValue;
            }
        }

        public decimal ResourcePoolIndexIncome
        {
            get { return ElementCellSet.Sum(item => item.ResourcePoolIndexIncome); }
        }

        public decimal TotalIncome
        {
            get { return TotalResourcePoolValue + ResourcePoolIndexIncome; }
        }

        #region - Methods -

        public ElementItem AddCell(ElementCell cell)
        {
            // Validate
            // TODO Cell.Field null check?
            if (ElementCellSet.Any(item => item.ElementField == cell.ElementField))
                throw new Exception("An element item can't have more than one cell for the same field");

            cell.ElementItem = this;
            ElementCellSet.Add(cell);
            return this;
        }

        #endregion
    }
}
