//namespace BusinessObjects
//{
//    using System.Linq;

//    public class StringCellType : BaseCellType
//    {
//        public StringCellType(ElementCell cell) : base(cell) { }

//        public override int RatingCount
//        {
//            get { return Cell.UserElementCellSet.Count(); }
//        }

//        public override decimal RatingAverage
//        {
//            get
//            {
//                return Cell.UserElementCellSet.Any()
//                    ? Cell.UserElementCellSet.Average(item => item.RatingNew)
//                    : 0;
//            }
//        }
//    }
//}
