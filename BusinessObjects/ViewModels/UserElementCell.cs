using System;

namespace BusinessObjects.ViewModels
{
    public class UserElementCell
    {
        public UserElementCell() { }

        public UserElementCell(BusinessObjects.UserElementCell userElementCell)
        {
            Id = userElementCell.Id;
            Rating = userElementCell.Rating;
            RowVersion = userElementCell.RowVersion;
        }

        public int Id { get; set; }
        public decimal Rating { get; set; }
        public byte[] RowVersion { get; set; }
    }
}
