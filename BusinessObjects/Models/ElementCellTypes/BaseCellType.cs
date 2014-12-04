namespace BusinessObjects
{
    using Framework;

    public abstract class BaseCellType
    {
        public BaseCellType(ElementCell cell)
        {
            Validations.ArgumentNullOrDefault(cell, "cell");

            Cell = cell;
        }

        public ElementCell Cell { get; private set; }

        public abstract int RatingCount { get; }
        public abstract decimal RatingAverage { get; }
    }
}
