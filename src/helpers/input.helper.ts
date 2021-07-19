import { DebugElement, Type } from "@angular/core";
import { Piumino } from "../piumino";
import { Selector, TestDefinition } from "../types";
import { Util } from "../util";

declare module "../piumino" {
    interface Piumino<T> {
        testInput(selector: Selector, input: string, source: string, modifyValue: any): TestDefinition;
    }
}

Piumino.prototype.testInput = function(selector, input, source, modifyValue) {
    return [
        `should wire input '${input}' to ${Util.getSelectorName(selector)}`,
        () => {
            const element = Util.getElementBySelector(this.fixture, selector);

            assert(element, input, this.component, source);

            Util.setProperty(this.component, source, modifyValue);
            this.fixture.detectChanges();

            assert(element, input, this.component, source);
        }
    ];
}

function assert(element: DebugElement, input: string, component: Type<any>, source: string): void {
    const inputValue = Util.isAngularType(element) ? element.componentInstance[input] : element.properties[input];
    let sourceValue = Util.getProperty(component, source);
    sourceValue = Util.isFunction(sourceValue) ? sourceValue() : sourceValue;

    expect(inputValue).toEqual(sourceValue);
}
