import objectInspect from "object-inspect";
import { ObjectHelper } from "../helpers/object.helper";
import { ComponentFixtureLike, MatcherChain, MatcherFunction, NOTHING, PiuminoError, Selector, TestDefinition } from "../types";

export interface MatcherState {
    selector: Selector;
    negate?: boolean;
    description?: string;
    errorDescription?: string;
    errorStack?: string;
    getFixture: () => ComponentFixtureLike | null;
    matcher?: MatcherFunction;
}

export class Matcher<NotExcludes extends string = ""> {
    protected state: MatcherState;

    public get not(): MatcherChain<this, "not" | "build" | "execute" | NotExcludes> {
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
        if (!this.state.matcher) {
            return this.throwError("Please choose a matcher first");
        }

        const result = this.state.matcher();
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

    protected setMatcher(matcher: MatcherFunction): void {
        this.state.matcher = matcher;
    }

    protected getFixture(): ComponentFixtureLike {
        const fixture = this.state.getFixture();

        if (!fixture) {
            return this.throwError("Could not get fixture, please initialize Piumino first");
        }
        
        return fixture;
    }

    protected getComponent(): any {
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

    protected getElement(throwError = true): HTMLElement {
        const fixture = this.getFixture();

        fixture.detectChanges();

        const element: HTMLElement | null = this.state.selector instanceof HTMLElement
            ? this.state.selector
            : fixture.nativeElement.querySelector(this.state.selector as string);

        if (throwError && !element) {
            return this.throwError(`Could not find element with selector '${this.state.selector}'`);
        }

        return element as HTMLElement;
    }

    protected throwError(message: string, received: unknown = NOTHING, expected: unknown = NOTHING): never {
        let errorMessage = message;

        if (received !== NOTHING) {
            errorMessage += `\n\n\x1b[31mReceived: ${this.stringifyValue(received)}\x1b[0m`;
        }

        if (expected !== NOTHING) {
            errorMessage += `\n\n\x1b[32mExpected: ${this.stringifyValue(expected)}\x1b[0m`;
        }

        throw new PiuminoError(errorMessage, this.state.errorStack);
    }

    private stringifyValue(value: unknown) {
        if (ObjectHelper.isObject(value)) {
            return `\n${objectInspect(value, { indent: 2 })}`;
        }

        return `${value}`;
    }
}
