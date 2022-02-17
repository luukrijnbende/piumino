import { DebugElement } from "@angular/core";
import { ComponentFixtureLike, SelectionStrategy, Selector } from "./types";

export class ElementFinder {
    public selector: Selector;
    public selectionStrategy: SelectionStrategy;

    private elements: DebugElement[];
    private elementIndex: number = 0;

    public constructor(selector: Selector, selectionStrategy: SelectionStrategy) {
        this.selector = selector;
        this.selectionStrategy = selectionStrategy;
    }

    public count(): number {
        return this.elements?.length ?? 0;
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

    public findElements(fixture: ComponentFixtureLike): void {
        fixture.detectChanges();

        // TODO: support selector as DebugElement and/or HTMLElement.
        const elements = fixture.debugElement.queryAll(el =>
            el.nativeElement?.matches?.(this.selector));

        if (!elements.length) {
            return;
        };

        switch (this.selectionStrategy) {
            case SelectionStrategy.All:
                this.elements = elements;
                break;
            case SelectionStrategy.First:
                this.elements = [elements[0]];
                break;
            case SelectionStrategy.Last:
                this.elements = [elements[elements.length - 1]]
                break;
        }
    }
}
