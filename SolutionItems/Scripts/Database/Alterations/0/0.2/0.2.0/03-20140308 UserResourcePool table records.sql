SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

BEGIN TRANSACTION;

INSERT INTO [dbo].[UserResourcePool]([UserId], [ResourcePoolId], [ResourcePoolRate], [TotalCostIndexRating], [KnowledgeIndexRating], [QualityIndexRating], [SectorIndexRating], [EmployeeSatisfactionIndexRating], [CustomerSatisfactionIndexRating], [DistanceIndexRating])

SELECT  t1.Id 'UserId', t2.Id 'ResourcePoolId', 1 'CRMP Rate', 100 'Cost', 0 'Knowledge', 0 'Quality', 0 'Sector', 0 'Employee', 0 'Customer', 0 'Distance' FROM    [User] t1 cross join ResourcePool t2 WHERE t2.Id = 1 UNION ALL
SELECT  t1.Id 'UserId', t2.Id 'ResourcePoolId', 1 'CRMP Rate', 0 'Cost', 100 'Knowledge', 0 'Quality', 0 'Sector', 0 'Employee', 0 'Customer', 0 'Distance' FROM    [User] t1 cross join ResourcePool t2 WHERE t2.Id = 2 UNION ALL
SELECT  t1.Id 'UserId', t2.Id 'ResourcePoolId', 1 'CRMP Rate', 0 'Cost', 0 'Knowledge', 100 'Quality', 0 'Sector', 0 'Employee', 0 'Customer', 0 'Distance' FROM    [User] t1 cross join ResourcePool t2 WHERE t2.Id = 3 UNION ALL
SELECT  t1.Id 'UserId', t2.Id 'ResourcePoolId', 1 'CRMP Rate', 0 'Cost', 0 'Knowledge', 0 'Quality', 100 'Sector', 0 'Employee', 0 'Customer', 0 'Distance' FROM    [User] t1 cross join ResourcePool t2 WHERE t2.Id = 4 UNION ALL
SELECT  t1.Id 'UserId', t2.Id 'ResourcePoolId', 1 'CRMP Rate', 0 'Cost', 0 'Knowledge', 0 'Quality', 0 'Sector', 100 'Employee', 0 'Customer', 0 'Distance' FROM    [User] t1 cross join ResourcePool t2 WHERE t2.Id = 5 UNION ALL
SELECT  t1.Id 'UserId', t2.Id 'ResourcePoolId', 1 'CRMP Rate', 0 'Cost', 0 'Knowledge', 0 'Quality', 0 'Sector', 0 'Employee', 100 'Customer', 0 'Distance' FROM    [User] t1 cross join ResourcePool t2 WHERE t2.Id = 6 UNION ALL
SELECT  t1.Id 'UserId', t2.Id 'ResourcePoolId', 1 'CRMP Rate', 0 'Cost', 0 'Knowledge', 0 'Quality', 0 'Sector', 0 'Employee', 0 'Customer', 100 'Distance' FROM    [User] t1 cross join ResourcePool t2 WHERE t2.Id = 7 UNION ALL

SELECT  t1.Id 'UserId',
		t2.Id 'ResourcePoolId',
		1 'CRMP Rate',
		t3.TotalCostIndexRating 'Cost',
		t3.KnowledgeIndexRating 'Knowledge',
		t3.QualityIndexRating 'Quality',
		t3.SectorIndexRating 'Sector',
		t3.EmployeeSatisfactionIndexRating 'Employee',
		t3.CustomerSatisfactionIndexRating 'Customer',
		t3.DistanceIndexRating 'Distance'
		FROM    [User] t1
		JOIN UserDistributionIndexRating t3 on t1.Id = t3.UserId
		cross join ResourcePool t2 WHERE t2.Id = 8

COMMIT;
RAISERROR (N'[dbo].[UserResourcePool]: Insert Batch: 1.....Done!', 10, 1) WITH NOWAIT;
GO
