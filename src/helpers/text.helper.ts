import { Piumino } from "../piumino";
import { Selector, TestDefinition } from "../types";
import { Util } from "../util";

declare module "../piumino" {
    interface Piumino<T> {
        testText(selector: Selector, value: any): TestDefinition;
    }
}

Piumino.prototype.testText = function(selector, value) {
    return [
        `${Util.getSelectorName(selector)} should have text '${value}'`,
        () => {
            const element = Util.getElementBySelector(this.fixture, selector);
            const text = element.nativeElement.textContent.trim();

            expect(text).toEqual(value);
        }
    ];
}
