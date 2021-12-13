import { NgHelper } from "../helpers/ng.helper";
import { ObjectHelper } from "../helpers/object.helper";
import { PiuminoError, TestDefinition } from "../types";
import { Matcher, MatcherState } from "./matcher";

export interface InputMatcherState extends MatcherState {
    inputSelector: string;
}

export class InputMatcher extends Matcher {
    protected override state!: InputMatcherState;

    public constructor(state: InputMatcherState) {
        super(state);
    }

    public toEqual(value: any): TestDefinition {
        return [
            this.getTestDescription(`equal '${value}'`),
            () => {
                const element = this.getElement();
                const input = NgHelper.getProperty(element, this.state.inputSelector);

                if (this.negate) {
                    expect(input).not.toEqual(value);
                } else {
                    expect(input).toEqual(value);
                }
            }
        ]
    }

    public toBeBoundTo(property: string, modifyValue: any = "binding"): TestDefinition {
        return [
            this.getTestDescription(`be bound to '${property}'`),
            () => {
                const element = this.getElement();
                const component = this.getComponent();

                // What to do if the property is a getter?

                ObjectHelper.setProperty(component, property, modifyValue);
                this.state.getFixture().detectChanges();

                const input = NgHelper.getProperty(element, this.state.inputSelector);
                const componentValue = ObjectHelper.getProperty(component, property);

                if (this.negate) {
                    expect(input).not.toEqual(componentValue);
                } else {
                    expect(input).toEqual(componentValue);
                }
            }
        ]
    }

    public toCall(func: string): TestDefinition {
        return [
            this.getTestDescription(`call '${func}'`),
            () => {
                const element = this.getElement();
                const component = this.getComponent();
                let hasBeenCalled = false;

                ObjectHelper.replaceFunction(component, func, (...args: any[]) => {
                    hasBeenCalled = true;
                    return "binding";
                });

                this.state.getFixture().detectChanges();
                ObjectHelper.restoreFunction(component, func);

                const input = NgHelper.getProperty(element, this.state.inputSelector);

                if (this.negate) {
                    if (hasBeenCalled) {
                        throw new PiuminoError(`Expected '${func}' not to have been called`);
                    }

                    this.dummyExpect();
                } else {
                    if (!hasBeenCalled) {
                        throw new PiuminoError(`Expected '${func}' to have been called`);
                    }

                    expect(input).toEqual("binding");
                }
            }
        ]
    }

    private getTestDescription(description: string): string {
        return `'${this.state.selector}' input '${this.state.inputSelector}' ${this.negate ? "should not" : "should"} ${description}`;
    }
}
