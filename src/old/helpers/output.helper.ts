import { Piumino } from "../piumino";
import { Selector, TestDefinition } from "../../types";
import { Util } from "../util";

declare module "../piumino" {
    interface Piumino<T> {
        testOutput(selector: Selector, output: string, destination: string, ...modifyValue: any): TestDefinition;
    }
}

Piumino.prototype.testOutput = function(selector, output, destination, ...modifyValue) {
    return [
        `should wire output '${output}' to ${Util.getSelectorName(selector)}`,
        () => {
            const element = Util.getElementBySelector(this.fixture, selector);
            const isAngularType = Util.isAngularType(element);
            jest.spyOn(this.component, destination);

            expect(this.component[destination]).not.toHaveBeenCalled();

            if (modifyValue.length) {
                const emitValue = modifyValue[modifyValue.length - 1];
                isAngularType
                    ? element.componentInstance[output].emit(emitValue)
                    : element.nativeElement.dispatchEvent(new CustomEvent(output, { detail: emitValue }));
                expect(this.component[destination]).toHaveBeenCalledWith(...modifyValue);
            } else {
                isAngularType
                    ? element.componentInstance[output].emit()
                    : element.nativeElement.dispatchEvent(new Event(output));
                expect(this.component[destination]).toHaveBeenCalled();
            }
        }
    ];
}
