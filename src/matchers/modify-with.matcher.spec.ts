import { ElementFinder } from "../element-finder";
import { ComponentFixtureLike, SelectionStrategy } from "../types";
import { PiuminoErrorThrower } from "../util/error-thrower";
import { MatcherState } from "./matcher";
import { ModifyWithMatcher } from "./modify-with.matcher";

describe("ModifyWithMatcher", () => {
    const handler = jest.fn();
    let fixture: ComponentFixtureLike;
    let matcherState: MatcherState;

    beforeEach(() => {
        fixture = {
            componentInstance: {},
            debugElement: {
                query: jest.fn(() => ({ nativeElement: document.createElement("div") }))
            } as any,
            detectChanges: jest.fn()
        };
        matcherState = {
            elementFinder: new ElementFinder("selector", SelectionStrategy.First),
            errorThrower: new PiuminoErrorThrower(),
            getFixture: jest.fn(() => fixture),
            handler
        };
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
