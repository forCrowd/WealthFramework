import { APP_INITIALIZER, NgModule } from "@angular/core";

import { AuthService } from "./auth.service";
import { AuthGuard } from "./auth-guard.service";

export { AuthGuard, AuthService }

export function appInitializer(authService: AuthService) {
    // Do initing of services that is required before app loads
    // NOTE: this factory needs to return a function (that then returns a promise)
    // https://github.com/angular/angular/issues/9047
    return () => {
        return authService.init().toPromise();
    };
}

@NgModule({
    providers: [
        {
            "provide": APP_INITIALIZER,
            "useFactory": appInitializer,
            "deps": [AuthService],
            "multi": true,
        },
        AuthGuard,
        AuthService,
    ]
})
export class AuthModule { }
