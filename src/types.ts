import { DebugElement } from "@angular/core";

export const NOTHING = Symbol("NOTHING");

export type Selector = string;
export type TestDefinition = [string, () => void];
export type GenericObject = Record<string, any>; // TODO: Use unknown, breaks MatcherChainFinisher.
export type GenericFunction = (...args: unknown[]) => unknown;
export type MatcherFunction = (payload?: unknown) => [boolean, unknown?, unknown?];
export type MatcherChainStarters = "input" | "output";
export type MatcherChainStarter<T extends GenericObject> = Omit<T, "build" | "execute">;
export type MatcherChain<T extends GenericObject> = Omit<T, "build" | "execute" | "not" | MatcherChainStarters>;
export type MatcherChainWithFinisher<T extends GenericObject> = Omit<T, "not" | MatcherChainStarters>;
export type MatcherChainFinisher<T extends GenericObject> = Pick<T, "build" | "execute">;

export interface ComponentFixtureLike {
    componentInstance: GenericObject;
    debugElement: DebugElement;
    point?: {
        componentInstance: GenericObject;
    };
    detectChanges(checkNoChanges?: boolean): void;
}

export class PiuminoError extends Error {
    public override name = "PiuminoError";

    public constructor(description: string, stack?: string) {
        super(description);

        if (stack) {
            this.stack = stack;
        }
    }
}
