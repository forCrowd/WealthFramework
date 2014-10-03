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
//        public UserResourcePoolElementItemElementField(UserResourcePool userResourcePool, ElementItemElementField elementItemElementField)
//        {
//            // Validations
//            if (UserResourcePool == null)
//                throw new ArgumentNullException("UserResourcePool"); 
            
//            if (elementItemElementField == null)
//                throw new ArgumentNullException("elementItemElementField");

//            if (elementItemElementField.ElementField.ElementFieldType != (byte)ElementFieldType.ResourcePool)
//                throw new ArgumentException(string.Format("Invalid element field type: {0}", elementItemElementField.ElementField.ElementFieldType), "elementItemElementField");

//            UserResourcePool = userResourcePool;
//            ElementItemElementField = elementItemElementField;
//        }

//        internal UserResourcePool UserResourcePool { get; private set; }
//        internal ElementItemElementField ElementItemElementField { get; private set; }

//        /* */

//        //public decimal ResourcePoolAddition
//        //{
//        //    get
//        //    {
//        //        return ElementItemElementField.DecimalValue.HasValue
//        //            ? ElementItemElementField.DecimalValue.Value * UserResourcePool.ResourcePoolRatePercentage
//        //            : 0;
//        //    }
//        //}

//        //public decimal ValueIncludingResourcePoolAddition
//        //{
//        //    get
//        //    {
//        //        return ElementItemElementField.DecimalValue.HasValue
//        //            ? ElementItemElementField.DecimalValue.Value + ResourcePoolAddition
//        //            : 0;
//        //    }
//        //}

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
