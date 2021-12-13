import deepEqual from "fast-deep-equal/es6";
import { NgHelper } from "../helpers/ng.helper";
import { ObjectHelper } from "../helpers/object.helper";
import { NOTHING } from "../types";
import { Matcher, MatcherFinisher, MatcherState } from "./matcher";

export interface OutputMatcherState extends MatcherState {
    outputSelector: string;
}

export class OutputMatcher extends Matcher {
    protected override state!: OutputMatcherState;

    public constructor(state: OutputMatcherState) {
        super(state);
    }

    public toBeBoundTo(property: string, modifyValue: any = "binding"): MatcherFinisher {
        this.setDescription(`be bound to '${property}'`, this.getDescriptionModifier());
        this.setMatcher(() => {
            this.checkComponentHasProperty(property);
            this.dispatchEvent(modifyValue);

            // TODO: What to do if the property is a setter?

            const component = this.getComponent();
            const componentValue = ObjectHelper.getProperty(component, property);

            // TODO: Should we return the compared values to aid debugging?
            return deepEqual(componentValue, modifyValue);
        });

        return this;
    }

    public toCall(func: string, ...values: any[]): MatcherFinisher {
        this.setDescription(`call '${func}'`, this.getDescriptionModifier());
        this.setMatcher(() => {
            const component = this.getComponent();
            let hasBeenCalled = false;
            let callValues;

            ObjectHelper.replaceFunction(component, func, (...args: any[]) => {
                hasBeenCalled = true;
                callValues = args;
            });

            this.dispatchEvent(values ? values[values.length - 1] : NOTHING);
            ObjectHelper.restoreFunction(component, func);

            return hasBeenCalled;

            // TODO: Check values through chained .with().
            // if (callValues) {
            //     expect(values).toEqual(callValues);
            // }
        });

        return this;
    }

    // TODO: toCallThrough

    private getDescriptionModifier(): string {
        return `input '${this.state.outputSelector}'`;
    }

    private dispatchEvent(payload: any = NOTHING): void {
        const element = this.getElement();
        const output = NgHelper.getProperty(element, this.state.outputSelector, false);

        if (output?.emit) {
            if (payload === NOTHING) {
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
