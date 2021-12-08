import { ComponentFixtureLike, PiuminoError, Selector } from "../types";

export interface MatcherState {
    selector: Selector;
    getFixture: () => ComponentFixtureLike;
}

export class Matcher {
    protected state: MatcherState;
    protected negate = false;

    public get not(): this {
        this.negate = true;
        return this;
    }

    public constructor(state: MatcherState) {
        this.state = state;
    }

    protected getComponent(): any {
        const fixture = this.state.getFixture();

        // Support for ngMocks.
        // https://ng-mocks.sudo.eu/api/MockRender#example-with-a-component
        if (fixture.point) {
            return fixture.point.componentInstance
        }

        return fixture.componentInstance;
    }

    protected getElement(): HTMLElement {
        this.state.getFixture().detectChanges();

        const element: HTMLElement | null = this.state.selector instanceof HTMLElement
            ? this.state.selector
            : this.state.getFixture().nativeElement.querySelector(this.state.selector as string);

        if (!element) {
            throw new PiuminoError(`Could not find element with selector '${this.state.selector}'`);
        }

        return element;
    }

    protected dummyExpect(): void {
        // Dummy expect to keep Jest / Jasmine happy.
        expect(true).toEqual(true);
    }
}
