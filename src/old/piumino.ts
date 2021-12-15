import { ComponentFixtureLike, TestDefinition } from "../types";

export class Piumino<T> {
    public fixture: ComponentFixtureLike;
    public component: T;

    public init(fixture: ComponentFixtureLike, component: T) {
        this.fixture = fixture;
        this.component = component;
    }

    public before(definition: TestDefinition, before: () => void): TestDefinition {
        return [
            definition[0],
            () => {
                before();
                this.fixture.detectChanges();
    
                definition[1]();
            }
        ];
    }
    
    public after(definition: TestDefinition, after: () => void): TestDefinition {
        return [
            definition[0],
            () => {
                definition[1]();
    
                this.fixture.detectChanges();
                after();
            }
        ];
    }
}
