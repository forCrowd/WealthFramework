import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";

import { User } from "../app-entity-manager/entities/user";
import { AccountService } from "../account/account.module";
import { Angulartics2GoogleAnalytics } from "../core/core.module";
import { Logger, ToasterConfig } from "../logger/logger.module";
import { AppSettings } from "../../app-settings/app-settings";

@Component({
    selector: "app",
    templateUrl: "app.component.html"
})
export class AppComponent implements OnDestroy, OnInit {

    appVersion: string = AppSettings.version;
    currentUser: User = null;
    hideAnonymousAccountInfoBox: boolean = true;
    subscriptions: any[] = [];
    toasterConfig: ToasterConfig = null;

    constructor(private activatedRoute: ActivatedRoute,
        angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
        private accountService: AccountService,
        private logger: Logger,
        private titleService: Title,
        private router: Router) {
        this.currentUser = this.accountService.currentUser;
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
        this.accountService.logout()
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

        // Current user
        this.subscriptions.push(
            this.accountService.currentUserChanged$.subscribe((newUser: User) => this.currentUserChanged(newUser)));

        // Toaster config
        this.toasterConfig = this.logger.getToasterConfig();
    }

    showAnonymousAccountInfoBox(): void {
        this.hideAnonymousAccountInfoBox = false;
    }
}
