import { MatcherState } from "./matcher";
import { ModifyWithMatcher } from "./modify-with.matcher";

describe("ModifyWithMatcher", () => {
    const handler = jest.fn();
    let matcherState: MatcherState;

    beforeEach(() => {
        matcherState = {
            handler,
            selector: "selector"
        } as any;
    });

    describe("modifyWith", () => {
        it("should set the description", () => {
            const modifyWithMatcher = new ModifyWithMatcher(matcherState);
            modifyWithMatcher.modifyWith("value");

            expect(matcherState.description).toBe("undefined modified with 'value'");
        });

        it("should set the handler", () => {
            const modifyWithMatcher = new ModifyWithMatcher(matcherState);
            modifyWithMatcher.modifyWith("value");

            expect(matcherState.handler).toBeDefined();
            expect(matcherState.handler).not.toBe(handler);
        });

        it("should call the original handler with the provided value", () => {
            const modifyWithMatcher = new ModifyWithMatcher(matcherState);
            modifyWithMatcher.modifyWith("value");
            matcherState.handler!();

            expect(handler).toHaveBeenCalledWith("value");
        });

        it("should return the result of the original handler", () => {
            handler.mockReturnValueOnce("result");

            const modifyWithMatcher = new ModifyWithMatcher(matcherState);
            modifyWithMatcher.modifyWith("value");

            expect(matcherState.handler!()).toBe("result");
        });

        it("should return an instance of ModifyWithMatcher", () => {
            const modifyWithMatcher = new ModifyWithMatcher(matcherState);
    
            expect(modifyWithMatcher.modifyWith("value")).toBeInstanceOf(ModifyWithMatcher);
        });
    });
});
