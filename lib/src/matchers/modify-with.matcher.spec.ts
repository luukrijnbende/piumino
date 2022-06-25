import { MatcherState } from "./matcher";
import { ModifyWithMatcher } from "./modify-with.matcher";

describe("ModifyWithMatcher", () => {
    const matcher = jest.fn();
    let matcherState: MatcherState;

    beforeEach(() => {
        matcherState = {
            matcher,
            selector: "selector"
        } as any;
    });

    describe("modifyWith", () => {
        it("should set the description", () => {
            const modifyWithMatcher = new ModifyWithMatcher(matcherState);
            modifyWithMatcher.modifyWith("value");

            expect(matcherState.description).toBe("undefined modified with 'value'");
        });

        it("should set the matcher", () => {
            const modifyWithMatcher = new ModifyWithMatcher(matcherState);
            modifyWithMatcher.modifyWith("value");

            expect(matcherState.matcher).toBeDefined();
            expect(matcherState.matcher).not.toBe(matcher);
        });

        it("should call the original matcher with the provided value", () => {
            const modifyWithMatcher = new ModifyWithMatcher(matcherState);
            modifyWithMatcher.modifyWith("value");
            matcherState.matcher!();

            expect(matcher).toHaveBeenCalledWith("value");
        });

        it("should return the result of the original matcher", () => {
            matcher.mockReturnValueOnce("result");

            const modifyWithMatcher = new ModifyWithMatcher(matcherState);
            modifyWithMatcher.modifyWith("value");

            expect(matcherState.matcher!()).toBe("result");
        });

        it("should return an instance of ModifyWithMatcher", () => {
            const modifyWithMatcher = new ModifyWithMatcher(matcherState);
    
            expect(modifyWithMatcher.modifyWith("value")).toBeInstanceOf(ModifyWithMatcher);
        });
    });
});
