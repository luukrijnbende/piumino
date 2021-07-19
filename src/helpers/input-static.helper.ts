import { Piumino } from "../piumino";
import { Selector, TestDefinition } from "../types";
import { Util } from "../util";

declare module "../piumino" {
    interface Piumino<T> {
        testInputStatic(selector: Selector, input: string, value: any): TestDefinition;
    }
}

Piumino.prototype.testInputStatic = function(selector, input, value) {
    return [
        `should wire static input '${input}' to ${Util.getSelectorName(selector)}`,
        () => {
            const element = Util.getElementBySelector(this.fixture, selector);
            const inputValue = Util.isAngularType(element) ? element.componentInstance[input] : element.properties[input];

            expect(inputValue).toEqual(value);
        }
    ];
}
