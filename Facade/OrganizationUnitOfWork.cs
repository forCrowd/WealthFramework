namespace Facade
{
    using BusinessObjects;
    using DataObjects;

    public partial class OrganizationUnitOfWork
    {
        UserOrganizationRepository userOrganizationRepository;

        public UserOrganizationRepository UserOrganizationRepository
        {
            get { return userOrganizationRepository ?? (userOrganizationRepository = new UserOrganizationRepository(Context)); }
        }

        public void Insert(Organization entity, int userId)
        {
            base.Insert(entity);

            // Sample user organization
            var sampleUserOrganization = new UserOrganization()
            {
                UserId = userId,
                Organization = entity,
                NumberOfSales = 0,
                QualityRating = 0,
                CustomerSatisfactionRating = 0,
                EmployeeSatisfactionRating = 0
            };
            UserOrganizationRepository.Insert(sampleUserOrganization);
        }
    }
}