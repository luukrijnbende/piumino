import { MatcherState } from "./matcher";
import { ToCallWithMatcher } from "./to-call-with.matcher";

describe("ToCallWithMatcher", () => {
    const matcher = jest.fn();
    let matcherState: MatcherState;

    beforeEach(() => {
        matcherState = {
            matcher,
            selector: "selector"
        } as any;
    });

    describe("modifyWith", () => {
        it.each`
            values
            ${["value1"]}
            ${["value1", "value2"]}
        `("should set the description", ({ values }) => {
            const toCallWithMatcher = new ToCallWithMatcher(matcherState);
            toCallWithMatcher.with(values[0], ...values.slice(1));

            expect(matcherState.description).toBe(`undefined with '${values.join("','")}'`);
        });

        it("should set the matcher", () => {
            const toCallWithMatcher = new ToCallWithMatcher(matcherState);
            toCallWithMatcher.with("value");

            expect(matcherState.matcher).toBeDefined();
            expect(matcherState.matcher).not.toBe(matcher);
        });

        it("should call the original matcher with the provided value", () => {
            matcher.mockReturnValueOnce([true, ["value"]]);

            const toCallWithMatcher = new ToCallWithMatcher(matcherState);
            toCallWithMatcher.with("value");
            matcherState.matcher!();

            expect(matcher).toHaveBeenCalledWith("value");
        });

        it("should call the original matcher with the last provided value", () => {
            matcher.mockReturnValueOnce([true, ["value"]]);

            const toCallWithMatcher = new ToCallWithMatcher(matcherState);
            toCallWithMatcher.with("value1", "value2");
            matcherState.matcher!();

            expect(matcher).toHaveBeenCalledWith("value2");
        });

        it.each`
            values                  | received                | expected
            ${["value"]}            | ${["value"]}            | ${true}
            ${["value"]}            | ${["value1"]}           | ${false}
            ${["value1", "value2"]} | ${["value1", "value2"]} | ${true}
            ${[{ value: 1 }]}       | ${[{ value: 1 }]}       | ${true}
            ${[{ value: 1 }]}       | ${[{ value: 2 }]}       | ${false}
        `("should return $expected for '$values' and '$received'", ({ values, received, expected }) => {
            matcher.mockReturnValueOnce([true, received]);

            const toCallWithMatcher = new ToCallWithMatcher(matcherState);
            toCallWithMatcher.with(values[0], ...values.slice(1));

            expect(matcherState.matcher!()).toEqual([expected, received, values]);
        });

        it("should return false if the function has not been called", () => {
            matcher.mockReturnValueOnce([false, ["value"]]);

            const toCallWithMatcher = new ToCallWithMatcher(matcherState);
            toCallWithMatcher.with("value");

            expect(matcherState.matcher!()).toEqual([false, ["value"], ["value"]]);
        });

        it("should return an instance of ToCallWithMatcher", () => {
            const toCallWithMatcher = new ToCallWithMatcher(matcherState);
    
            expect(toCallWithMatcher.with("value")).toBeInstanceOf(ToCallWithMatcher);
        });
    });
});
