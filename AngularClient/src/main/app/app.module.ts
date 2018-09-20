// External
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToasterModule} from 'angular2-toaster';
import { FormsModule } from "@angular/forms";
import { BrowserModule, Title } from "@angular/platform-browser";
import { MomentModule } from "angular2-moment";

import { CoreModule } from "../core/core.module";
import { LoggerModule } from "../logger/logger.module";
import { AccountModule } from "../account/account.module";

import { AppComponent } from "./app.component";

import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';

@NgModule({
    bootstrap: [
        AppComponent
    ],
    declarations: [
        AppComponent
    ],
    imports: [
        // External
        BrowserModule,
        BrowserAnimationsModule,
        ToasterModule,
        ToasterModule.forRoot(),
        FormsModule,
        MomentModule,
        Angulartics2Module.forRoot([Angulartics2GoogleAnalytics]),

        // Internal
        LoggerModule,
        CoreModule,
        AccountModule,
    ],
    providers: [
        Title
    ]
})
export class AppModule { }
