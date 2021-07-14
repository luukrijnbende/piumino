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
        `should wire input "${input}" to ${Util.getSelectorName(selector)}`,
        () => {
            const element = Util.getElementBySelector(this.fixture, selector);
            const isComponent = element.nativeNode instanceof HTMLUnknownElement;

            expect(isComponent ? element.componentInstance[input] : element.properties[input])
                .toBe(Util.getProperty(this.component, source));

            Util.setProperty(this.component, source, modifyValue);
            this.fixture.detectChanges();

            expect(isComponent ? element.componentInstance[input] : element.properties[input])
                .toBe(Util.getProperty(this.component, source));
        }
    ];
}
