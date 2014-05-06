namespace BusinessObjects
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using BusinessObjects.Metadata;

    [MetadataType(typeof(UserSectorRatingMetadata))]
    public partial class UserSectorRating : BaseEntity
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public short SectorId { get; set; }
        public decimal Rating { get; set; }
        
        
        

        public virtual Sector Sector { get; set; }
        public virtual User User { get; set; }
    }
}
