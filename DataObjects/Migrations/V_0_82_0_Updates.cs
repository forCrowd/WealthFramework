using forCrowd.WealthEconomy.BusinessObjects.Entities;

namespace forCrowd.WealthEconomy.DataObjects.Migrations
{
    using BusinessObjects;
    using System.Linq;

    public static class V_0_82_0_Updates
    {
        public static void Apply(WealthEconomyContext context)
        {
            Framework.Security.LoginAs(1, "Administrator"); // Necessary to be able to access all user cells etc. (see UserQueryVisitor.cs)

            var cellStore = context.Set<ElementCell>();
            var fieldStore = context.Set<ElementField>();
            var resourcePoolStore = context.Set<ResourcePool>();
            var userCellStore = context.Set<UserElementCell>();

            // 1. Default initial value for all resource pools
            var resourcePools = resourcePoolStore.GetAll(false)
                .Where(resourcePool => resourcePool.InitialValue == 0)
                .AsEnumerable();

            foreach (var resourcePool in resourcePools)
            {
                resourcePool.InitialValue = 100;
            }

            // Save
            context.SaveChanges();

            // 2. Remove obsolete records
            var obsoleteUserCells = userCellStore
                .GetAll(false)
                .Where(userCell => userCell.ElementCell.ElementField.DataType == 2
                || userCell.ElementCell.ElementField.DataType == 3
                || userCell.ElementCell.ElementField.DataType == 5
                || userCell.ElementCell.ElementField.DataType == 11
                || userCell.ElementCell.ElementField.DataType == 12)
                .AsEnumerable();

            userCellStore.RemoveRange(obsoleteUserCells);

            // Save
            context.SaveChanges();

            var obsoleteCells = cellStore.GetAll(false)
                .Where(cell => cell.ElementField.DataType == 2
                || cell.ElementField.DataType == 3
                || cell.ElementField.DataType == 5
                || cell.ElementField.DataType == 11
                || cell.ElementField.DataType == 12)
                .AsEnumerable();

            cellStore.RemoveRange(obsoleteCells);

            // Save
            context.SaveChanges();

            var obsoleteFields = fieldStore.GetAll(false)
                .Where(field => field.DataType == 2
                || field.DataType == 3
                || field.DataType == 5
                || field.DataType == 11
                || field.DataType == 12)
                .AsEnumerable();

            fieldStore.RemoveRange(obsoleteFields);

            // Save
            context.SaveChanges();
        }
    }
}
