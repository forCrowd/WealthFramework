import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";

import { User } from "../entities/user";
import { DataService } from "../services/data.service";
import { Angulartics2GoogleAnalytics, GoogleAnalyticsService } from "../services/google-analytics.service";
import { Logger, ToasterConfig } from "../services/logger.service";
import { Settings } from "../settings/settings";

@Component({
    moduleId: module.id,
    selector: "app",
    templateUrl: "app.component.html?v=" + Settings.version
})
export class AppComponent implements OnDestroy, OnInit {

    applicationInfo: { Version: string } = { Version: Settings.version };
    currentUser: User = null;
    hideAnonymousAccountInfoBox: boolean = true;
    subscriptions: any[] = [];
    toasterConfig: ToasterConfig = null;

    constructor(private activatedRoute: ActivatedRoute,
        angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
        private dataService: DataService,
        private googleAnalyticsService: GoogleAnalyticsService,
        private logger: Logger,
        private titleService: Title,
        private router: Router) {
    }

    closeAnonymousAccountInfoBox(): void {
        this.hideAnonymousAccountInfoBox = true;
    }

    currentUserChanged(newUser: User) {
        this.currentUser = newUser;
        this.hideAnonymousAccountInfoBox = true;
    }

    currentUserText(): string {

        let userText = this.currentUser.UserName;

        if (this.currentUser.IsAnonymous) {
            userText += " (Guest)";
        }

        return userText;
    }

    hideAnonymousAccountInfoIcon(): boolean {
        return !(this.currentUser === null && this.currentUser.IsAnonymous);
    }

    logout(): void {
        this.dataService.logout()
            .subscribe(() => {
                this.router.navigate([""]);
            });
    }

    navigate(command: string): void {
        this.router.navigate([command]);
    }

    ngOnDestroy(): void {
        for (let i = 0; i < this.subscriptions.length; i++) {
            this.subscriptions[i].unsubscribe();
        }
    }

    ngOnInit(): void {

        // Title
        // https://toddmotto.com/dynamic-page-titles-angular-2-router-events
        this.router.events
            .filter(event => event instanceof NavigationEnd)
            .map(() => this.activatedRoute)
            .map(route => {
                while (route.firstChild) { route = route.firstChild; }
                return route;
            })
            .filter(route => route.outlet === "primary")
            .mergeMap(route => route.data)
            .subscribe((data: any) => {
                if (data.title) {
                    this.titleService.setTitle("Wealth Economy - " + data.title);
                }
            });

        // Setup google analytics
        this.googleAnalyticsService.configureTrackingCode(Settings.analyticsTrackingCode, Settings.analyticsDomainName);

        // Current user
        this.subscriptions.push(
            this.dataService.currentUserChanged$.subscribe((newUser: User) => this.currentUserChanged(newUser)));

        // Toaster config
        this.toasterConfig = this.logger.getToasterConfig();
    }

    showAnonymousAccountInfoBox(): void {
        this.hideAnonymousAccountInfoBox = false;
    }
}
