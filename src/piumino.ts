import { ComponentFixture } from "@angular/core/testing";

export class Piumino<T> {
    public fixture: ComponentFixture<T>;
    public component: T;

    public init(fixture: ComponentFixture<T>, component: T) {
        this.fixture = fixture;
        this.component = component;
    }
}
