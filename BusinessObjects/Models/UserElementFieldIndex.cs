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

    [DisplayName("User Element Field Index")]
    [BusinessObjects.Attributes.DefaultProperty("Id")]
    public class UserElementFieldIndex : BaseEntity
    {
        [Obsolete("Parameterless constructors used by OData & EF. Make them private when possible.")]
        public UserElementFieldIndex()
        { }

        public UserElementFieldIndex(UserResourcePool userResourcePool, ElementFieldIndex elementFieldIndex, decimal rating)
        {
            Validations.ArgumentNullOrDefault(userResourcePool, "userResourcePool");
            Validations.ArgumentNullOrDefault(elementFieldIndex, "elementFieldIndex");

            UserResourcePool = userResourcePool;
            ElementFieldIndex = elementFieldIndex;
            Rating = rating;
        }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public int Id { get; set; }

        [Index("IX_UserResourcePoolIdElementFieldIndexId", 1, IsUnique = true)]
        public int UserResourcePoolId { get; set; }

        [Index("IX_UserResourcePoolIdElementFieldIndexId", 2, IsUnique = true)]
        public int ElementFieldIndexId { get; set; }

        public decimal Rating { get; set; }

        public virtual UserResourcePool UserResourcePool { get; set; }
        public virtual ElementFieldIndex ElementFieldIndex { get; set; }

        public string Name
        {
            get { return string.Format("{0} - {1}", UserResourcePool.Name, ElementFieldIndex.Name); }
        }
    }
}
