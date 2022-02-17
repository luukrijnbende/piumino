import { DebugElement } from "@angular/core";
import { ElementFinder } from "../element-finder";
import { NgHelper } from "../helpers/ng.helper";
import { ObjectHelper } from "../helpers/object.helper";
import { ComponentFixtureLike, FluentChain, GenericObject, HandlerExecutionStrategy, MatcherHandler, NOTHING, TestDefinition } from "../types";
import { PiuminoErrorThrower } from "../util/error-thrower";

export interface MatcherState {
    elementFinder: ElementFinder;
    negate?: boolean;
    description?: string;
    errorDescription?: string;
    errorThrower: PiuminoErrorThrower;
    getFixture: () => ComponentFixtureLike | null;
    handler?: MatcherHandler;
    handlerExecutionStrategy?: HandlerExecutionStrategy;
}

export abstract class Matcher {
    protected state: MatcherState;

    public get not(): FluentChain<this> {
        this.state.negate = true;

        return this;
    }

    public constructor(state: MatcherState) {
        this.state = state;
    }

    public build(): TestDefinition {
        return [
            this.state.description!,
            () => this.execute()
        ];
    }

    public execute(): void {
        if (!this.state.handler) {
            return this.state.errorThrower.throw("Please choose a matcher first");
        }
       
        const fixture = this.getFixture();
        this.state.elementFinder.findElements(fixture);

        switch (this.state.handlerExecutionStrategy) {
            case HandlerExecutionStrategy.Loop:
                const numberOfElements = this.state.elementFinder.count();

                for (let i = 0; i < numberOfElements; i++) {
                    this.state.elementFinder.setElementIndex(i);
                    this.executeHandler();
                }

                break;
            case HandlerExecutionStrategy.Once:
                this.executeHandler();
                break;
        }

        // Dummy expect to keep Jest / Jasmine happy.
        expect(true).toEqual(true);
    }

    protected setDescription(description: string, modifier?: string): void {
        this.state.description = `'${this.state.elementFinder.selector}'${modifier ? ` ${modifier}` : ""} ${this.state.negate ? "should not" : "should"} ${description}`;
        this.state.errorDescription = `Expected '${this.state.elementFinder.selector}'${modifier ? ` ${modifier}` : ""} ${this.state.negate ? "not to" : "to"} ${description}`;
    }

    protected appendDescription(description: string): void {
        this.state.description += ` ${description}`;
        this.state.errorDescription += ` ${description}`;
    }

    protected setHandler(handler: MatcherHandler): void {
        this.state.handler = handler;
    }

    protected setHandlerExecutionStrategy(strategy: HandlerExecutionStrategy): void {
        this.state.handlerExecutionStrategy = strategy;
    }

    protected getFixture(): ComponentFixtureLike {
        const fixture = this.state.getFixture();

        if (!fixture) {
            return this.state.errorThrower.throw("Could not get fixture, please initialize Piumino first");
        }
        
        return fixture;
    }

    protected getComponent(): GenericObject {
        const fixture = this.getFixture();

        // Support for ngMocks.
        // https://ng-mocks.sudo.eu/api/MockRender#example-with-a-component
        if (fixture.point) {
            return fixture.point.componentInstance
        }

        return fixture.componentInstance;
    }

    protected checkComponentHasProperty(property: string): void {
        const component = this.getComponent();

        if (!ObjectHelper.hasProperty(component, property)) {
            this.state.errorThrower.throw(`Property '${property}' does not exist on '${component.constructor.name}'`);
        }
    }

    protected getElement(throwError = true): DebugElement {
        const element = this.state.elementFinder.get();

        if (throwError && !element) {
            return this.state.errorThrower.throw(`Could not find element with selector '${this.state.elementFinder.selector}'`);
        }

        return element;
    }

    protected checkElementHasProperty(property: string): void {
        const element = this.getElement();

        if (!NgHelper.hasProperty(element, property)) {
            this.state.errorThrower.throw(`Property '${property}' does not exist on '${element.name}''`);
        }
    }

    private executeHandler(): void {
        const result = this.state.handler!();
        const [matcherResult, matcherReceived, matcherExpected] = Array.isArray(result) ? result : [result, NOTHING, NOTHING];

        if ((!this.state.negate && !matcherResult) || (this.state.negate && matcherResult)) {
            this.state.errorThrower.throw(this.state.errorDescription!, matcherReceived, matcherExpected);
        }
    }
}
