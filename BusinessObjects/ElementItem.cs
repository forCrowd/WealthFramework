namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;

    [DisplayName("Element Item")]
    [BusinessObjects.Attributes.DefaultProperty("Name")]
    // [ODataControllerAuthorization("Administrator")]
    public class ElementItem : BaseEntity
    {
        public ElementItem()
        {
            ElementItemElementFieldSet = new HashSet<ElementItemElementField>();
            OrganizationElementItemSet = new HashSet<OrganizationElementItem>();
            UserElementItemSet = new HashSet<UserElementItem>();
        }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        [Display(Name = "Element Item")]
        [Required]
        [StringLength(50)]
        public string Name { get; set; }

        public int ElementId { get; set; }

        public virtual Element Element { get; set; }
        public virtual ICollection<ElementItemElementField> ElementItemElementFieldSet { get; set; }
        public virtual ICollection<OrganizationElementItem> OrganizationElementItemSet { get; set; }
        public virtual ICollection<UserElementItem> UserElementItemSet { get; set; }

        /* */

        public int RatingCount
        {
            get { return UserElementItemSet.Count(); }
        }

        public decimal RatingAverage
        {
            get
            {
                return UserElementItemSet.Any()
                    ? UserElementItemSet.Average(item => item.Rating)
                    : 0;
            }
        }

        public decimal RatingPercentage
        {
            get
            {
                return Element.RatingAverage == 0
                    ? 0
                    : RatingAverage / Element.RatingAverage;
            }
        }

        public IEnumerable<ElementItemElementField> BasicElementItemElementFieldSet
        {
            get
            {
                return ElementItemElementFieldSet.Where(item => item.ElementField.ElementFieldType != (byte)ElementFieldType.ResourcePool
                    && item.ElementField.ElementFieldType != (byte)ElementFieldType.Multiplier);
            }
        }

        public ElementItemElementField ResourcePoolFieldItem
        {
            get { return ElementItemElementFieldSet.SingleOrDefault(item => item.ElementField.ElementFieldType == (byte)ElementFieldType.ResourcePool); }
        }

        public bool HasResourcePoolFieldItem
        {
            get { return ResourcePoolFieldItem != null && ResourcePoolFieldItem.DecimalValue.HasValue; }
        }

        public decimal ResourcePoolFieldItemValue
        {
            get
            {
                if (!HasResourcePoolFieldItem)
                    return 0;

                return ResourcePoolFieldItem.DecimalValue.Value;
            }
        }

        public decimal ResourcePoolAddition
        {
            get
            {
                if (!HasResourcePoolFieldItem)
                    return 0;

                return ResourcePoolFieldItemValue * ResourcePoolFieldItem.ElementField.Element.ResourcePool.ResourcePoolRatePercentage;
            }
        }

        public decimal ResourcePoolFieldItemValueIncludingResourcePoolAddition
        {
            get
            {
                if (!HasResourcePoolFieldItem)
                    return 0;

                return ResourcePoolFieldItemValue + ResourcePoolAddition;
            }
        }

        public ElementItemElementField MultiplierFieldItem
        {
            get { return ElementItemElementFieldSet.SingleOrDefault(item => item.ElementField.ElementFieldType == (byte)ElementFieldType.Multiplier); }
        }

        public bool HasMultiplierFieldItem
        {
            get { return MultiplierFieldItem != null && MultiplierFieldItem.DecimalValue.HasValue; }
        }

        public decimal MultiplierFieldItemValue
        {
            get
            {
                if (!HasMultiplierFieldItem)
                    return 0;

                return MultiplierFieldItem.DecimalValue.Value;
            }
        }

        public decimal TotalResourcePoolFieldItemValue
        {
            get
            {
                if (!HasResourcePoolFieldItem || !HasMultiplierFieldItem)
                    return 0;

                return ResourcePoolFieldItemValue * MultiplierFieldItemValue;
            }
        }

        public decimal TotalResourcePoolAddition
        {
            get
            {
                if (!HasMultiplierFieldItem)
                    return 0;

                return ResourcePoolAddition * MultiplierFieldItemValue;
            }
        }

        public decimal TotalResourcePoolFieldItemValueIncludingResourcePoolAddition
        {
            get
            {
                if (!HasMultiplierFieldItem)
                    return 0;

                return ResourcePoolFieldItemValueIncludingResourcePoolAddition * MultiplierFieldItemValue;
            }
        }

        public decimal ResourcePoolIndexIncome
        {
            get { return ElementItemElementFieldSet.Sum(item => item.ResourcePoolIndexIncome); }
        }

        public decimal TotalIncome
        {
            get { return TotalResourcePoolFieldItemValue + ResourcePoolIndexIncome; }
        }
    }
}
