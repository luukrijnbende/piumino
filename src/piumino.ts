import { ObjectHelper } from "./helpers/object.helper";
import { BaseMatcher } from "./matchers/base.matcher";
import { MatcherState } from "./matchers/matcher";
import { ComponentFixtureLike, GenericFunction, GenericObject, FluentChainStarter, Selector, SelectionStrategy, HandlerExecutionStrategy } from "./types";

export class Piumino {
    private fixture: ComponentFixtureLike | null = null;

    /**
     * Initialize Piumino.
     * 
     * @param fixture - The TestBed fixture to use for all expects.
     */
    public init(fixture: ComponentFixtureLike) {
        this.fixture = fixture;
    }

    /**
     * Select the first element that is a child of the fixture's component to expect something on.
     * 
     * @param selector - The CSS selector to find the element.
     */
    public expect(selector: Selector): FluentChainStarter<BaseMatcher> {
        return new BaseMatcher({
            ...this.createCommonMatcherState(),
            selector,
            selectionStrategy: SelectionStrategy.First
        });
    }

    /**
     * Select all elements that are a child of the fixture's component to expect something on.
     * 
     * @param selector - The CSS selector to find the elements.
     */
    public expectAll(selector: Selector): FluentChainStarter<BaseMatcher> {
        return new BaseMatcher({
            ...this.createCommonMatcherState(),
            selector,
            selectionStrategy: SelectionStrategy.All
        });
    }

    /**
     * Replace a function implementation on the provided object with the provided implementation.
     * 
     * @param obj - The object to replace the function on.
     * @param func - The name of the function to replace.
     * @param implementation - The implementation to replace the function with.
     */
    public replaceFunction(obj: GenericObject, func: string, implementation: GenericFunction): void {
        ObjectHelper.replaceFunction(obj, func, implementation);
    }

    /**
     * Restore a function implementation on the provided object with the original implementation.\
     * NOTE: Does nothing if the function was never replaced.
     * 
     * @param obj - The object to restore the function on.
     * @param func - The name of the function to restore.
     */
    public restoreFunction(obj: GenericObject, func: string): void {
        ObjectHelper.restoreFunction(obj, func);
    }

    private getFixture(): ComponentFixtureLike | null {
        return this.fixture;
    }

    private getErrorStack(): string | undefined {
        return new Error().stack?.split("\n").filter(item => !item.toLowerCase().includes("piumino")).join("\n");
    }

    private createCommonMatcherState(): Pick<MatcherState, "errorStack" | "getFixture" | "handlerExecutionStrategy"> {
        return {
            errorStack: this.getErrorStack(),
            getFixture: () => this.getFixture(),
            handlerExecutionStrategy: HandlerExecutionStrategy.Loop
        };
    }
}
