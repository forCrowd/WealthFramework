export function analyticsConfig(analyticsProvider: any, settings: any) {
    analyticsProvider.setAccount(settings.analyticsTrackingCode)
        .setDomainName(settings.analyticsDomainName)
        .ignoreFirstPageLoad(true);
}
