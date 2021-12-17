import deepEqual from "fast-deep-equal/es6";
import { NgHelper } from "../helpers/ng.helper";
import { ObjectHelper } from "../helpers/object.helper";
import { MatcherChainFinisher, MatcherChainWithFinisher, NOTHING } from "../types";
import { Matcher, MatcherState } from "./matcher";
import { ModifyWithMatcher } from "./modify-with.matcher";
import { ToCallWithMatcher } from "./to-call-with.matcher";

export interface InputMatcherState extends MatcherState {
    inputSelector: string;
}

export class InputMatcher extends Matcher {
    protected override state!: InputMatcherState;

    public constructor(state: InputMatcherState) {
        super(state);
    }

    /**
     * Expect the input of the selected element to equal the provided value.
     * 
     * input="value"
     * 
     * @param value - The value to compare with the input value of the selected element.
     * @returns 
     */
    public toEqual(value: unknown): MatcherChainFinisher<this> {
        this.setDescription(`equal '${value}'`, this.getDescriptionModifier());
        this.setMatcher(() => {
            this.checkElementHasProperty(this.state.inputSelector);

            const element = this.getElement();
            const input = NgHelper.getProperty(element, this.state.inputSelector);

            return [deepEqual(input, value), input, value];
        });

        return this;
    }

    /**
     * Expect the input of the selected element to be bound to the provided property of the fixture's component.\
     * NOTE: Does not work for getters.
     * 
     * [input]="property"
     * 
     * @param property - The property of the fixture's component that should be bounded to the input of the selected element.
     */
    public toBeBoundTo(property: string): MatcherChainWithFinisher<ModifyWithMatcher> {
        this.setDescription(`be bound to '${property}'`, this.getDescriptionModifier());
        this.setMatcher((payload: unknown = "binding") => {
            this.checkComponentHasProperty(property);
            this.checkElementHasProperty(this.state.inputSelector);

            const component = this.getComponent();
            const element = this.getElement();

            // TODO: What to do if the property is a getter?
            // Getters can now only be checked using isEqual.

            ObjectHelper.setProperty(component, property, payload);
            this.getFixture().detectChanges();

            const input = NgHelper.getProperty(element, this.state.inputSelector);
            const componentValue = ObjectHelper.getProperty(component, property);

            return [deepEqual(input, componentValue), input, componentValue];
        });

        return new ModifyWithMatcher({ ...this.state });
    }

    /**
     * Expect the input of the selected element to call the provided function of the fixture's component.
     * Also checks if the return value of the function is assigned to the input.
     * 
     * [input]="func()"
     * 
     * @param func - The function of the fixture's component that should be called by the input of the selected element.
     */
    public toCall(func: string): MatcherChainWithFinisher<ToCallWithMatcher> {
        this.setDescription(`call '${func}'`, this.getDescriptionModifier());
        this.setMatcher(() => {
            this.checkComponentHasProperty(func);
            this.checkElementHasProperty(this.state.inputSelector);

            const component = this.getComponent();
            const element = this.getElement();
            let hasBeenCalled = false;
            let callValues;

            ObjectHelper.replaceFunction(component, func, (...args: unknown[]) => {
                hasBeenCalled = true;
                callValues = args.length ? args : NOTHING;

                return "binding";
            });

            this.getFixture().detectChanges();
            ObjectHelper.restoreFunction(component, func);

            // TODO: Maybe split this into a separate matcher, but probably not necessary.
            const input = NgHelper.getProperty(element, this.state.inputSelector);

            return [hasBeenCalled && input === "binding", callValues, NOTHING];
        });

        return new ToCallWithMatcher({ ...this.state });
    }

    // TODO: toCallThrough

    private getDescriptionModifier(): string {
        return `input '${this.state.inputSelector}'`;
    }
}
