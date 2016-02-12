namespace forCrowd.WealthEconomy.DataObjects
{
    using BusinessObjects;
    using System;
    using System.Data.Entity;
    using System.Linq;

    public partial class ResourcePoolRepository
    {
        #region - Samples -

        public ResourcePool CreateBillionDollarQuestion(User user)
        {
            const int numberOfItems = 5;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user: user,
                resourcePoolName: "Billion Dollar Question",
                useFixedResourcePoolRate: true,
                mainElementName: "Issues",
                addDirectIncomeField: false,
                addMultiplierField: false,
                addImportanceIndex: true,
                numberOfItems: numberOfItems);

            resourcePool.InitialValue = 1000000000;

            // Main element
            var mainElement = resourcePool.ElementSet.First();

            // Fields
            mainElement.ElementFieldSet.Single(item => item.IndexEnabled).Name = "Rating";
            mainElement.ElementFieldSet.Single(item => item.IndexEnabled).IndexCalculationType = (byte)ElementFieldIndexCalculationType.Passive;

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).First().Name = "Cosmetics: Curing baldness";
            mainElement.ElementItemSet.Skip(1).First().Name = "Education: Reducing illiteracy";
            mainElement.ElementItemSet.Skip(2).First().Name = "Entertainment: Enhancing video gaming experience";
            mainElement.ElementItemSet.Skip(3).First().Name = "Healthcare: Curing cancer";
            mainElement.ElementItemSet.Skip(4).First().Name = "Poverty: Clean water for everyone";

            // Return
            return resourcePool;
        }

        public ResourcePool CreateUPOSample(User user)
        {
            const int numberOfItems = 1;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user: user,
                resourcePoolName: "UPO",
                useFixedResourcePoolRate: true,
                mainElementName: "Organization",
                addDirectIncomeField: true,
                addMultiplierField: true,
                addImportanceIndex: false,
                numberOfItems: numberOfItems);

            // Main element
            var mainElement = resourcePool.ElementSet.First();
            mainElement.DirectIncomeField.Name = "Sales Price"; // TODO It does not fit! Update this after having Initial Amount on RP!
            mainElement.MultiplierField.Name = "Number of Sales";

            // Items, cell, user cells
            // TODO How about ToList()[0]?
            mainElement.ElementItemSet.First().Name = "UPO";

            // Return
            return resourcePool;
        }

        public ResourcePool CreateBasicsExistingSystemSample(User user)
        {
            const int numberOfItems = 4;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user: user,
                resourcePoolName: "Basics - Existing Model",
                useFixedResourcePoolRate: true,
                mainElementName: "Organization",
                addDirectIncomeField: true,
                addMultiplierField: true,
                addImportanceIndex: false,
                numberOfItems: numberOfItems);

            // Main element
            var mainElement = resourcePool.ElementSet.First();
            mainElement.DirectIncomeField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).First().Name = "Alpha";
            mainElement.ElementItemSet.Skip(1).First().Name = "Beta";
            mainElement.ElementItemSet.Skip(2).First().Name = "Charlie";
            mainElement.ElementItemSet.Skip(3).First().Name = "Delta";

            // Return
            return resourcePool;
        }

        public ResourcePool CreateBasicsNewSystemSample(User user)
        {
            const int numberOfItems = 4;
            
            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user: user,
                resourcePoolName: "Basics - New Model",
                useFixedResourcePoolRate: true,
                mainElementName: "Organization",
                addDirectIncomeField: true,
                addMultiplierField: true,
                addImportanceIndex: true,
                numberOfItems: numberOfItems);

            // Main element
            var mainElement = resourcePool.ElementSet.First();

            // Fields
            mainElement.DirectIncomeField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";
            
            mainElement.ElementFieldSet.Single(item => item.IndexEnabled).Name = "Employee Satisfaction";

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).First().Name = "Alpha";
            mainElement.ElementItemSet.Skip(1).First().Name = "Beta";
            mainElement.ElementItemSet.Skip(2).First().Name = "Charlie";
            mainElement.ElementItemSet.Skip(3).First().Name = "Delta";

            // Return
            return resourcePool;
        }

        public ResourcePool CreatePriorityIndexSample(User user)
        {
            const int numberOfItems = 4;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user: user,
                resourcePoolName: "Priority Index Sample",
                useFixedResourcePoolRate: true,
                mainElementName: "Organization",
                addDirectIncomeField: true,
                addMultiplierField: true,
                addImportanceIndex: false,
                numberOfItems: numberOfItems);

            // Industry element
            var industryElement = resourcePool.AddElement("Industry");

            // Importance field
            var importanceField = industryElement.AddField("Industry Rating", ElementFieldDataType.Decimal, false);
            importanceField.EnableIndex();

            // Items, cells, user cells
            var cosmeticsItem = industryElement.AddItem("Cosmetics").AddCell(importanceField).ElementItem;
            var educationItem = industryElement.AddItem("Education").AddCell(importanceField).ElementItem;
            var entertainmentItem = industryElement.AddItem("Entertainment").AddCell(importanceField).ElementItem;
            var healthcareItem = industryElement.AddItem("Healthcare").AddCell(importanceField).ElementItem;

            // Main element
            var mainElement = resourcePool.ElementSet.First();
            mainElement.DirectIncomeField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";
            var industryField = mainElement.AddField("Industry", ElementFieldDataType.Element);
            industryField.SelectedElement = industryElement;

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).First().Name = "Cosmetics Organization";
            mainElement.ElementItemSet.Skip(0).First().AddCell(industryField).SetValue(cosmeticsItem);
            mainElement.ElementItemSet.Skip(1).First().Name = "Education Organization";
            mainElement.ElementItemSet.Skip(1).First().AddCell(industryField).SetValue(educationItem);
            mainElement.ElementItemSet.Skip(2).First().Name = "Entertainment Organization";
            mainElement.ElementItemSet.Skip(2).First().AddCell(industryField).SetValue(entertainmentItem);
            mainElement.ElementItemSet.Skip(3).First().Name = "Healthcare Organization";
            mainElement.ElementItemSet.Skip(3).First().AddCell(industryField).SetValue(healthcareItem);

            // Old list
            //mainElement.ElementItemSet.Skip(0).First().Name = "Basic Materials";
            //mainElement.ElementItemSet.Skip(1).First().Name = "Conglomerates";
            //mainElement.ElementItemSet.Skip(2).First().Name = "Consumer Goods";
            //mainElement.ElementItemSet.Skip(3).First().Name = "Financial";
            //mainElement.ElementItemSet.Skip(4).First().Name = "Healthcare";
            //mainElement.ElementItemSet.Skip(5).First().Name = "Industrial Goods";
            //mainElement.ElementItemSet.Skip(6).First().Name = "Services";
            //mainElement.ElementItemSet.Skip(7).First().Name = "Technology";
            //mainElement.ElementItemSet.Skip(8).First().Name = "Utilities";

            // Return
            return resourcePool;
        }

        public ResourcePool CreateKnowledgeIndexSample(User user)
        {
            const int numberOfItems = 2;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user: user,
                resourcePoolName: "Knowledge Index Sample",
                useFixedResourcePoolRate: true,
                mainElementName: "Organization",
                addDirectIncomeField: true,
                addMultiplierField: true,
                addImportanceIndex: false,
                numberOfItems: numberOfItems);

            // License element
            var licenseElement = resourcePool.AddElement("License");

            // Fields
            var rightToUseField = licenseElement.AddField("Right to Use", ElementFieldDataType.String);
            var rightToCopyField = licenseElement.AddField("Right to Copy", ElementFieldDataType.String);
            var rightToModifyField = licenseElement.AddField("Right to Modify", ElementFieldDataType.String);
            var rightToSellField = licenseElement.AddField("Right to Sell", ElementFieldDataType.String);
            var licenseRatingField = licenseElement.AddField("License Rating", ElementFieldDataType.Decimal, false);
            licenseRatingField.EnableIndex();

            // Items, cell, user cells
            var restrictedLicense = licenseElement.AddItem("Restricted License")
                .AddCell(rightToUseField).SetValue("Yes").ElementItem
                .AddCell(rightToCopyField).SetValue("No").ElementItem
                .AddCell(rightToModifyField).SetValue("No").ElementItem
                .AddCell(rightToSellField).SetValue("No").ElementItem
                .AddCell(licenseRatingField).ElementItem;

            var openSourceLicense = licenseElement.AddItem("Open Source License")
                .AddCell(rightToUseField).SetValue("Yes").ElementItem
                .AddCell(rightToCopyField).SetValue("Yes").ElementItem
                .AddCell(rightToModifyField).SetValue("Yes").ElementItem
                .AddCell(rightToSellField).SetValue("Yes").ElementItem
                .AddCell(licenseRatingField).ElementItem;

            // Main element
            var mainElement = resourcePool.ElementSet.First();
            mainElement.DirectIncomeField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";
            var licenseField = mainElement.AddField("License", ElementFieldDataType.Element);
            licenseField.SelectedElement = licenseElement;

            // Items, cell, user cells
            // TODO How about ToList()[0]?
            mainElement.ElementItemSet.Skip(0).First().Name = "Hidden Knowledge";
            mainElement.ElementItemSet.Skip(0).First().AddCell(licenseField).SetValue(restrictedLicense);
            mainElement.ElementItemSet.Skip(1).First().Name = "True Source";
            mainElement.ElementItemSet.Skip(1).First().AddCell(licenseField).SetValue(openSourceLicense);
            //mainElement.ElementItemSet.Skip(2).First().Name = "Commercial Organization B";
            //mainElement.ElementItemSet.Skip(2).First().AddCell(licenseField).SetValue(restrictedLicense);
            //mainElement.ElementItemSet.Skip(3).First().Name = "Open Source Organization B";
            //mainElement.ElementItemSet.Skip(3).First().AddCell(licenseField).SetValue(openSourceLicense);

            // Return
            return resourcePool;
        }

        public ResourcePool CreateKnowledgeIndexPopularSoftwareLicenseSample(User user)
        {
            const int numberOfItems = 4;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user: user,
                resourcePoolName: "Knowledge Index - Popular Software Licenses",
                useFixedResourcePoolRate: true,
                mainElementName: "License",
                addDirectIncomeField: false,
                addMultiplierField: false,
                addImportanceIndex: false,
                numberOfItems: numberOfItems);

            // Main element
            var mainElement = resourcePool.ElementSet.First();

            // Fields
            var importanceField = mainElement.AddField("License Rating", ElementFieldDataType.Decimal, false);
            importanceField.EnableIndex();

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).First().Name = "<a href='http://opensource.org/licenses/Apache-2.0' target='_blank'>Apache-2.0</a>";
            //mainElement.ElementItemSet.Skip(0).First().Name = "Apache-2.0";
            //mainElement.ElementItemSet.Skip(0).First().NameCell.SetValue("<a href='http://opensource.org/licenses/Apache-2.0' target='_blank'>Apache-2.0</a>");
            mainElement.ElementItemSet.Skip(0).First().AddCell(importanceField);

            //mainElement.ElementItemSet.Skip(1).First().Name = "BSD-3-Clause";
            //mainElement.ElementItemSet.Skip(1).First().NameCell.SetValue("<a href='http://opensource.org/licenses/BSD-3-Clause' target='_blank'>BSD-3-Clause</a>");
            //mainElement.ElementItemSet.Skip(1).First().AddCell(importanceField).SetValue(ratingPerLicense);

            mainElement.ElementItemSet.Skip(1).First().Name = "<a href='http://opensource.org/licenses/GPL-3.0' target='_blank'>GPL-3.0</a>";
            //mainElement.ElementItemSet.Skip(1).First().Name = "GPL-3.0";
            //mainElement.ElementItemSet.Skip(1).First().NameCell.SetValue("<a href='http://opensource.org/licenses/GPL-3.0' target='_blank'>GPL-3.0</a>");
            mainElement.ElementItemSet.Skip(1).First().AddCell(importanceField);

            //mainElement.ElementItemSet.Skip(3).First().Name = "LGPL-3.0";
            //mainElement.ElementItemSet.Skip(3).First().NameCell.SetValue("<a href='http://opensource.org/licenses/LGPL-3.0' target='_blank'>LGPL-3.0</a>");
            //mainElement.ElementItemSet.Skip(3).First().AddCell(importanceField).SetValue(ratingPerLicense);

            mainElement.ElementItemSet.Skip(2).First().Name = "<a href='http://opensource.org/licenses/MIT' target='_blank'>MIT</a>";
            //mainElement.ElementItemSet.Skip(2).First().Name = "MIT";
            //mainElement.ElementItemSet.Skip(2).First().NameCell.SetValue("<a href='http://opensource.org/licenses/MIT' target='_blank'>MIT</a>");
            mainElement.ElementItemSet.Skip(2).First().AddCell(importanceField);

            // TODO Check it again
            mainElement.ElementItemSet.Skip(3).First().Name = "<a href='http://en.wikipedia.org/wiki/End-user_license_agreement' target='_blank'>EULA (Wikipedia)</a>";
            //mainElement.ElementItemSet.Skip(3).First().Name = "EULA (Wikipedia)";
            //mainElement.ElementItemSet.Skip(3).First().NameCell.SetValue("<a href='http://en.wikipedia.org/wiki/End-user_license_agreement' target='_blank'>EULA (Wikipedia)</a>");
            mainElement.ElementItemSet.Skip(3).First().AddCell(importanceField);

            // Return
            return resourcePool;
        }

        public ResourcePool CreateTotalCostIndexExistingSystemSample(User user)
        {
            const int numberOfItems = 2;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user: user,
                resourcePoolName: "Total Cost Index - Existing Model",
                useFixedResourcePoolRate: true,
                mainElementName: "Product",
                addDirectIncomeField: true,
                addMultiplierField: true,
                addImportanceIndex: false,
                numberOfItems: numberOfItems);

            // Main element
            var mainElement = resourcePool.ElementSet.First();

            // Fields
            mainElement.DirectIncomeField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).First().Name = "4Benefit";
            mainElement.ElementItemSet.Skip(0).First().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(1).First().Name = "4Profit";
            mainElement.ElementItemSet.Skip(1).First().DirectIncomeCell.SetValue(120M);

            // Return
            return resourcePool;
        }

        public ResourcePool CreateTotalCostIndexNewSystemSample(User user)
        {
            const int numberOfItems = 2;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user: user,
                resourcePoolName: "Total Cost Index - New Model",
                useFixedResourcePoolRate: true,
               mainElementName: "Product",
               addDirectIncomeField: true,
               addMultiplierField: true,
               addImportanceIndex: false,
               numberOfItems: numberOfItems);

            // Main element
            var mainElement = resourcePool.ElementSet.First();

            // Fields
            mainElement.DirectIncomeField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";

            // Resource pool index; use to Sales Price itself
            mainElement.DirectIncomeField.EnableIndex(ElementFieldIndexSortType.LowestToHighest);

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).First().Name = "4Benefit";
            mainElement.ElementItemSet.Skip(0).First().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(1).First().Name = "4Profit";
            mainElement.ElementItemSet.Skip(1).First().DirectIncomeCell.SetValue(120M);

            // Return
            return resourcePool;
        }

        public ResourcePool CreateAllInOneSample(User user)
        {
            const int numberOfItems = 16;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user: user,
                resourcePoolName: "All in One",
                useFixedResourcePoolRate: true,
                mainElementName: "Organization",
                addDirectIncomeField: true,
                addMultiplierField: true,
                addImportanceIndex: false,
                numberOfItems: numberOfItems);

            // Industry element
            var industryElement = resourcePool.AddElement("Industry");

            // Fields
            var industryRatingField = industryElement.AddField("Industry Rating", ElementFieldDataType.Decimal, false);
            industryRatingField.EnableIndex();

            // Items, cells, user cells
            var cosmeticsItem = industryElement.AddItem("Cosmetics").AddCell(industryRatingField).ElementItem;
            var educationItem = industryElement.AddItem("Education").AddCell(industryRatingField).ElementItem;
            var entertainmentItem = industryElement.AddItem("Entertainment").AddCell(industryRatingField).ElementItem;
            var healthcareItem = industryElement.AddItem("Healthcare").AddCell(industryRatingField).ElementItem;

            // License element
            var licenseElement = resourcePool.AddElement("License");

            // Fields
            var rightToUseField = licenseElement.AddField("Right to Use", ElementFieldDataType.String);
            var rightToCopyField = licenseElement.AddField("Right to Copy", ElementFieldDataType.String);
            var rightToModifyField = licenseElement.AddField("Right to Modify", ElementFieldDataType.String);
            var rightToSellField = licenseElement.AddField("Right to Sell", ElementFieldDataType.String);
            var licenseRatingField = licenseElement.AddField("License Rating", ElementFieldDataType.Decimal, false);
            licenseRatingField.EnableIndex();

            // Items, cell, user cells
            var restrictedLicense = licenseElement.AddItem("Restricted License")
                .AddCell(rightToUseField).SetValue("Yes").ElementItem
                .AddCell(rightToCopyField).SetValue("No").ElementItem
                .AddCell(rightToModifyField).SetValue("No").ElementItem
                .AddCell(rightToSellField).SetValue("No").ElementItem
                .AddCell(licenseRatingField).ElementItem;

            var openSourceLicense = licenseElement.AddItem("Open Source License")
                .AddCell(rightToUseField).SetValue("Yes").ElementItem
                .AddCell(rightToCopyField).SetValue("Yes").ElementItem
                .AddCell(rightToModifyField).SetValue("Yes").ElementItem
                .AddCell(rightToSellField).SetValue("Yes").ElementItem
                .AddCell(licenseRatingField).ElementItem;

            // Main element
            var mainElement = resourcePool.ElementSet.First();
            mainElement.DirectIncomeField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";

            var industryField = mainElement.AddField("Industry", ElementFieldDataType.Element);
            industryField.SelectedElement = industryElement;

            var licenseField = mainElement.AddField("License", ElementFieldDataType.Element);
            licenseField.SelectedElement = licenseElement;

            // Resource pool index; use to Sales Price itself
            mainElement.DirectIncomeField.EnableIndex(ElementFieldIndexSortType.LowestToHighest);

            // Items, cell, user cells
            var itemIndex = 0;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Cosmetics 4Benefit";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(cosmeticsItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);

            itemIndex = 1;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Cosmetics 4Profit";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(120M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(cosmeticsItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);

            itemIndex = 2;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Cosmetics 4Benefit";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(cosmeticsItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);

            itemIndex = 3;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Cosmetics 4Profit";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(120M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(cosmeticsItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);

            itemIndex = 4;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Education 4Benefit";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(educationItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);

            itemIndex = 5;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Education 4Profit";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(120M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(educationItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);

            itemIndex = 6;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Education 4Benefit";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(educationItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);

            itemIndex = 7;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Education 4Profit";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(120M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(educationItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);

            itemIndex = 8;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Entertainment 4Benefit";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(entertainmentItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);

            itemIndex = 9;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Entertainment 4Profit";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(120M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(entertainmentItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);

            itemIndex = 10;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Entertainment 4Benefit";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(entertainmentItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);

            itemIndex = 11;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Entertainment 4Profit";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(120M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(entertainmentItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);

            itemIndex = 12;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Healthcare 4Benefit";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(healthcareItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);

            itemIndex = 13;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Healthcare 4Profit";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(120M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(healthcareItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);

            itemIndex = 14;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Healthcare 4Benefit";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(healthcareItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);

            itemIndex = 15;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Healthcare 4Profit";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(120M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(healthcareItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);

            // Return
            return resourcePool;
        }

        [Obsolete("Not in use")]
        public ResourcePool CreateKnowledgeIndexPopularSoftwareLicenseSampleAlternative(User user)
        {
            const int numberOfItems = 4;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user: user,
                resourcePoolName: "Knowledge Index - Popular Software Licenses",
                useFixedResourcePoolRate: true,
                mainElementName: "Organization",
                addDirectIncomeField: true,
                addMultiplierField: true,
                addImportanceIndex: false,
                numberOfItems: numberOfItems);

            // License element
            var licenseElement = resourcePool.AddElement("License");

            // Fields
            var linkField = licenseElement.AddField("Link", ElementFieldDataType.String);
            var importanceField = licenseElement.AddField("License Rating", ElementFieldDataType.Decimal, false);
            importanceField.EnableIndex();

            // Items, cell, user cells
            licenseElement.AddItem("Apache-2.0").AddCell(linkField)
                .SetValue("<a href='http://opensource.org/licenses/Apache-2.0' target='_blank'>Link</a>")
                .ElementItem
                .AddCell(importanceField);

            //licenseElement.AddItem("BSD-3-Clause")
            //    .AddCell(linkField).SetValue("<a href='http://opensource.org/licenses/BSD-3-Clause' target='_blank'>Link</a>")
            //    .ElementItem
            //    .AddCell(importanceField).SetValue(ratingPerLicense);

            licenseElement.AddItem("GPL-3.0")
                .AddCell(linkField).SetValue("<a href='http://opensource.org/licenses/GPL-3.0' target='_blank'>Link</a>")
                .ElementItem
                .AddCell(importanceField);

            //licenseElement.AddItem("LGPL-3.0")
            //    .AddCell(linkField).SetValue("<a href='http://opensource.org/licenses/LGPL-3.0' target='_blank'>Link</a>")
            //    .ElementItem
            //    .AddCell(importanceField).SetValue(ratingPerLicense);

            licenseElement.AddItem("MIT")
                .AddCell(linkField).SetValue("<a href='http://opensource.org/licenses/MIT' target='_blank'>Link</a>")
                .ElementItem
                .AddCell(importanceField);

            // TODO Check it again
            licenseElement.AddItem("EULA (Wikipedia)")
                .AddCell(linkField).SetValue("<a href='http://en.wikipedia.org/wiki/End-user_license_agreement' target='_blank'>Link</a>")
                .ElementItem
                .AddCell(importanceField);

            // Main element
            var mainElement = resourcePool.ElementSet.First();
            mainElement.DirectIncomeField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";
            var licenseField = mainElement.AddField("License", ElementFieldDataType.Element);
            licenseField.SelectedElement = licenseElement;

            // Items, cell, user cells
            // TODO How about ToList()[0]?
            mainElement.ElementItemSet.Skip(0).First().Name = "Apache-2.0 Organization";
            mainElement.ElementItemSet.Skip(0).First().AddCell(licenseField).SetValue(licenseElement.ElementItemSet.Skip(0).First());
            //mainElement.ElementItemSet.Skip(1).First().Name = "BSD-3-Clause Organization";
            //mainElement.ElementItemSet.Skip(1).First().AddCell(licenseField).SetValue(licenseElement.ElementItemSet.Skip(1).First());
            mainElement.ElementItemSet.Skip(1).First().Name = "GPL-3.0 Organization";
            mainElement.ElementItemSet.Skip(1).First().AddCell(licenseField).SetValue(licenseElement.ElementItemSet.Skip(2).First());
            //mainElement.ElementItemSet.Skip(3).First().Name = "LGPL-3.0 Organization";
            //mainElement.ElementItemSet.Skip(3).First().AddCell(licenseField).SetValue(licenseElement.ElementItemSet.Skip(3).First());
            mainElement.ElementItemSet.Skip(2).First().Name = "MIT Organization";
            mainElement.ElementItemSet.Skip(2).First().AddCell(licenseField).SetValue(licenseElement.ElementItemSet.Skip(4).First());
            mainElement.ElementItemSet.Skip(3).First().Name = "EULA Organization";
            mainElement.ElementItemSet.Skip(3).First().AddCell(licenseField).SetValue(licenseElement.ElementItemSet.Skip(5).First());

            // Return
            return resourcePool;
        }

        [Obsolete("Not in use")]
        public ResourcePool CreateKnowledgeIndexPopularSoftwareLicenseSampleAlternative2(User user)
        {
            const int numberOfItems = 4;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user: user,
                resourcePoolName: "Knowledge Index - Popular Software Licenses",
                useFixedResourcePoolRate: true,
                mainElementName: "License",
                addDirectIncomeField: false,
                addMultiplierField: false,
                addImportanceIndex: false,
                numberOfItems: numberOfItems);

            // Main element
            var mainElement = resourcePool.ElementSet.First();

            // Fields
            var linkField = mainElement.AddField("Link", ElementFieldDataType.String);
            var importanceField = mainElement.AddField("License Rating", ElementFieldDataType.Decimal, false);
            importanceField.EnableIndex();

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).First().Name = "Apache-2.0";
            mainElement.ElementItemSet.Skip(0).First().AddCell(linkField).SetValue("<a href='http://opensource.org/licenses/Apache-2.0' target='_blank'>Link</a>");
            mainElement.ElementItemSet.Skip(0).First().AddCell(importanceField);

            //mainElement.ElementItemSet.Skip(1).First().Name = "BSD-3-Clause";
            //mainElement.ElementItemSet.Skip(1).First().AddCell(linkField).SetValue("<a href='http://opensource.org/licenses/BSD-3-Clause' target='_blank'>Link</a>");
            //mainElement.ElementItemSet.Skip(1).First().AddCell(importanceField).SetValue(ratingPerLicense);

            mainElement.ElementItemSet.Skip(1).First().Name = "GPL-3.0";
            mainElement.ElementItemSet.Skip(1).First().AddCell(linkField).SetValue("<a href='http://opensource.org/licenses/GPL-3.0' target='_blank'>Link</a>");
            mainElement.ElementItemSet.Skip(1).First().AddCell(importanceField);

            //mainElement.ElementItemSet.Skip(3).First().Name = "LGPL-3.0";
            //mainElement.ElementItemSet.Skip(3).First().AddCell(linkField).SetValue("<a href='http://opensource.org/licenses/LGPL-3.0' target='_blank'>Link</a>");
            //mainElement.ElementItemSet.Skip(3).First().AddCell(importanceField).SetValue(ratingPerLicense);

            mainElement.ElementItemSet.Skip(2).First().Name = "MIT";
            mainElement.ElementItemSet.Skip(2).First().AddCell(linkField).SetValue("<a href='http://opensource.org/licenses/MIT' target='_blank'>Link</a>");
            mainElement.ElementItemSet.Skip(2).First().AddCell(importanceField);

            // TODO Check it again
            mainElement.ElementItemSet.Skip(3).First().Name = "EULA (Wikipedia)";
            mainElement.ElementItemSet.Skip(3).First().AddCell(linkField).SetValue("<a href='http://en.wikipedia.org/wiki/End-user_license_agreement' target='_blank'>Link</a>");
            mainElement.ElementItemSet.Skip(3).First().AddCell(importanceField);

            // Return
            return resourcePool;
        }

        [Obsolete("Not in use")]
        public ResourcePool CreateTotalCostIndexExistingSystemSampleOld(User user)
        {
            const int numberOfItems = 3;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user: user,
                resourcePoolName: "Total Cost Index - Existing Model",
                useFixedResourcePoolRate: true,
                mainElementName: "Product",
                addDirectIncomeField: true,
                addMultiplierField: true,
                addImportanceIndex: false,
                numberOfItems: numberOfItems);

            // Main element
            var mainElement = resourcePool.ElementSet.First();

            // Fields
            mainElement.DirectIncomeField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).First().Name = "Average Profit";
            mainElement.ElementItemSet.Skip(0).First().DirectIncomeCell.SetValue(110M);
            mainElement.ElementItemSet.Skip(1).First().Name = "High Profit";
            mainElement.ElementItemSet.Skip(1).First().DirectIncomeCell.SetValue(120M);
            mainElement.ElementItemSet.Skip(2).First().Name = "No Profit";
            mainElement.ElementItemSet.Skip(2).First().DirectIncomeCell.SetValue(100M);

            // Return
            return resourcePool;
        }

        [Obsolete("Not in use")]
        public ResourcePool CreateTotalCostIndexNewSystemSampleOld(User user)
        {
            const int numberOfItems = 3;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user: user,
                resourcePoolName: "Total Cost Index - New Model",
                useFixedResourcePoolRate: true, 
               mainElementName: "Product",
               addDirectIncomeField: true,
               addMultiplierField: true,
               addImportanceIndex: false,
               numberOfItems: numberOfItems);

            // Main element
            var mainElement = resourcePool.ElementSet.First();

            // Fields
            mainElement.DirectIncomeField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";

            // Resource pool index; use to Sales Price itself
            mainElement.DirectIncomeField.EnableIndex(ElementFieldIndexSortType.LowestToHighest);

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).First().Name = "Average Profit";
            mainElement.ElementItemSet.Skip(0).First().DirectIncomeCell.SetValue(110M);
            mainElement.ElementItemSet.Skip(1).First().Name = "High Profit";
            mainElement.ElementItemSet.Skip(1).First().DirectIncomeCell.SetValue(120M);
            mainElement.ElementItemSet.Skip(2).First().Name = "No Profit";
            mainElement.ElementItemSet.Skip(2).First().DirectIncomeCell.SetValue(100M);

            // Return
            return resourcePool;
        }

        [Obsolete("Not in use")]
        public ResourcePool CreateTotalCostIndexNewSystemAftermathSampleOld(User user)
        {
            const int numberOfItems = 3;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user: user,
                resourcePoolName: "Total Cost Index - New Model - Aftermath",
                useFixedResourcePoolRate: true,
                mainElementName: "Product",
                addDirectIncomeField: true,
                addMultiplierField: true,
                addImportanceIndex: false,
                numberOfItems: numberOfItems);

            // Main element
            var mainElement = resourcePool.ElementSet.First();

            // Fields
            mainElement.DirectIncomeField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";
            mainElement.MultiplierField.SortOrder = 3;

            // Resource pool index; use to Sales Price itself
            mainElement.DirectIncomeField.EnableIndex(ElementFieldIndexSortType.LowestToHighest);

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).First().Name = "<s>Average Profit</s>";
            mainElement.ElementItemSet.Skip(0).First().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(1).First().Name = "<s>High Profit</s>";
            mainElement.ElementItemSet.Skip(1).First().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(2).First().Name = "No Profit";
            mainElement.ElementItemSet.Skip(2).First().DirectIncomeCell.SetValue(100M);

            // Return
            return resourcePool;
        }

        [Obsolete("Not in use")]
        public ResourcePool CreateTotalCostIndexSampleOld(User user)
        {
            const int numberOfItems = 2;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user: user,
                resourcePoolName: "Total Cost Index Sample",
                useFixedResourcePoolRate: true,
                mainElementName: "Organization",
                addDirectIncomeField: true,
                addMultiplierField: true,
                addImportanceIndex: false,
                numberOfItems: numberOfItems);

            // Main element
            var mainElement = resourcePool.ElementSet.First();
            mainElement.DirectIncomeField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";

            // Resource pool index; use to Sales Price itself
            resourcePool.ElementSet.First().DirectIncomeField.EnableIndex(ElementFieldIndexSortType.LowestToHighest);

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).First().Name = "Lowlands";
            mainElement.ElementItemSet.Skip(0).First().DirectIncomeCell.SetValue(125M);
            mainElement.ElementItemSet.Skip(1).First().Name = "High Coast";
            mainElement.ElementItemSet.Skip(1).First().DirectIncomeCell.SetValue(175M);

            // Return
            return resourcePool;
        }

        [Obsolete("Not in use")]
        public ResourcePool CreateFairShareSample(User user)
        {
            const int numberOfItems = 2;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user: user,
                resourcePoolName: "Fair Share Index",
                useFixedResourcePoolRate: true,
                mainElementName: "Organization",
                addDirectIncomeField: true,
                addMultiplierField: true,
                addImportanceIndex: false,
                numberOfItems: numberOfItems);

            //resourcePool.EnableSubtotals = false;

            // Fair share element
            var fairShareElement = resourcePool.AddElement("Fair Share");

            // Fields
            var fairShareDesciptionField = fairShareElement.AddField("Description", ElementFieldDataType.String);
            var fairShareImportanceField = fairShareElement.AddField("Fair Share Rating", ElementFieldDataType.Decimal, false);
            fairShareImportanceField.EnableIndex();

            // Items, cell, user cells
            var fairShareNoItem = fairShareElement.AddItem("Keeper")
                .AddCell(fairShareDesciptionField).SetValue("Uses the classic approach; the owner gets all the profit, workers get a fixed salary").ElementItem
                .AddCell(fairShareImportanceField).ElementItem;

            var fairShareYesItem = fairShareElement.AddItem("Sharer")
                .AddCell(fairShareDesciptionField).SetValue("Considers contributions from all parties and share the income based on this outcome").ElementItem
                .AddCell(fairShareImportanceField).ElementItem;

            // Main element
            var mainElement = resourcePool.ElementSet.First();
            mainElement.DirectIncomeField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";
            var fairShareField = mainElement.AddField("Fair Share", ElementFieldDataType.Element);
            fairShareField.SelectedElement = fairShareElement;

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).First().Name = "Fair Sharer Org.";
            mainElement.ElementItemSet.Skip(0).First().AddCell(fairShareField).SetValue(fairShareYesItem);

            mainElement.ElementItemSet.Skip(1).First().Name = "Income Keeper Inc.";
            mainElement.ElementItemSet.Skip(1).First().AddCell(fairShareField).SetValue(fairShareNoItem);

            // Return
            return resourcePool;
        }

        [Obsolete("Not in use")]
        public ResourcePool CreateIndexesPieSample(User user)
        {
            const int numberOfItems = 1;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user: user,
                resourcePoolName: "Indexes Pie",
                useFixedResourcePoolRate: true,
                mainElementName: "Organization",
                addDirectIncomeField: true,
                addMultiplierField: true,
                addImportanceIndex: false,
                numberOfItems: numberOfItems);
            
            //resourcePool.EnableSubtotals = false;

            //// Fair share element
            //var fairShareElement = resourcePool.AddElement("Fair Share");

            //// Fields
            //var fairShareDesciptionField = fairShareElement.AddField("Description", ElementFieldDataType.String);
            //var fairShareImportanceField = fairShareElement.AddField("Rating", ElementFieldDataType.Decimal, false);
            //fairShareImportanceField.AddIndex("Fair Share Index");

            //// Items, cell, user cells
            //decimal ratingPerItem = 100 / 2;
            //var fairShareYesItem = fairShareElement.AddItem("Sharer")
            //    .AddCell(fairShareDesciptionField).SetValue("The organization shares it's income with its employees based on their contributions").ElementItem
            //    .AddCell(fairShareImportanceField).SetValue(ratingPerItem, user).ElementItem;

            //var fairShareNoItem = fairShareElement.AddItem("Keeper")
            //    .AddCell(fairShareDesciptionField).SetValue("The owner of the organization keeps all the income to himself, ignores the contributions").ElementItem
            //    .AddCell(fairShareImportanceField).SetValue(ratingPerItem, user).ElementItem;

            // Main element
            var mainElement = resourcePool.ElementSet.First();
            mainElement.DirectIncomeField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";

            // Industry Index
            var industryField = resourcePool.ElementSet.First().AddField("Industry", ElementFieldDataType.Decimal, true);
            industryField.EnableIndex();

            // Knowledge Index
            var licenseField = resourcePool.ElementSet.First().AddField("License", ElementFieldDataType.Decimal, true);
            licenseField.EnableIndex();

            // Total Cost Index
            mainElement.DirectIncomeField.EnableIndex(ElementFieldIndexSortType.LowestToHighest);

            // Fair Share Index
            var fairShareField = resourcePool.ElementSet.First().AddField("Fair Share", ElementFieldDataType.Decimal, true);
            fairShareField.EnableIndex();

            //mainElement.ElementFieldSet.Single(item => item.ElementFieldIndexSet.Any()).Name = "Rating";
            //mainElement.ElementFieldSet.Single(item => item.ElementFieldIndexSet.Any()).ElementFieldIndex.Name = "Employee Satisfaction";

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).First().Name = "One and Only";
            mainElement.ElementItemSet.Skip(0).First().AddCell(industryField).SetValue(50M);
            mainElement.ElementItemSet.Skip(0).First().AddCell(licenseField).SetValue(50M);
            // mainElement.ElementItemSet.Skip(0).First().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(0).First().AddCell(fairShareField).SetValue(50M);

            //mainElement.ElementItemSet.Skip(1).First().Name = "Organization B";
            //mainElement.ElementItemSet.Skip(1).First().DirectIncomeCell.SetValue(100M);
            //mainElement.ElementItemSet.Skip(1).First().AddCell(industryField).SetValue(50M);
            //mainElement.ElementItemSet.Skip(1).First().AddCell(licenseField).SetValue(25M);

            // mainElement.ElementItemSet.Skip(1).First().Name = "Organization B";
            // var fairShareField = mainElement.AddField("Fair Share", ElementFieldDataType.Element);
            // fairShareField.SelectedElement = fairShareElement;

            // Items, cell, user cells
            //mainElement.ElementItemSet.Skip(0).First().Name = "Income Keeper Inc.";
            //mainElement.ElementItemSet.Skip(0).First().AddCell(fairShareField).SetValue(fairShareNoItem);

            //mainElement.ElementItemSet.Skip(1).First().Name = "Fair Sharer Org.";
            //mainElement.ElementItemSet.Skip(1).First().AddCell(fairShareField).SetValue(fairShareYesItem);

            // Return
            return resourcePool;
        }

        [Obsolete("Not in use")]
        public ResourcePool CreateIndexesPieSampleOld(User user)
        {
            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user: user,
                resourcePoolName: "Indexes Pie",
                useFixedResourcePoolRate: true,
                mainElementName: "Organization",
                addDirectIncomeField: true,
                addMultiplierField: true,
                addImportanceIndex: false,
                numberOfItems: 2);
            
            //resourcePool.EnableSubtotals = false;

            //// Fair share element
            //var fairShareElement = resourcePool.AddElement("Fair Share");

            //// Fields
            //var fairShareDesciptionField = fairShareElement.AddField("Description", ElementFieldDataType.String);
            //var fairShareImportanceField = fairShareElement.AddField("Rating", ElementFieldDataType.Decimal, false);
            //fairShareImportanceField.AddIndex("Fair Share Index");

            //// Items, cell, user cells
            //decimal ratingPerItem = 100 / 2;
            //var fairShareYesItem = fairShareElement.AddItem("Sharer")
            //    .AddCell(fairShareDesciptionField).SetValue("The organization shares it's income with its employees based on their contributions").ElementItem
            //    .AddCell(fairShareImportanceField).SetValue(ratingPerItem, user).ElementItem;

            //var fairShareNoItem = fairShareElement.AddItem("Keeper")
            //    .AddCell(fairShareDesciptionField).SetValue("The owner of the organization keeps all the income to himself, ignores the contributions").ElementItem
            //    .AddCell(fairShareImportanceField).SetValue(ratingPerItem, user).ElementItem;

            // Main element
            var mainElement = resourcePool.ElementSet.First();
            mainElement.DirectIncomeField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";

            // 1. index
            mainElement.DirectIncomeField.EnableIndex(ElementFieldIndexSortType.LowestToHighest);

            //mainElement.ElementFieldSet.Single(item => item.ElementFieldIndexSet.Any()).Name = "Rating";
            //mainElement.ElementFieldSet.Single(item => item.ElementFieldIndexSet.Any()).ElementFieldIndex.Name = "Employee Satisfaction";

            // 2. index
            var importanceField1 = resourcePool.ElementSet.First().AddField("Importance Field 1", ElementFieldDataType.Decimal, false);
            importanceField1.EnableIndex();

            // 3. index
            var importanceField2 = resourcePool.ElementSet.First().AddField("Importance Field 2", ElementFieldDataType.Decimal, false);
            importanceField2.EnableIndex();

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).First().Name = "Alpha";
            mainElement.ElementItemSet.Skip(0).First().DirectIncomeCell.SetValue(200M);
            mainElement.ElementItemSet.Skip(0).First().AddCell(importanceField1).SetValue(100M);
            mainElement.ElementItemSet.Skip(0).First().AddCell(importanceField2).SetValue(50M);

            mainElement.ElementItemSet.Skip(1).First().Name = "Beta";
            mainElement.ElementItemSet.Skip(1).First().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(1).First().AddCell(importanceField1).SetValue(50M);
            mainElement.ElementItemSet.Skip(1).First().AddCell(importanceField2).SetValue(25M);
            
            // mainElement.ElementItemSet.Skip(1).First().Name = "Organization B";
            // var fairShareField = mainElement.AddField("Fair Share", ElementFieldDataType.Element);
            // fairShareField.SelectedElement = fairShareElement;

            // Items, cell, user cells
            //mainElement.ElementItemSet.Skip(0).First().Name = "Income Keeper Inc.";
            //mainElement.ElementItemSet.Skip(0).First().AddCell(fairShareField).SetValue(fairShareNoItem);

            //mainElement.ElementItemSet.Skip(1).First().Name = "Fair Sharer Org.";
            //mainElement.ElementItemSet.Skip(1).First().AddCell(fairShareField).SetValue(fairShareYesItem);

            // Return
            return resourcePool;
        }

        [Obsolete("Not in use")]
        public ResourcePool CreateResourcePoolRateSample(User user)
        {
            const int numberOfItems = 4;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user: user,
                resourcePoolName: "CMRP Rate",
                useFixedResourcePoolRate: false,
                mainElementName: "Organization",
                addDirectIncomeField: true,
                addMultiplierField: true,
                addImportanceIndex: false,
                numberOfItems: numberOfItems);

            //// Fair share element
            //var fairShareElement = resourcePool.AddElement("Fair Share");

            //// Fields
            //var fairShareDesciptionField = fairShareElement.AddField("Description", ElementFieldDataType.String);
            //var fairShareImportanceField = fairShareElement.AddField("Rating", ElementFieldDataType.Decimal, false);
            //fairShareImportanceField.AddIndex("Fair Share Index");

            //// Items, cell, user cells
            //decimal ratingPerItem = 100 / 2;
            //var fairShareYesItem = fairShareElement.AddItem("Sharer")
            //    .AddCell(fairShareDesciptionField).SetValue("The organization shares it's income with its employees based on their contributions").ElementItem
            //    .AddCell(fairShareImportanceField).SetValue(ratingPerItem, user).ElementItem;

            //var fairShareNoItem = fairShareElement.AddItem("Keeper")
            //    .AddCell(fairShareDesciptionField).SetValue("The owner of the organization keeps all the income to himself, ignores the contributions").ElementItem
            //    .AddCell(fairShareImportanceField).SetValue(ratingPerItem, user).ElementItem;

            // Main element
            var mainElement = resourcePool.ElementSet.First();
            mainElement.DirectIncomeField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";

            // 1. index
            //mainElement.ResourcePoolField.AddIndex("Total Cost Index", ElementFieldIndexSortType.LowestToHighest);

            //mainElement.ElementFieldSet.Single(item => item.ElementFieldIndexSet.Any()).Name = "Rating";
            //mainElement.ElementFieldSet.Single(item => item.ElementFieldIndexSet.Any()).ElementFieldIndex.Name = "Employee Satisfaction";

            // 2. index
            var veryImportantField = resourcePool.ElementSet.First().AddField("Very Important Index", ElementFieldDataType.Decimal, false);
            veryImportantField.EnableIndex();

            // 3. index
            //var importanceField2 = resourcePool.ElementSet.First().AddField("Importance Field 2", ElementFieldDataType.Decimal, false);
            //importanceField2.AddIndex("Importance Index 2");

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).First().Name = "Alpha";
            //mainElement.ElementItemSet.Skip(0).First().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(0).First().AddCell(veryImportantField);

            mainElement.ElementItemSet.Skip(1).First().Name = "Beta";
            //mainElement.ElementItemSet.Skip(1).First().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(1).First().AddCell(veryImportantField);

            mainElement.ElementItemSet.Skip(2).First().Name = "Charlie";
            //mainElement.ElementItemSet.Skip(2).First().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(2).First().AddCell(veryImportantField);

            mainElement.ElementItemSet.Skip(3).First().Name = "Delta";
            //mainElement.ElementItemSet.Skip(3).First().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(3).First().AddCell(veryImportantField);

            //mainElement.ElementItemSet.Skip(1).First().AddCell(importanceField2).SetValue(25M);

            // mainElement.ElementItemSet.Skip(1).First().Name = "Organization B";
            // var fairShareField = mainElement.AddField("Fair Share", ElementFieldDataType.Element);
            // fairShareField.SelectedElement = fairShareElement;

            // Items, cell, user cells
            //mainElement.ElementItemSet.Skip(0).First().Name = "Income Keeper Inc.";
            //mainElement.ElementItemSet.Skip(0).First().AddCell(fairShareField).SetValue(fairShareNoItem);

            //mainElement.ElementItemSet.Skip(1).First().Name = "Fair Sharer Org.";
            //mainElement.ElementItemSet.Skip(1).First().AddCell(fairShareField).SetValue(fairShareYesItem);

            // Return
            return resourcePool;
        }

        [Obsolete("Not in use")]
        public ResourcePool CreateAllInOneSampleOld(User user)
        {
            const int numberOfItems = 32;

            // Resource pool
            var resourcePool = CreateDefaultResourcePool(user: user,
                resourcePoolName: "All in One",
                useFixedResourcePoolRate: false,
                mainElementName: "Organization",
                addDirectIncomeField: true,
                addMultiplierField: true,
                addImportanceIndex: false,
                numberOfItems: numberOfItems);

            // Industry element
            var industryElement = resourcePool.AddElement("Industry");

            // Fields
            var industryRatingField = industryElement.AddField("Industry Rating", ElementFieldDataType.Decimal, false);
            industryRatingField.EnableIndex();

            // Items, cells, user cells
            var cosmeticsItem = industryElement.AddItem("Cosmetics").AddCell(industryRatingField).ElementItem;
            var educationItem = industryElement.AddItem("Education").AddCell(industryRatingField).ElementItem;
            var entertainmentItem = industryElement.AddItem("Entertainment").AddCell(industryRatingField).ElementItem;
            var healthcareItem = industryElement.AddItem("Healthcare").AddCell(industryRatingField).ElementItem;

            // License element
            var licenseElement = resourcePool.AddElement("License");

            // Fields
            var rightToUseField = licenseElement.AddField("Right to Use", ElementFieldDataType.String);
            var rightToCopyField = licenseElement.AddField("Right to Copy", ElementFieldDataType.String);
            var rightToModifyField = licenseElement.AddField("Right to Modify", ElementFieldDataType.String);
            var rightToSellField = licenseElement.AddField("Right to Sell", ElementFieldDataType.String);
            var licenseRatingField = licenseElement.AddField("License Rating", ElementFieldDataType.Decimal, false);
            licenseRatingField.EnableIndex();

            // Items, cell, user cells
            var restrictedLicense = licenseElement.AddItem("Restricted License")
                .AddCell(rightToUseField).SetValue("Yes").ElementItem
                .AddCell(rightToCopyField).SetValue("No").ElementItem
                .AddCell(rightToModifyField).SetValue("No").ElementItem
                .AddCell(rightToSellField).SetValue("No").ElementItem
                .AddCell(licenseRatingField).ElementItem;

            var openSourceLicense = licenseElement.AddItem("Open Source License")
                .AddCell(rightToUseField).SetValue("Yes").ElementItem
                .AddCell(rightToCopyField).SetValue("Yes").ElementItem
                .AddCell(rightToModifyField).SetValue("Yes").ElementItem
                .AddCell(rightToSellField).SetValue("Yes").ElementItem
                .AddCell(licenseRatingField).ElementItem;

            // Fair share element
            var fairShareElement = resourcePool.AddElement("Fair Share");

            // Fields
            var fairShareDesciptionField = fairShareElement.AddField("Description", ElementFieldDataType.String);
            var fairShareRatingField = fairShareElement.AddField("Fair Share Rating", ElementFieldDataType.Decimal, false);
            fairShareRatingField.EnableIndex();

            // Items, cell, user cells
            var keeperItem = fairShareElement.AddItem("Keeper")
                .AddCell(fairShareDesciptionField).SetValue("The owner of the organization keeps all the income to himself, ignores the contributions").ElementItem
                .AddCell(fairShareRatingField).ElementItem;

            var sharerItem = fairShareElement.AddItem("Sharer")
                .AddCell(fairShareDesciptionField).SetValue("The organization shares it's income with its employees based on their contributions").ElementItem
                .AddCell(fairShareRatingField).ElementItem;

            // Main element
            var mainElement = resourcePool.ElementSet.First();
            mainElement.DirectIncomeField.Name = "Sales Price";
            mainElement.MultiplierField.Name = "Number of Sales";
            
            var industryField = mainElement.AddField("Industry", ElementFieldDataType.Element);
            industryField.SelectedElement = industryElement;
            
            var licenseField = mainElement.AddField("License", ElementFieldDataType.Element);
            licenseField.SelectedElement = licenseElement;
            
            var fairShareField = mainElement.AddField("Fair Share", ElementFieldDataType.Element);
            fairShareField.SelectedElement = fairShareElement;
            
            // Resource pool index; use to Sales Price itself
            mainElement.DirectIncomeField.EnableIndex(ElementFieldIndexSortType.LowestToHighest);

            // Items, cell, user cells
            var itemIndex = 0;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Cosmetics (Profit & Keeper)";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(110M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(cosmeticsItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(fairShareField).SetValue(keeperItem);

            itemIndex = 1;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Cosmetics (Nonprofit & Keeper)";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(cosmeticsItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(fairShareField).SetValue(keeperItem);

            itemIndex = 2;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Cosmetics (Profit & Sharer)";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(110M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(cosmeticsItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(fairShareField).SetValue(sharerItem);

            itemIndex = 3;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Cosmetics (Nonprofit & Sharer)";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(cosmeticsItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(fairShareField).SetValue(sharerItem);

            itemIndex = 4;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Cosmetics (Profit & Keeper)";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(110M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(cosmeticsItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(fairShareField).SetValue(keeperItem);

            itemIndex = 5;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Cosmetics (Nonprofit & Keeper)";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(cosmeticsItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(fairShareField).SetValue(keeperItem);

            itemIndex = 6;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Cosmetics (Profit & Sharer)";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(110M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(cosmeticsItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(fairShareField).SetValue(sharerItem);

            itemIndex = 7;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Cosmetics (Nonprofit & Sharer)";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(cosmeticsItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(fairShareField).SetValue(sharerItem);

            itemIndex = 8;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Education (Profit & Keeper)";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(110M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(educationItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(fairShareField).SetValue(keeperItem);

            itemIndex = 9;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Education (Nonprofit & Keeper)";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(educationItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(fairShareField).SetValue(keeperItem);

            itemIndex = 10;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Education (Profit & Sharer)";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(110M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(educationItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(fairShareField).SetValue(sharerItem);

            itemIndex = 11;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Education (Nonprofit & Sharer)";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(educationItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(fairShareField).SetValue(sharerItem);

            itemIndex = 12;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Education (Profit & Keeper)";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(110M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(educationItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(fairShareField).SetValue(keeperItem);

            itemIndex = 13;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Education (Nonprofit & Keeper)";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(educationItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(fairShareField).SetValue(keeperItem);

            itemIndex = 14;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Education (Profit & Sharer)";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(110M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(educationItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(fairShareField).SetValue(sharerItem);

            itemIndex = 15;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Education (Nonprofit & Sharer)";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(educationItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(fairShareField).SetValue(sharerItem);

            itemIndex = 16;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Entertainment (Profit & Keeper)";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(110M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(entertainmentItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(fairShareField).SetValue(keeperItem);

            itemIndex = 17;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Entertainment (Nonprofit & Keeper)";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(entertainmentItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(fairShareField).SetValue(keeperItem);

            itemIndex = 18;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Entertainment (Profit & Sharer)";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(110M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(entertainmentItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(fairShareField).SetValue(sharerItem);

            itemIndex = 19;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Entertainment (Nonprofit & Sharer)";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(entertainmentItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(fairShareField).SetValue(sharerItem);

            itemIndex = 20;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Entertainment (Profit & Keeper)";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(110M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(entertainmentItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(fairShareField).SetValue(keeperItem);

            itemIndex = 21;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Entertainment (Nonprofit & Keeper)";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(entertainmentItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(fairShareField).SetValue(keeperItem);

            itemIndex = 22;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Entertainment (Profit & Sharer)";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(110M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(entertainmentItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(fairShareField).SetValue(sharerItem);

            itemIndex = 23;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Entertainment (Nonprofit & Sharer)";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(entertainmentItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(fairShareField).SetValue(sharerItem);

            itemIndex = 24;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Healthcare (Profit & Keeper)";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(110M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(healthcareItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(fairShareField).SetValue(keeperItem);

            itemIndex = 25;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Healthcare (Nonprofit & Keeper)";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(healthcareItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(fairShareField).SetValue(keeperItem);

            itemIndex = 26;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Healthcare (Profit & Sharer)";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(110M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(healthcareItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(fairShareField).SetValue(sharerItem);

            itemIndex = 27;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Healthcare (Nonprofit & Sharer)";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(healthcareItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(fairShareField).SetValue(sharerItem);

            itemIndex = 28;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Healthcare (Profit & Keeper)";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(110M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(healthcareItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(fairShareField).SetValue(keeperItem);

            itemIndex = 29;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Healthcare (Nonprofit & Keeper)";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(healthcareItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(fairShareField).SetValue(keeperItem);

            itemIndex = 30;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Healthcare (Profit & Sharer)";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(110M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(healthcareItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(fairShareField).SetValue(sharerItem);

            itemIndex = 31;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Healthcare (Nonprofit & Sharer)";
            mainElement.ElementItemSet.Skip(itemIndex).First().DirectIncomeCell.SetValue(100M);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(healthcareItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(fairShareField).SetValue(sharerItem);

            // Return
            return resourcePool;
        }

        public ResourcePool CreateDefaultResourcePool(User user, string resourcePoolName, bool useFixedResourcePoolRate, string mainElementName, bool addDirectIncomeField, bool addMultiplierField, bool addImportanceIndex, int numberOfItems)
        {
            // Resource pool, main element, fields
            var resourcePool = new ResourcePool(user, resourcePoolName);

            if (useFixedResourcePoolRate)
            {
                resourcePool.UseFixedResourcePoolRate = true;
                resourcePool.AddUserResourcePool(10);
            }

            // Main element
            var element = resourcePool.AddElement(mainElementName);
            element.IsMainElement = true;

            // Resource pool field
            if (addDirectIncomeField)
                element.AddField("Direct Income", ElementFieldDataType.DirectIncome, true);

            // Multiplier field
            if (addMultiplierField)
                element.AddField("Multiplier", ElementFieldDataType.Multiplier);

            // Importance field
            ElementField importanceField = null;
            if (addImportanceIndex)
            {
                importanceField = element.AddField("Importance Field", ElementFieldDataType.Decimal, false);
                importanceField.EnableIndex();
            }

            // Items, cells, user cells
            for (var i = 1; i <= numberOfItems; i++)
            {
                var itemName = string.Format("Item {0}", i);

                var item = element.AddItem(itemName);

                if (addDirectIncomeField)
                    item.AddCell(element.DirectIncomeField).SetValue(100M); // Default value

                if (addMultiplierField)
                    item.AddCell(element.MultiplierField);

                if (addImportanceIndex)
                    item.AddCell(importanceField);
            }

            // Return
            return resourcePool;
        }

        #endregion
    }
}
