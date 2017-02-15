import { Component } from "@angular/core";

//declare const __moduleName: string;

@Component({
    moduleId: module.id,
    selector: "survey",
    templateUrl: "survey.component.html"
})
export class SurveyComponent {
    surveyConfig: any = { username: "sample", resourcePoolKey: "Knowledge-Index-Popular-Software-Licenses" };
}
