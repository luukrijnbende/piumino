import { ObjectHelper } from "../helpers/object.helper";
import { ComponentFixtureLike, NOTHING, PiuminoError, Selector, TestDefinition } from "../types";

type MatcherFunction = () => boolean | [boolean, any, any];
export interface MatcherState {
    selector: Selector;
    getFixture: () => ComponentFixtureLike;
}

export type MatcherChain<T, K extends string = ""> = Omit<T, "build" | "execute" | K>;
export type MatcherFinisher = Pick<Matcher, "build" | "execute">;

export class Matcher {
    protected state: MatcherState;
    protected negate = false;
    protected description: string;
    protected errorDescription: string;
    protected errorStack = new Error().stack;
    protected matcher: MatcherFunction;

    public get not(): MatcherChain<this, "not"> {
        this.negate = true;

        return this;
    }

    public constructor(state: MatcherState) {
        this.state = state;
        this.errorStack = this.getErrorStack();
    }

    public build(): TestDefinition {
        if (!this.matcher) {
            this.throwError("Please choose a matcher first");
        }

        return [
            this.description,
            () => this.execute()
        ];
    }

    public execute(): void {
        const result = this.matcher();
        const [matcherResult, matcherReceived, matcherExpected] = Array.isArray(result) ? result : [result, NOTHING, NOTHING];

        if ((!this.negate && !matcherResult) || (this.negate && matcherResult)) {
            this.throwError(this.errorDescription, matcherReceived, matcherExpected);
        }

        // Dummy expect to keep Jest / Jasmine happy.
        expect(true).toEqual(true);
    }

    protected setDescription(description: string, modifier?: string): void {
        this.description = `'${this.state.selector}'${modifier ? ` ${modifier}` : ""} ${this.negate ? "should not" : "should"} ${description}`;
        this.errorDescription = `Expected '${this.state.selector}'${modifier ? ` ${modifier}` : ""} ${this.negate ? "not to" : "to"} ${description}`;
    }

    protected setMatcher(matcher: MatcherFunction): void {
        this.matcher = matcher;
    }

    protected getComponent(): any {
        const fixture = this.state.getFixture();

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
        this.state.getFixture().detectChanges();

        const element: HTMLElement | null = this.state.selector instanceof HTMLElement
            ? this.state.selector
            : this.state.getFixture().nativeElement.querySelector(this.state.selector as string);

        if (throwError && !element) {
            this.throwError(`Could not find element with selector '${this.state.selector}'`);
        }

        return element as HTMLElement;
    }

    protected throwError(message: string, received: unknown = NOTHING, expected: unknown = NOTHING): void {
        let errorMessage = message;

        if (received !== NOTHING) {
            errorMessage += `\n\n\x1b[31mReceived: ${this.stringifyValue(received)}\x1b[0m`;
        }

        if (expected !== NOTHING) {
            errorMessage += `\n\n\x1b[32mExpected: ${this.stringifyValue(expected)}\x1b[0m`;
        }

        throw new PiuminoError(errorMessage, this.errorStack);
    }

    private getErrorStack(): string | undefined {
        return new Error().stack?.split("\n").filter(item => !item.toLowerCase().includes("piumino")).join("\n");
    }

    private stringifyValue(value: unknown) {
        if (ObjectHelper.isObject(value)) {
            return `\n${JSON.stringify(value, null, 2)}`;
        }

        return `${value}`;
    }
}
