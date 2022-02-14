import { MatcherState } from "./matcher";
import { ToCallWithMatcher } from "./to-call-with.matcher";

describe("ToCallWithMatcher", () => {
    const handler = jest.fn();
    let matcherState: MatcherState;

    beforeEach(() => {
        matcherState = {
            handler,
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

        it("should set the handler", () => {
            const toCallWithMatcher = new ToCallWithMatcher(matcherState);
            toCallWithMatcher.with("value");

            expect(matcherState.handler).toBeDefined();
            expect(matcherState.handler).not.toBe(handler);
        });

        it("should call the original handler with the provided value", () => {
            handler.mockReturnValueOnce([true, ["value"]]);

            const toCallWithMatcher = new ToCallWithMatcher(matcherState);
            toCallWithMatcher.with("value");
            matcherState.handler!();

            expect(handler).toHaveBeenCalledWith("value");
        });

        it("should call the original handler with the last provided value", () => {
            handler.mockReturnValueOnce([true, ["value"]]);

            const toCallWithMatcher = new ToCallWithMatcher(matcherState);
            toCallWithMatcher.with("value1", "value2");
            matcherState.handler!();

            expect(handler).toHaveBeenCalledWith("value2");
        });

        it.each`
            values                  | received                | expected
            ${["value"]}            | ${["value"]}            | ${true}
            ${["value"]}            | ${["value1"]}           | ${false}
            ${["value1", "value2"]} | ${["value1", "value2"]} | ${true}
            ${[{ value: 1 }]}       | ${[{ value: 1 }]}       | ${true}
            ${[{ value: 1 }]}       | ${[{ value: 2 }]}       | ${false}
        `("should return $expected for '$values' and '$received'", ({ values, received, expected }) => {
            handler.mockReturnValueOnce([true, received]);

            const toCallWithMatcher = new ToCallWithMatcher(matcherState);
            toCallWithMatcher.with(values[0], ...values.slice(1));

            expect(matcherState.handler!()).toEqual([expected, received, values]);
        });

        it("should return false if the function has not been called", () => {
            handler.mockReturnValueOnce([false, ["value"]]);

            const toCallWithMatcher = new ToCallWithMatcher(matcherState);
            toCallWithMatcher.with("value");

            expect(matcherState.handler!()).toEqual([false, ["value"], ["value"]]);
        });

        it("should return an instance of ToCallWithMatcher", () => {
            const toCallWithMatcher = new ToCallWithMatcher(matcherState);
    
            expect(toCallWithMatcher.with("value")).toBeInstanceOf(ToCallWithMatcher);
        });
    });
});
