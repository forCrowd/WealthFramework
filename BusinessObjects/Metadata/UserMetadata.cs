namespace BusinessObjects.Metadata
{
    using BusinessObjects.Metadata.Attributes;
    using System.ComponentModel.DataAnnotations;

    [DefaultProperty("Email")]
    public class UserMetadata
    {
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public object Id { get; set; }

        [Display(Name = "Email")]
        [Required]
        public object Email { get; set; }

        [Display(Name = "Password")]
        [DisplayOnListView(false)]
        [Required]
        public string Password { get; set; }

        [Display(Name = "First Name")]
        public object FirstName { get; set; }
    
        [Display(Name = "Middle Name")]
        public object MiddleName { get; set; }
    
        [Display(Name = "Last Name")]
        public object LastName { get; set; }

        [Display(Name = "User Account Type")]
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public object UserAccountTypeId { get; set; }

        [DisplayOnListView(false)]
        public object Notes { get; set; }

        [Display(Name = "Created On")]
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public object CreatedOn { get; set; }

        [Display(Name = "Modified On")]
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public object ModifiedOn { get; set; }

        [Display(Name = "Deleted On")]
        [DisplayOnListView(false)]
        [DisplayOnEditView(false)]
        public object DeletedOn { get; set; }
    }
}
