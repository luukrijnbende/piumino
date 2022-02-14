import { DebugElement } from "@angular/core";
import { ComponentFixtureLike, SelectionStrategy, Selector } from "./types";

export class ElementSelector {
    private elements: DebugElement[];
    private elementIndex: number = 0;

    public constructor(fixture: ComponentFixtureLike, selector: Selector, selectionStrategy: SelectionStrategy) {

    }

    public get(): DebugElement {
        return this.elements[this.elementIndex];
    }

    public getAll(): DebugElement[] {
        return this.elements;
    }

    public setElementIndex(index: number): void {
        this.elementIndex = index;
    }

    private findElements(): void {
        fixture.detectChanges();

        // TODO: support selector as DebugElement and/or HTMLElement.
        const elements = fixture.debugElement.queryAll(el =>
            el.nativeElement?.matches?.(this.state.selector))
    }
}
