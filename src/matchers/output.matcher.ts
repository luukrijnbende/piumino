import { NgHelper } from "../helpers/ng.helper";
import { ObjectHelper } from "../helpers/object.helper";
import { PiuminoError, TestDefinition } from "../types";
import { Matcher, MatcherState } from "./matcher";

const NO_EVENT_PAYLOAD = Symbol('NO_EVENT_PAYLOAD');

export interface OutputMatcherState extends MatcherState {
    outputSelector: string;
}

export class OutputMatcher extends Matcher {
    protected override state!: OutputMatcherState;

    public constructor(state: OutputMatcherState) {
        super(state);
    }

    public toBeBoundTo(property: string, modifyValue: any = "binding"): TestDefinition {
        return [
            this.getTestDescription(`bound to '${property}'`),
            () => {
                const component = this.getComponent();

                this.dispatchEvent(modifyValue);

                const componentValue = ObjectHelper.getProperty(component, property);

                if (this.negate) {
                    expect(componentValue).not.toEqual(modifyValue);
                } else {
                    expect(componentValue).toEqual(modifyValue);
                }
            }
        ]
    }

    public toCall(func: string, ...values: any[]): TestDefinition {
        return [
            this.getTestDescription(`call '${func}'`),
            () => {
                const component = this.getComponent();
                let hasBeenCalled = false;
                let callValues;

                ObjectHelper.replaceFunction(component, func, (...args: any[]) => {
                    hasBeenCalled = true;
                    callValues = args;
                });

                this.dispatchEvent(values ? values[values.length - 1] : NO_EVENT_PAYLOAD);
                ObjectHelper.restoreFunction(component, func);

                if (!this.negate && !hasBeenCalled) {
                    throw new PiuminoError(`Expected ${func} to have been called`);
                }

                if (this.negate && hasBeenCalled) {
                    throw new PiuminoError(`Expected ${func} not to have been called`);
                }

                if (callValues) {
                    expect(values).toEqual(callValues);
                }

                this.dummyExpect();
            }
        ]
    }

    private getTestDescription(description: string): string {
        return `'${this.state.selector}' output '${this.state.outputSelector}' ${this.negate ? "should not" : "should"} ${description}`;
    }

    // TODO: toCallThrough

    private dispatchEvent(payload: any = NO_EVENT_PAYLOAD): void {
        const element = this.getElement();
        const output = NgHelper.getProperty(element, this.state.outputSelector, false);

        if (output?.emit) {
            if (payload === NO_EVENT_PAYLOAD) {
                output.emit();
            } else {
                output.emit(payload);
            }
        } else {
            this.dispatchNativeEvent(element, payload);
        }
    }

    private dispatchNativeEvent(element: HTMLElement, payload: any): boolean {
        const [outputSelector, eventType] = this.state.outputSelector.split(".");

        if (payload instanceof Event) {
            return element.dispatchEvent(payload);
        }

        if (["keydown", "keyup"].includes(outputSelector)) {
            return element.dispatchEvent(new KeyboardEvent(outputSelector, { key: eventType }));
        }

        return element.dispatchEvent(new Event(outputSelector));
    }
}
