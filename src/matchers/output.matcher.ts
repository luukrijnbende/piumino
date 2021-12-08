import { EventEmitter } from "@angular/core";
import { NgHelper } from "../helpers/ng.helper";
import { PiuminoError, TestDefinition } from "../types";
import { Matcher, MatcherState } from "./matcher";

const NO_EVENT_PAYLOAD = Symbol('NO_EVENT_PAYLOAD');

export interface OutputMatcherState extends MatcherState {
    outputSelector: string;
}

type ComponentFunction = (...args: any[]) => void;

export class OutputMatcher extends Matcher {
    protected override state!: OutputMatcherState;
    private originalComponentFunctions: Map<string, ComponentFunction> = new Map();

    public constructor(state: OutputMatcherState) {
        super(state);
    }

    public toBeBoundTo(variable: string, modifyValue: any = "binding"): TestDefinition {
        return [
            `'${this.state.selector}' input '${this.state.outputSelector}' should be wired to '${variable}'`,
            () => {
                const element = this.getElement();
                const component = this.getComponent();

                // What to do if the variable is a getter?
                // What to do if the variable is a function?

                component[variable] = modifyValue;
                this.state.getFixture().detectChanges();

                const input = NgHelper.getProperty(element, this.state.outputSelector);

                expect(input).toEqual(component[variable]);
            }
        ]
    }

    public toCall(func: string, ...values: any[]): TestDefinition {
        return [
            `'${this.state.selector}' output '${this.state.outputSelector}' ${this.negate ? "should not" : "should"} call '${func}'`,
            () => {
                let hasBeenCalled = false;
                let callValues;

                this.replaceComponentFunction(func, (...args: any[]) => {
                    hasBeenCalled = true;
                    callValues = args;
                });

                this.dispatchEvent(values ? values[values.length - 1] : NO_EVENT_PAYLOAD);
                this.restoreComponentFunction(func);

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

    private replaceComponentFunction(func: string, implementation: ComponentFunction): void {
        const component = this.getComponent();

        this.originalComponentFunctions.set(func, component[func]);
        component[func] = implementation;
    }

    private restoreComponentFunction(func: string): void {
        const component = this.getComponent();

        component[func] = this.originalComponentFunctions.get(func);
        this.originalComponentFunctions.delete(func);
    }

    private dispatchEvent(payload: any = NO_EVENT_PAYLOAD): void {
        const element = this.getElement();
        const output = NgHelper.getProperty(element, this.state.outputSelector, true);

        if (payload === NO_EVENT_PAYLOAD) {
            if (output.emit) {
                output.emit();
            } else {
                element.dispatchEvent(new Event(this.state.outputSelector));
            }
        } else {
            if (output.emit) {
                output.emit(payload);
            } else {
                element.dispatchEvent(new CustomEvent(this.state.outputSelector, { detail: payload }));
            }
        }
    }
}