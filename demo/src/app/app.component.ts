import { Component } from "@angular/core";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
})
export class AppComponent {
    public someProperty = "text from property";
    public someOtherProperty = "text from other property";

    public someFunction(...args) {
        return `text from function ${args.join(", ")}`.trim();
    }

    public someOtherFunction(...args) {
        return `text from other function ${args.join(", ")}`.trim();
    }
}
