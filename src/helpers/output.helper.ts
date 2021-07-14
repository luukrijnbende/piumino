import { Piumino } from "../piumino";
import { Selector, TestDefinition } from "../types";
import { Util } from "../util";

declare module "../piumino" {
    interface Piumino<T> {
        testOutput(selector: Selector, output: string, destination: string, modifyValue?: any): TestDefinition;
    }
}

Piumino.prototype.testOutput = function(selector, output, destination, modifyValue) {
    return [
        `should wire output "${output}" to ${Util.getSelectorName(selector)}`,
        () => {
            const element = Util.getElementBySelector(this.fixture, selector);
            const isComponent = element.nativeNode instanceof HTMLUnknownElement;
            jest.spyOn(this.component, destination);

            expect(this.component[destination]).not.toHaveBeenCalled();

            if (modifyValue) {
                isComponent
                    ? element.componentInstance[output].emit(modifyValue)
                    : element.nativeElement.dispatchEvent(new CustomEvent(output, { detail: modifyValue }));
                expect(this.component[destination]).toHaveBeenCalledWith(modifyValue);
            } else {
                isComponent
                    ? element.componentInstance[output].emit()
                    : element.nativeElement.dispatchEvent(new Event(output));
                expect(this.component[destination]).toHaveBeenCalled();
            }
        }
    ];
}
