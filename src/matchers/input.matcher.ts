import deepEqual from "fast-deep-equal/es6";
import { NgHelper } from "../helpers/ng.helper";
import { ObjectHelper } from "../helpers/object.helper";
import { Matcher, MatcherFinisher, MatcherState } from "./matcher";

export interface InputMatcherState extends MatcherState {
    inputSelector: string;
}

export class InputMatcher extends Matcher {
    protected override state!: InputMatcherState;

    public constructor(state: InputMatcherState) {
        super(state);
    }

    public toEqual(value: unknown): MatcherFinisher {
        this.setDescription(`equal '${value}'`, this.getDescriptionModifier());
        this.setMatcher(() => {
            const element = this.getElement();
            const input = NgHelper.getProperty(element, this.state.inputSelector);

            return [deepEqual(input, value), input];
        });

        return this;
    }

    public toBeBoundTo(property: string, modifyValue: any = "binding"): MatcherFinisher {
        this.setDescription(`be bound to '${property}'`, this.getDescriptionModifier());
        this.setMatcher(() => {
            this.checkComponentHasProperty(property);

            const element = this.getElement();
            const component = this.getComponent();

            // TODO: What to do if the property is a getter?
            // Getters can now only be checked using isEqual.

            ObjectHelper.setProperty(component, property, modifyValue);
            this.state.getFixture().detectChanges();

            const input = NgHelper.getProperty(element, this.state.inputSelector);
            const componentValue = ObjectHelper.getProperty(component, property);

            // TODO: Should we return the compared values to aid debugging?
            return deepEqual(input, componentValue);
        });

        return this;
    }

    public toCall(func: string): MatcherFinisher {
        this.setDescription(`call '${func}'`, this.getDescriptionModifier());
        this.setMatcher(() => {
            this.checkComponentHasProperty(func);

            const component = this.getComponent();
            let hasBeenCalled = false;

            ObjectHelper.replaceFunction(component, func, (...args: any[]) => {
                hasBeenCalled = true;
            });

            this.state.getFixture().detectChanges();
            ObjectHelper.restoreFunction(component, func);

            // TODO: Should we also check if the return value of the function is assigned to the input property?
            // const input = NgHelper.getProperty(element, this.state.inputSelector);

            return hasBeenCalled;
        });

        return this;
    }

    private getDescriptionModifier(): string {
        return `input '${this.state.inputSelector}'`;
    }
}
