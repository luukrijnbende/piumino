import { DebugElement } from "@angular/core";

export const NOTHING = Symbol('NOTHING');

export type Selector = string | HTMLElement;
export type TestDefinition = [string, () => void];
export type GenericDirective = Record<string, any>;
export interface ComponentFixtureLike {
    componentInstance: GenericDirective;
    debugElement: DebugElement;
    nativeElement: HTMLElement;
    point?: {
        componentInstance: GenericDirective;
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
