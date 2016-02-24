/* User table insert / coni2k - 12 Feb. '16 */
INSERT INTO [User]
(FirstName, MiddleName, LastName, Notes, CreatedOn, ModifiedOn, Email, EmailConfirmed, PasswordHash, SecurityStamp, PhoneNumberConfirmed, TwoFactorEnabled, LockoutEnabled, AccessFailedCount, UserName)
SELECT '', '', '', NULL, '', '', '', 0, '', '', 0, 0, 0, 0, ''

/* User resource pool - fields - cells */
