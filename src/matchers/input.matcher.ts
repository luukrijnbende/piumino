import { NgHelper } from "../helpers/ng.helper";
import { TestDefinition } from "../types";
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
            `'${this.state.selector}' input '${this.state.inputSelector}' should equal '${value}'`,
            () => {
                const element = this.getElement();
                const input = NgHelper.getProperty(element, this.state.inputSelector);

                expect(input).toEqual(value);
            }
        ]
    }

    public toBeBoundTo(variable: string, modifyValue: any = "binding"): TestDefinition {
        return [
            `'${this.state.selector}' input '${this.state.inputSelector}' should be wired to '${variable}'`,
            () => {
                const element = this.getElement();
                const component = this.getComponent();

                // What to do if the variable is a getter?
                // What to do if the variable is a function?

                component[variable] = modifyValue;
                this.state.getFixture().detectChanges();

                const input = NgHelper.getProperty(element, this.state.inputSelector);

                expect(input).toEqual(component[variable]);
            }
        ]
    }
}