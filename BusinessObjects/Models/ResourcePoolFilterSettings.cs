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

        public User CurrentUser { get; set; }
        public ValueFilters ValueFilter { get; set; }

        public enum ValueFilters : byte
        {
            OnlyCurrentUser = 1,
            AllUsersAverage = 2,
        }
    }
}
