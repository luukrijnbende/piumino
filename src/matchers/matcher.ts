import { DebugElement } from "@angular/core";
import objectInspect from "object-inspect";
import { NgHelper } from "../helpers/ng.helper";
import { ObjectHelper } from "../helpers/object.helper";
import { ComponentFixtureLike, FluentChain, GenericObject, HandlerExecutionStrategy, MatcherHandler, NOTHING, PiuminoError, SelectionStrategy, Selector, TestDefinition } from "../types";

export interface MatcherState {
    selector: Selector;
    selectionStrategy: SelectionStrategy;
    negate?: boolean;
    description?: string;
    errorDescription?: string;
    errorStack?: string;
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
            return this.throwError("Please choose a matcher first");
        }

        // Loop the handler
        // Make sure the right element is returned
        //  - Include in handler context?
        //  - Keep a counter and adjust the return value?
        //  - Make a separate class to handle element selection? -> preference


        const result = this.state.handler();
        const [matcherResult, matcherReceived, matcherExpected] = Array.isArray(result) ? result : [result, NOTHING, NOTHING];

        if ((!this.state.negate && !matcherResult) || (this.state.negate && matcherResult)) {
            this.throwError(this.state.errorDescription!, matcherReceived, matcherExpected);
        }

        // Dummy expect to keep Jest / Jasmine happy.
        expect(true).toEqual(true);
    }

    protected setDescription(description: string, modifier?: string): void {
        this.state.description = `'${this.state.selector}'${modifier ? ` ${modifier}` : ""} ${this.state.negate ? "should not" : "should"} ${description}`;
        this.state.errorDescription = `Expected '${this.state.selector}'${modifier ? ` ${modifier}` : ""} ${this.state.negate ? "not to" : "to"} ${description}`;
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
            return this.throwError("Could not get fixture, please initialize Piumino first");
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
            this.throwError(`Property '${property}' does not exist on '${component.constructor.name}'`);
        }
    }

    protected getElement(throwError = true): DebugElement {
        const fixture = this.getFixture();

        fixture.detectChanges();

        // TODO: support selector as DebugElement and/or HTMLElement.
        // queryAll, then filter
        const element = fixture.debugElement.query(el =>
            el.nativeElement?.matches?.(this.state.selector))

        if (throwError && !element) {
            return this.throwError(`Could not find element with selector '${this.state.selector}'`);
        }

        return element;
    }

    protected checkElementHasProperty(property: string): void {
        const element = this.getElement();

        if (!NgHelper.hasProperty(element, property)) {
            this.throwError(`Property '${property}' does not exist on '${element.name}''`);
        }
    }

    protected throwError(message: string, received: unknown = NOTHING, expected: unknown = NOTHING): never {
        let errorMessage = message;

        if (received !== NOTHING || expected !== NOTHING) {
            errorMessage += `\n\n\x1b[31mReceived: ${this.stringifyValue(received)}\x1b[0m`;
            errorMessage += `\n\n\x1b[32mExpected: ${this.stringifyValue(expected)}\x1b[0m`;
        }

        throw new PiuminoError(errorMessage, this.state.errorStack);
    }

    private stringifyValue(value: unknown) {
        if (value === NOTHING) {
            return "";
        }

        if (typeof value === "string") {
            return `'${value}'`;
        }

        if (ObjectHelper.isObject(value)) {
            return `\n${objectInspect(value, { indent: 2 })}`;
        }

        return `${value}`;
    }
}
