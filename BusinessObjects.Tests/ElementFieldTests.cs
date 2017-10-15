using forCrowd.WealthEconomy.BusinessObjects.Entities;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace forCrowd.WealthEconomy.BusinessObjects.Tests
{
    [TestClass]
    public class ElementFieldTests
    {
        [TestMethod]
        public void NewElementField_ShouldCreate()
        {
            var user = new User("User", "user@email.com");
            new ResourcePool(user, "CMRP")
                .AddElement("Element")
                .AddField("Field", ElementFieldDataType.String);
        }
    }

    //public enum FieldTypes
    //{
    //    String,
    //    Decimal
    //}

    //public class Field
    //{
    //    public FieldTypes FieldType { get; set; }
    //}

    //public class Cell
    //{
    //    public Field Field { get; set; }
    //    public string StringValue { get; set; }
    //    public decimal DecimalValue { get; set; }
    //    public int RatingCount { get { return CellType.RatingCount; } }
    //    public decimal RatingAverage { get { return CellType.RatingAverage; } }
    //    //public object Value
    //    //{
    //    //    get { return CellType.
    //    //}

    //    Type GetCorrectType()
    //    {
    //        switch (Field.FieldType)
    //        {
    //            case FieldTypes.String:
    //                return typeof(string);
    //            case FieldTypes.Decimal:
    //                return typeof(decimal);
    //            default:
    //                throw new ArgumentOutOfRangeException();
    //        }
    //    }

    //    BaseCellType<T> GetCellType<T>() where T : struct
    //    {
    //        switch (Field.FieldType)
    //        {
    //            case FieldTypes.String:
    //                return new T(this);
    //            case FieldTypes.Decimal:
    //                return new T(this);
    //            default:
    //                throw new ArgumentOutOfRangeException();
    //        }
    //    }
    //}

    //public abstract class BaseCellType<T> where T : struct
    //{
    //    public BaseCellType(Cell cell)
    //    {
    //        Cell = cell;
    //    }

    //    public Cell Cell { get; private set; }

    //    public abstract object Value { get; set; }

    //    public abstract T ValueGen { get; set; }

    //    public virtual int RatingCount
    //    {
    //        get { return 0; }
    //    }

    //    public virtual decimal RatingAverage
    //    {
    //        get { return 0; }
    //    }
    //}

    //public class StringCellType : BaseCellType<System.String>
    //{
    //    public StringCellType(Cell cell) : base(cell) { }
    //    public override object Value
    //    {
    //        get
    //        {
    //            return Cell.StringValue;
    //        }
    //        set
    //        {
    //            Cell.StringValue = value.ToString();
    //        }
    //    }

    //    public override string ValueGen
    //    {
    //        get
    //        {
    //            return Cell.StringValue;
    //        }
    //        set
    //        {
    //            Cell.StringValue = value;
    //        }
    //    }
    //}

    //public class DecimalCellType : BaseCellType<decimal>
    //{
    //    public DecimalCellType(Cell cell) : base(cell) { }
    //    public override object Value
    //    {
    //        get
    //        {
    //            return Cell.DecimalValue;
    //        }
    //        set
    //        {
    //            Cell.DecimalValue = decimal.Parse(value.ToString());
    //        }
    //    }

    //    public override decimal ValueGen
    //    {
    //        get
    //        {
    //            return Cell.DecimalValue;
    //        }
    //        set
    //        {
    //            Cell.DecimalValue = value;
    //        }
    //    }
    //}

    //public abstract class XBaseField
    //{
    //    public abstract decimal GetValueAbstract();
    //    public virtual decimal GetValueVirtual()
    //    {
    //        return 0;
    //    }
    //}

    //public class XStrField : XBaseField
    //{
    //    public override decimal GetValueAbstract()
    //    {
    //        return 0;
    //    }

    //    public override decimal GetValueVirtual()
    //    {
    //        // more stuff..
    //        return base.GetValueVirtual();
    //    }
    //}
}
