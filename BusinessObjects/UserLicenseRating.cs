namespace BusinessObjects
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using BusinessObjects.Metadata;

    [MetadataType(typeof(UserLicenseRatingMetadata))]
    public partial class UserLicenseRating : BaseEntity
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public short LicenseId { get; set; }
        public decimal Rating { get; set; }
        public virtual License License { get; set; }
        public virtual User User { get; set; }
    }
}
