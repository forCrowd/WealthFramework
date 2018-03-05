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
     * Content settings: Project & element IDs that are used in the content
     */
    content: {
        projectId: -1,
        prologue_MainElementId: -1,
        priority_MainElementId: -1,
        knowledge_MainElementId: -1,
        knowledgeLicenses_MainElementId: -1,
        allInOne_MainElementId: -1,

        // Not in use
        totalCostExisting_MainElementId: -1,
        totalCostNew_MainElementId: -1,
        introduction_MainElementId: -1,
        basicsExisting_MainElementId: -1,
        basicsNew_MainElementId: -1,
    }
};
