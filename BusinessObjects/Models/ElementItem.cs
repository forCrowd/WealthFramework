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
            // get { return ResourcePoolCell != null && ResourcePoolCell.DecimalValue.HasValue; }
            get { return ResourcePoolCell != null; }
        }

        public decimal ResourcePoolCellValue()
        {
            return HasResourcePoolCell
                ? ResourcePoolCell.Value()
                : 0;
        }

        public decimal ResourcePoolAddition()
        {
            return ResourcePoolCellValue() * Element.ResourcePool.ResourcePoolRatePercentage();
        }

        public decimal ResourcePoolValueIncludingAddition()
        {
            return ResourcePoolCellValue() + ResourcePoolAddition();
        }

        public ElementCell MultiplierCell
        {
            get { return ElementCellSet.SingleOrDefault(item => item.ElementField.ElementFieldType == (byte)ElementFieldTypes.Multiplier); }
        }

        public bool HasMultiplierCell
        {
            get { return MultiplierCell != null; }
            //get { return MultiplierCell != null && MultiplierCell.DecimalValue.HasValue; }
        }

        public decimal MultiplierCellValue(User multiplierUser)
        {
            if (!HasMultiplierCell)
                return 0;

            return MultiplierCell.Value(multiplierUser);
        }

        // TODO Sum is correct? Or Average?
        public decimal Value()
        {
            var indexCells = ElementCellSet.Where(item => item.ElementField.ElementFieldIndexSet.Any());
            return indexCells.Any()
                ? indexCells.Sum(item => item.Value())
                : 0;
        }

        public int ValueCount()
        {
            var indexCells = ElementCellSet.Where(item => item.ElementField.ElementFieldIndexSet.Any());
            return indexCells.Any()
                ? indexCells.Sum(item => item.ValueCount())
                : 0;
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

        public decimal TotalResourcePoolValue(User multiplierUser)
        {
            return ResourcePoolCellValue() * MultiplierCellValue(multiplierUser);
        }

        public decimal TotalResourcePoolAddition(User multiplierUser)
        {
            return ResourcePoolAddition() * MultiplierCellValue(multiplierUser);
        }

        public decimal TotalResourcePoolValueIncludingAddition(User multiplierUser)
        {
            return ResourcePoolValueIncludingAddition() * MultiplierCellValue(multiplierUser);
        }

        public decimal ElementFieldIndexIncome(User multiplierUser)
        {
            return ElementCellSet.Sum(item => item.ElementFieldIndexIncome(multiplierUser));
        }

        public decimal TotalIncome(User multiplierUser)
        {
            return TotalResourcePoolValue(multiplierUser) + ElementFieldIndexIncome(multiplierUser);
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
