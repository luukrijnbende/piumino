import { ComponentFixtureLike, SelectionStrategy } from "../types";
import { Matcher, MatcherState } from "./matcher";

class DummyMatcher extends Matcher { }

describe("Matcher", () => {
    let fixture: ComponentFixtureLike;
    let matcherState: MatcherState;
    let dummyMatcher: DummyMatcher;

    beforeEach(() => {
        fixture = {
            componentInstance: {},
            debugElement: {
                query: jest.fn(() => ({ nativeElement: {} }))
            } as any,
            detectChanges: jest.fn()
        };
        matcherState = {
            selector: "selector",
            selectionStrategy: SelectionStrategy.First,
            getFixture: jest.fn(() => fixture)
        };
        dummyMatcher = new DummyMatcher(matcherState);
    });

    describe("build", () => {
        it("should return a test definition", () => {
            const definition = dummyMatcher.build();

            expect(definition).toEqual([undefined, expect.any(Function)])
        });
    });

    describe("execute", () => {

    });
});
