import deepEqual from "fast-deep-equal/es6";
import { NgHelper } from "../helpers/ng.helper";
import { ObjectHelper } from "../helpers/object.helper";
import { MatcherFinisher } from "../types";
import { Matcher, MatcherState } from "./matcher";

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
    public toEqual(value: unknown): MatcherFinisher<this> {
        this.setDescription(`equal '${value}'`, this.getDescriptionModifier());
        this.setMatcher(() => {
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
    public toBeBoundTo(property: string): MatcherFinisher<this> {
        this.setDescription(`be bound to '${property}'`, this.getDescriptionModifier());
        this.setMatcher((payload: unknown = "binding") => {
            this.checkComponentHasProperty(property);

            const element = this.getElement();
            const component = this.getComponent();

            // TODO: What to do if the property is a getter?
            // Getters can now only be checked using isEqual.

            // TODO: Add .modifyWith().

            ObjectHelper.setProperty(component, property, payload);
            this.getFixture().detectChanges();

            const input = NgHelper.getProperty(element, this.state.inputSelector);
            const componentValue = ObjectHelper.getProperty(component, property);

            return [deepEqual(input, componentValue), input, componentValue];
        });

        return this;
    }

    /**
     * Expect the input of the selected element to call the provided function of the fixture's component.
     * 
     * [input]="func()"
     * 
     * @param func - The function of the fixture's component that should be called by the input of the selected element.
     */
    public toCall(func: string): MatcherFinisher<this> {
        this.setDescription(`call '${func}'`, this.getDescriptionModifier());
        this.setMatcher(() => {
            this.checkComponentHasProperty(func);

            const component = this.getComponent();
            let hasBeenCalled = false;

            ObjectHelper.replaceFunction(component, func, (...args: unknown[]) => {
                hasBeenCalled = true;
            });

            this.getFixture().detectChanges();
            ObjectHelper.restoreFunction(component, func);

            // TODO: Should we also check if the return value of the function is assigned to the input property?
            // const input = NgHelper.getProperty(element, this.state.inputSelector);

            return [hasBeenCalled];
        });

        return this;
    }

    private getDescriptionModifier(): string {
        return `input '${this.state.inputSelector}'`;
    }
}
