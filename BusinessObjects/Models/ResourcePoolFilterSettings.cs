namespace BusinessObjects
{
    using System.ComponentModel.DataAnnotations.Schema;

    [NotMapped]
    public class ResourcePoolFilterSettings
    {
        public ResourcePoolFilterSettings()
        {
            ValueFilter = ValueFilters.AllUsersAverage;
        }

        //public User ValueUser { get; set; }
        public User CurrentUser { get; set; }
        public ValueFilters ValueFilter { get; set; }

        public enum ValueFilters : byte
        {
            AllUsersAverage = 1,
            OnlyCurrentUser = 2,
        }
    }
}
