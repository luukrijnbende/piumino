import { DebugElement, Type } from "@angular/core";

export type Selector = string | Type<any>;
export type TestDefinition = [string, () => void];
export type LooseObject = { [key: string]: any };

export interface ComponentFixtureLike {
    debugElement: DebugElement;
    detectChanges(checkNoChanges?: boolean): void;
}
