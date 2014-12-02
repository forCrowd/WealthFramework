namespace BusinessObjects
{
    using BusinessObjects.Attributes;
    using Framework;
    using Microsoft.AspNet.Identity.EntityFramework;
    using System;
    using System.ComponentModel.DataAnnotations;

    public class Role : IdentityRole<int, UserRole>, IEntity
    {
        [Obsolete("Parameterless constructors used in Web - Controllers. Make them private them when possible")]
        public Role()
            //: this("Default Role")
        { }

        public Role(string name)
        {
            Validations.ArgumentNullOrDefault(name, "name");

            Name = name;
        }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public System.DateTime CreatedOn { get; set; }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public System.DateTime ModifiedOn { get; set; }

        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public System.DateTime? DeletedOn { get; set; }

        [Timestamp]
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public byte[] RowVersion { get; set; }
    }
}
