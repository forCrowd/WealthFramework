namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using Framework;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;

    [BusinessObjects.Attributes.DefaultProperty("Name")]
    // [ODataControllerAuthorization("Administrator")]
    public class Element : BaseEntity
    {
        [Obsolete("Parameterless constructors used by OData & EF. Make them private when possible.")]
        public Element()
        { }

        public Element(ResourcePool resourcePool, string name)
        {
            Validations.ArgumentNullOrDefault(resourcePool, "resourcePool");
            Validations.ArgumentNullOrDefault(name, "name");

            ResourcePool = resourcePool;
            Name = name;
            IsMainElement = !ResourcePool.ElementSet.Any();
            
            ElementFieldSet = new HashSet<ElementField>();
            AddField("Name", ElementFieldTypes.String);

            ElementItemSet = new HashSet<ElementItem>();
        }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        public int ResourcePoolId { get; set; }

        [Display(Name = "Element")]
        [Required]
        [StringLength(50)]
        public string Name { get; set; }

        [Display(Name = "Main Element")]
        public bool IsMainElement { get; set; }

        public virtual ResourcePool ResourcePool { get; set; }
        public virtual ICollection<ElementField> ElementFieldSet { get; set; }
        public virtual ICollection<ElementItem> ElementItemSet { get; set; }

        #region - ReadOnly Properties -

        /// <summary>
        /// REMARK: In other index types, this value is calculated on ElementFieldIndex class level, under IndexValue property
        /// </summary>
        //public decimal RatingAverage
        //{
        //    get { return ElementItemSet.Sum(item => item.RatingAverage); }
        //}

        public IEnumerable<ElementFieldIndex> ElementFieldIndexSet
        {
            get
            {
                return ElementFieldSet
                    .Where(item => item.ElementFieldIndex != null)
                    .Select(field => field.ElementFieldIndex);
            }
        }

        public ElementField NameField
        {
            // TODO Is it correct approach?
            get { return ElementFieldSet.Single(item => item.SortOrder == 1); }
        }

        public bool HasNameField
        {
            get { return NameField != null; }
        }

        public ElementField ResourcePoolField
        {
            get { return ElementFieldSet.SingleOrDefault(item => item.ElementFieldType == (byte)ElementFieldTypes.ResourcePool); }
        }

        public bool HasResourcePoolField
        {
            get { return ResourcePoolField != null; }
        }

        public string ResourcePoolFieldName
        {
            get
            {
                if (!HasResourcePoolField)
                    return string.Empty;

                return ResourcePoolField.Name;
            }
        }

        public decimal ResourcePoolValue()
        {
            return ElementItemSet.Sum(item => item.ResourcePoolValue());
        }

        public decimal ResourcePoolAddition()
        {
            return ElementItemSet.Sum(item => item.ResourcePoolAddition());
        }

        public decimal ResourcePoolValueIncludingAddition()
        {
            return ElementItemSet.Sum(item => item.ResourcePoolValueIncludingAddition());
        }

        public ElementField MultiplierField
        {
            get { return ElementFieldSet.SingleOrDefault(item => item.ElementFieldType == (byte)ElementFieldTypes.Multiplier); }
        }

        public bool HasMultiplierField
        {
            get
            {
                return MultiplierField != null;
            }
        }

        public string MultiplierFieldName
        {
            get
            {
                if (!HasMultiplierField)
                    return string.Empty;

                return MultiplierField.Name;
            }
        }

        public decimal MultiplierValue(User multiplierUser)
        {
            return ElementItemSet.Sum(item => item.MultiplierValue(multiplierUser));
        }

        public decimal TotalResourcePoolValue(User multiplierUser)
        {
            return ElementItemSet.Sum(item => item.TotalResourcePoolValue(multiplierUser));
        }

        public decimal TotalResourcePoolAddition(User multiplierUser)
        {
            return ElementItemSet.Sum(item => item.TotalResourcePoolAddition(multiplierUser));
        }

        public decimal TotalResourcePoolValueIncludingAddition(User multiplierUser)
        {
            return ElementItemSet.Sum(item => item.TotalResourcePoolValueIncludingAddition(multiplierUser));
        }

        public decimal TotalIncome(User multiplierUser)
        {
            return ElementItemSet.Sum(item => item.TotalIncome(multiplierUser));
        }

        #endregion

        #region - Methods -

        public decimal IndexRatingAverage()
        {
            return ElementFieldIndexSet.Sum(item => item.IndexRatingAverage());
        }

        //public ElementField AddField(string name, ElementFieldTypes fieldType)
        //{
        //    var sortOrder = (byte)(ElementFieldSet.Count + 1);
        //    var field = new ElementField(this, name, fieldType, sortOrder);
        //    return AddField(field);
        //}

        public ElementField AddField(string name, ElementFieldTypes fieldType, bool? fixedValue = null)
        {
            var sortOrder = Convert.ToByte(ElementFieldSet.Count + 1); 
            var field = new ElementField(this, name, fieldType, sortOrder, fixedValue);
            
            //return AddField(field);
        //}

        //ElementField AddField(ElementField field)
        //{
            // TODO Validation - Same name?

            ElementFieldSet.Add(field);
            
            return field;
        }

        public ElementItem AddItem(string name)
        {
            // TODO Validation - Same name?
            
            var item = new ElementItem(this, name);
            ElementItemSet.Add(item);
            return item;
        }

        #endregion
    }
}
