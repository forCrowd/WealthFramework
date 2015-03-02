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
            ParentCellSet = new HashSet<ElementCell>();
        }

        public ElementItem(Element element, string name) : this()
        {
            Validations.ArgumentNullOrDefault(element, "element");
            Validations.ArgumentNullOrDefault(name, "name");

            Element = element;

            // Add a fixed 'Name' cell
            AddCell(Element.NameField);
            Name = name;

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
        public virtual ICollection<ElementCell> ParentCellSet { get; set; }

        /* */

        public ElementCell NameCell
        {
            // TODO Is it correct approach?
            get { return ElementCellSet.SingleOrDefault(item => item.ElementField.SortOrder == 1); }
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

        public decimal ResourcePoolValue()
        {
            return HasResourcePoolCell
                ? ResourcePoolCell.Rating
                : 0;
        }

        public decimal ResourcePoolAddition()
        {
            return ResourcePoolValue() * Element.ResourcePool.ResourcePoolRatePercentage();
        }

        public decimal ResourcePoolValueIncludingAddition()
        {
            return ResourcePoolValue() + ResourcePoolAddition();
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

        public decimal MultiplierValue()
        {
            if (!HasMultiplierCell || MultiplierCell.UserElementCell == null || !MultiplierCell.UserElementCell.DecimalValue.HasValue)
                return 1;

            //if (Element.ResourcePool.FilterSettings.MultiplierUser == null)
            //    throw new InvalidOperationException("MultiplierValue property cannot be retrieved without specifying MultiplierUser filter on ResourcePool object");

            return MultiplierCell.UserElementCell.DecimalValue.Value;
        }

        //public decimal Value()
        //{
        //    var indexCells = ElementCellSet.Where(item => item.ElementField.ElementFieldIndexSet.Any());
        //    return indexCells.Any()
        //        ? indexCells.Sum(item => item.ValueOld())
        //        : 0;
        //}

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

        public decimal TotalResourcePoolValue()
        {
            return ResourcePoolValue() * MultiplierValue();
        }

        public decimal TotalResourcePoolAddition()
        {
            return ResourcePoolAddition() * MultiplierValue();
        }

        public decimal TotalResourcePoolValueIncludingAddition()
        {
            return ResourcePoolValueIncludingAddition() * MultiplierValue();
        }

        public decimal IndexIncome()
        {
            return ElementCellSet.Sum(item => item.IndexIncome());
        }

        public decimal TotalIncome()
        {
            return TotalResourcePoolValue() + IndexIncome();
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
