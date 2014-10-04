//namespace BusinessObjects
//{
//    using BusinessObjects;
//    using BusinessObjects.Attributes;
//    using System;
//    using System.Collections.Generic;
//    using System.ComponentModel;
//    using System.ComponentModel.DataAnnotations;
//    using System.ComponentModel.DataAnnotations.Schema;
//    using System.Linq;

//    //[DisplayName("User Organization")]
//    //[BusinessObjects.Attributes.DefaultProperty("Name")]
//    public class UserResourcePoolElementCell
//    {
//        public UserResourcePoolElementCell(BusinessObjects.UserResourcePool userResourcePool, BusinessObjects.ElementCell elementCell)
//        {
//            // Validations
//            if (UserResourcePool == null)
//                throw new ArgumentNullException("UserResourcePool"); 

//            if (elementCell == null)
//                throw new ArgumentNullException("elementCell");

//            if (!elementCell.ElementField.IsResourcePoolField)
//                throw new ArgumentException("Invalid element field: IsResourcePoolField = false", "elementCell"); 

//            if (elementCell.ElementField.ElementFieldType != (byte)ElementFieldType.Decimal)
//                throw new ArgumentException(string.Format("Invalid element field type: {0}", elementCell.ElementField.ElementFieldType), "elementCell");

//            // ResourcePoolAddition = element

//            UserResourcePool = userResourcePool;
//            ElementCell = elementCell;
//        }

//        /* */

//        public decimal ResourcePoolAddition { get; set; }

//        public decimal ValueIncludingResourcePoolAddition { get; set; }

//        // TODO Multiply
//        // public decimal TotalResourcePoolAddition
//        // public decimal TotalValueIncludingResourcePoolAddition

//        ///// <summary>
//        ///// Dynamic index income
//        ///// </summary>
//        //public decimal IndexIncome
//        //{
//        //    get { return UserResourcePoolIndexOrganizationSet.Sum(item => item.IndexIncome); }
//        //}

//        //public decimal TotalIncome
//        //{
//        //    get
//        //    {
//        //        return
//        //            //TotalProfit
//        //            TotalSalesRevenue
//        //            + IndexIncome;
//        //    }
//        //}

//    }
//}
