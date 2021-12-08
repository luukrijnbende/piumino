import { DebugElement } from "@angular/core";

export type Selector = string | HTMLElement;
export type TestDefinition = [string, () => void];
export type LooseObject = { [key: string]: any };

export interface ComponentFixtureLike {
    componentInstance: GenericDirective;
    debugElement: DebugElement;
    nativeElement: HTMLElement;
    point?: {
        componentInstance: GenericDirective;
    };
    detectChanges(checkNoChanges?: boolean): void;
}

export type GenericDirective = Record<string, any>;

export class PiuminoError extends Error {
    public override name = "PiuminoError";
}
