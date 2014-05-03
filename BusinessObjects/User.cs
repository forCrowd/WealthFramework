namespace BusinessObjects
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using BusinessObjects.Metadata;

    [MetadataType(typeof(UserMetadata))]
    public partial class User : IEntity
    {
        public User()
        {
            this.UserLicenseRatingSet = new HashSet<UserLicenseRating>();
            this.UserOrganizationSet = new HashSet<UserOrganization>();
            this.UserResourcePoolSet = new HashSet<UserResourcePool>();
            this.UserSectorRatingSet = new HashSet<UserSectorRating>();
        }

        public int Id { get; set; }
        public string AspNetUserId { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string Notes { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime ModifiedOn { get; set; }
        public Nullable<DateTime> DeletedOn { get; set; }

        public virtual ICollection<UserLicenseRating> UserLicenseRatingSet { get; set; }
        public virtual ICollection<UserOrganization> UserOrganizationSet { get; set; }
        public virtual ICollection<UserResourcePool> UserResourcePoolSet { get; set; }
        public virtual ICollection<UserSectorRating> UserSectorRatingSet { get; set; }
    }
}
