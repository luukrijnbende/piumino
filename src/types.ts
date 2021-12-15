import { DebugElement } from "@angular/core";

export const NOTHING = Symbol("NOTHING");

export type Selector = string | HTMLElement;
export type TestDefinition = [string, () => void];
export type GenericObject = Record<string, any>;
export type MatcherFunction = (payload?: unknown) => [boolean, unknown?, unknown?];
export type MatcherChain<T, Excludes extends string = "build" | "execute"> = Omit<T, Excludes>;
export type MatcherFinisher<T extends GenericObject> = Pick<T, "build" | "execute">;

export interface ComponentFixtureLike {
    componentInstance: GenericObject;
    debugElement: DebugElement;
    nativeElement: HTMLElement;
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
