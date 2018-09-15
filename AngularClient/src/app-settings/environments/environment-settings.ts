export const environment = {

    /**
     * Name of the current environment
     */
    name: "Development",

    /**
     * Google Analytics domain name
     * Leave blank to disable analytics
     */
    analyticsDomainName: "",

    /**
     * Google Analytics tracking code (e.g. UA-XXXXXXXX-X)
     * Leave blank to disable analytics
     */
    analyticsTrackingCode: "",

    /*
     * Service application (WebApi) url
     */
    serviceAppUrl: "http://localhost:15001",

    /*
     * Content settings: Project IDs that are used in the content
     */
    content: {
        prologueProjectId: 1,
        priorityProjectId: 2,
        knowledgeProjectId: 3,
        knowledgeLicensesProjectId: 4,
        allInOneProjectId: 5
    }
};
