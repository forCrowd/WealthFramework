namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using Framework;
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

        [Obsolete("Parameterless constructors used by OData & EF. Make them private when possible.")]
        public ElementItem()
        {
            ElementCellSet = new HashSet<ElementCell>();
        }

        public ElementItem(Element element, string name)
        {
            Validations.ArgumentNullOrDefault(element, "element");
            Validations.ArgumentNullOrDefault(name, "name");

            Element = element;

            ElementCellSet = new HashSet<ElementCell>();
            
            // Add a fixed 'Name' cell
            AddCell(Element.NameField);
            Name = name;

            ElementCellSelectedElementItemSet = new HashSet<ElementCell>();

            Name = name;
        }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        public int ElementId { get; set; }
        
        [Display(Name = "Element Item")]
        [Required]
        [StringLength(50)]
        public string Name
        {
            get { return _name; }
            set
            {
                _name = value;

                // Always update 'Name' cell as well
                if (NameCell != null)
                    NameCell.SetValue(value);
            }
        }

        public virtual Element Element { get; set; }
        public virtual ICollection<ElementCell> ElementCellSet { get; set; }
        [InverseProperty("SelectedElementItem")]
        public virtual ICollection<ElementCell> ElementCellSelectedElementItemSet { get; set; }

        /* */

        public IEnumerable<ElementCell> BasicElementCellSet
        {
            get
            {
                return ElementCellSet.Where(item => item.ElementField.ElementFieldType != (byte)ElementFieldTypes.ResourcePool
                    && item.ElementField.ElementFieldType != (byte)ElementFieldTypes.Multiplier);
            }
        }

        public ElementCell NameCell
        {
            get { return ElementCellSet.SingleOrDefault(item => item.ElementField.Name == "Name"); }
        }

        public ElementCell ResourcePoolCell
        {
            get { return ElementCellSet.SingleOrDefault(item => item.ElementField.ElementFieldType == (byte)ElementFieldTypes.ResourcePool); }
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
            get { return ElementCellSet.SingleOrDefault(item => item.ElementField.ElementFieldType == (byte)ElementFieldTypes.Multiplier); }
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

        public int RatingCount
        {
            get
            {
                var indexCells = ElementCellSet.Where(item => Element.ResourcePool.ResourcePoolIndexSet.Any(index => index.ElementField == item.ElementField));
                return indexCells.Any()
                    ? indexCells.Sum(item => item.RatingCount)
                    : 0;
            }
        }

        // TODO Sum is correct? Or Average?
        public decimal RatingAverage
        {
            get
            {
                var indexCells = ElementCellSet.Where(item => Element.ResourcePool.ResourcePoolIndexSet.Any(index => index.ElementField == item.ElementField));
                return indexCells.Any()
                    ? indexCells.Sum(item => item.RatingAverage)
                    : 0;
            }
        }

        //// TODO Review!
        //public decimal TotalRating
        //{
        //    get
        //    {
        //        var indexCellSet = ElementCellSet
        //            .Where(item => Element.ResourcePool.ResourcePoolIndexSet
        //                .Any(index => index.ElementField == item.ElementField));

        //        return indexCellSet.Sum(item => item.ElementField.ElementFieldType == (byte)ElementFieldType.String
        //            ? item.UserElementCellSet.Average(userCell => userCell.Rating)
        //            : 0);
        //    }
        //}

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

        public ElementCell AddCell(ElementField field)
        {
            Validations.ArgumentNullOrDefault(field, "field");

            if (ElementCellSet.Any(item => item.ElementField == field))
                throw new Exception("An element item can't have more than one cell for the same field.");

            var cell = new ElementCell(field, this);
            field.ElementCellSet.Add(cell);
            ElementCellSet.Add(cell);
            return cell;
        }

        #endregion
    }
}
