import { ObjectHelper } from "./helpers/object.helper";
import { BaseMatcher } from "./matchers/base.matcher";
import { ComponentFixtureLike, GenericFunction, GenericObject, FluentChainStarter, Selector } from "./types";

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
     * Select an element that is a child of the fixture's component to expect something on.
     * 
     * @param selector - The CSS selector to find the element.
     */
    public expect(selector: Selector): FluentChainStarter<BaseMatcher> {
        const errorStack = this.getErrorStack();

        return new BaseMatcher({ selector, errorStack, getFixture: () => this.getFixture() });
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
}
