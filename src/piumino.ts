import { BaseMatcher } from "./matchers/base.matcher";
import { ComponentFixtureLike, MatcherChain, PiuminoError, Selector } from "./types";

export class Piumino {
    private fixture: ComponentFixtureLike | null = null;
    private errorStack: string | undefined;

    /**
     * Initialize Piumino.
     * @param fixture - The TestBed fixture to use for all expects.
     */
    public init(fixture: ComponentFixtureLike) {
        this.fixture = fixture;
    }

    /**
     * Select an element that is a child of the fixture's component to expect something on.
     * @param selector - The selector to find the element or an actual HTMLElement.
     */
    public expect(selector: Selector): MatcherChain<BaseMatcher> {
        this.errorStack = this.getErrorStack();

        return new BaseMatcher({ selector, errorStack: this.errorStack, getFixture: () => this.getFixture() });
    }

    private getFixture(): ComponentFixtureLike | null {
        return this.fixture;
    }

    private getErrorStack(): string | undefined {
        return new Error().stack?.split("\n").filter(item => !item.toLowerCase().includes("piumino")).join("\n");
    }
}
