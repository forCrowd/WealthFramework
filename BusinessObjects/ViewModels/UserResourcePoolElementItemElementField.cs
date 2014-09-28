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
//    public class UserResourcePoolElementItemElementField
//    {
//        public UserResourcePoolElementItemElementField(BusinessObjects.UserResourcePool userResourcePool, BusinessObjects.ElementItemElementField elementItemElementField)
//        {
//            // Validations
//            if (UserResourcePool == null)
//                throw new ArgumentNullException("UserResourcePool"); 
            
//            if (elementItemElementField == null)
//                throw new ArgumentNullException("elementItemElementField");

//            if (!elementItemElementField.ElementField.IsResourcePoolField)
//                throw new ArgumentException("Invalid element field: IsResourcePoolField = false", "elementItemElementField"); 
            
//            if (elementItemElementField.ElementField.ElementFieldType != (byte)ElementFieldType.Decimal)
//                throw new ArgumentException(string.Format("Invalid element field type: {0}", elementItemElementField.ElementField.ElementFieldType), "elementItemElementField");

//            // ResourcePoolAddition = element

//            UserResourcePool = userResourcePool;
//            ElementItemElementField = elementItemElementField;
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
