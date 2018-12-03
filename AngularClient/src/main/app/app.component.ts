import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { AuthService, User } from "@forcrowd/backbone-client-core";
import { Subscription } from "rxjs";
import { mergeMap, map, filter } from "rxjs/operators";

import { Angulartics2GoogleAnalytics } from "../core/core.module";

import { Logger, ToasterConfig } from "../logger/logger.module";
import { AppSettings } from "../../app-settings/app-settings";

@Component({
  selector: "app",
  templateUrl: "app.component.html"
})
export class AppComponent implements OnDestroy, OnInit {

  appVersion = AppSettings.version;
  currentUser: User = null;
  hideGuestAccountInfoBox: boolean = true;
  subscriptions: Subscription[] = [];
  toasterConfig: ToasterConfig = null;

  constructor(private activatedRoute: ActivatedRoute,
    angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
    private authService: AuthService,
    private logger: Logger,
    private titleService: Title,
    private router: Router) {
    this.currentUser = this.authService.currentUser;
  }

  closeGuestAccountInfoBox(): void {
    this.hideGuestAccountInfoBox = true;
  }

  currentUserChanged(newUser: User) {
    this.currentUser = newUser;
    this.hideGuestAccountInfoBox = true;
  }

  logout(): void {
    this.authService.logout();
    this.authService.init()
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
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) { route = route.firstChild; }
        return route;
      }),
      filter(route => route.outlet === "primary"),
      mergeMap(route => route.data))
      .subscribe((data: any) => {
        if (data.title) {
          this.titleService.setTitle(`Wealth Framework - ${data.title}`);
        }
      });

    // Current user
    this.subscriptions.push(
      this.authService.currentUserChanged.subscribe((newUser: User) => this.currentUserChanged(newUser)));

    // Toaster config
    this.toasterConfig = this.logger.getToasterConfig();
  }

  showGuestAccountInfoBox(): void {
    this.hideGuestAccountInfoBox = false;
  }
}
