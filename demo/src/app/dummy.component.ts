import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: "dummy",
    templateUrl: "./dummy.component.html",
})
export class DummyComponent {
    @Input()
    public inputA: string;
    @Input()
    public inputB: string;
    @Input()
    public inputC: string;
    @Input()
    public inputD: string;

    @Output()
    public outputA: EventEmitter<string> = new EventEmitter();
    @Output()
    public outputB: EventEmitter<string> = new EventEmitter();
    @Output()
    public outputC: EventEmitter<string> = new EventEmitter();
    @Output()
    public outputD: EventEmitter<string> = new EventEmitter();
    @Output()
    public outputE: EventEmitter<string> = new EventEmitter();
}
