import { Component, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

@Component({
  selector: "app",
  template: `
<div class="container body-content">
    <div class="row">
        <div class="col-md-12">
            <h2>
                Dev Module - Basic Component
            </h2>
            <p>
                A lightweight versions of app-module to make quick sanity checks.
            </p>
            <hr />
            <p>
                <button type="button" (click)="consoleLog()">console log</button>
                <button type="button" (click)="error()">error</button>
            </p>
        </div>
    </div>
</div>
<footer class="footer"></footer>

`
})
export class AppComponent {

  consoleLog(): void {
    console.log("test");
  }

  error(): void {
    throw new Error("test");
  }
}

@NgModule({
  imports: [
    BrowserModule
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
