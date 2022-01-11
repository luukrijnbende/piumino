import { DebugElement } from "@angular/core";
import deepEqual from "fast-deep-equal/es6";
import { NgHelper } from "../helpers/ng.helper";
import { ObjectHelper } from "../helpers/object.helper";
import { MatcherChainWithFinisher, NOTHING } from "../types";
import { Matcher, MatcherState } from "./matcher";
import { ModifyWithMatcher } from "./modify-with.matcher";
import { ToCallWithMatcher } from "./to-call-with.matcher";

export interface OutputMatcherState extends MatcherState {
    outputSelector: string;
}

export class OutputMatcher extends Matcher {
    protected override state!: OutputMatcherState;

    public constructor(state: OutputMatcherState) {
        super(state);
    }

    /**
     * Expect the output of the selected element to be bound to the provided property of the fixture's component.\
     * NOTE: Does not work for setters if there is no getter.
     * 
     * (output)="property = $event"
     * 
     * @param property - The property of the fixture's component that should be bounded to the output of the selected element.
     */
    public toBeBoundTo(property: string): MatcherChainWithFinisher<ModifyWithMatcher> {
        this.setDescription(`be bound to '${property}'`, this.getDescriptionModifier());
        this.setMatcher((payload: unknown = "binding") => {
            this.checkComponentHasProperty(property);
            
            this.dispatchEvent(payload);

            // TODO: What to do if the property is a setter without a getter?

            const component = this.getComponent();
            const componentValue = ObjectHelper.getProperty(component, property);

            return [deepEqual(componentValue, payload), componentValue, payload];
        });

        return new ModifyWithMatcher({ ...this.state });
    }

    /**
     * Expect the output of the selected element to call the provided function of the fixture's component.
     * 
     * (output)="func()"
     * 
     * @param func - The function of the fixture's component that should be called by the output of the selected element.
     */
    public toCall(func: string): MatcherChainWithFinisher<ToCallWithMatcher> {
        this.setDescription(`call '${func}'`, this.getDescriptionModifier());
        this.setMatcher((payload: unknown = NOTHING) => {
            this.checkComponentHasProperty(func);

            const component = this.getComponent();
            let hasBeenCalled = false;
            let callValues;

            ObjectHelper.replaceFunction(component, func, (...args: unknown[]) => {
                hasBeenCalled = true;
                callValues = args.length ? args : NOTHING;
            });

            this.dispatchEvent(payload);
            ObjectHelper.restoreFunction(component, func);

            return [hasBeenCalled, callValues, NOTHING];
        });

        return new ToCallWithMatcher({ ...this.state });
    }

    // TODO: toCallThrough

    private getDescriptionModifier(): string {
        return `output '${this.state.outputSelector}'`;
    }

    private dispatchEvent(payload: unknown = NOTHING): void {
        const element = this.getElement();
        const output = NgHelper.getProperty(element, this.state.outputSelector);

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

    private dispatchNativeEvent(element: DebugElement, payload: unknown): boolean {
        const [outputSelector, eventType] = this.state.outputSelector.split(".");

        if (payload instanceof Event) {
            return element.nativeElement.dispatchEvent(payload);
        }

        if (["keydown", "keyup"].includes(outputSelector)) {
            return element.nativeElement.dispatchEvent(new KeyboardEvent(outputSelector, { key: eventType }));
        }

        return element.nativeElement.dispatchEvent(new Event(outputSelector));
    }
}
