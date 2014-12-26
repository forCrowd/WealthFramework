using System;

namespace BusinessObjects.ViewModels
{
    public class UserElementCell
    {
        public UserElementCell() { }

        public UserElementCell(BusinessObjects.UserElementCell userElementCell)
        {
            Id = userElementCell.Id;
            Value = userElementCell.Value;
            RowVersion = userElementCell.RowVersion;
        }

        public int Id { get; set; }
        public decimal Value { get; set; }
        public byte[] RowVersion { get; set; }
    }
}
