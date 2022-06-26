import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { DummyComponent } from "./dummy.component";

@NgModule({
    declarations: [
        AppComponent,
        DummyComponent,
    ],
    imports: [
        BrowserModule,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
