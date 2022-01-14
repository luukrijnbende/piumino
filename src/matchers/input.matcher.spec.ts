import { NgHelper } from "../helpers/ng.helper";
import { ComponentFixtureLike } from "../types";
import { InputMatcher, InputMatcherState } from "./input.matcher";

describe("Matcher", () => {
    let fixture: ComponentFixtureLike;
    let matcherState: InputMatcherState;

    beforeEach(() => {
        fixture = {
            componentInstance: {},
            debugElement: {
                query: jest.fn(() => ({ nativeElement: document.createElement("div") }))
            } as any,
            detectChanges: jest.fn()
        };
        matcherState = {
            selector: "selector",
            inputSelector: "input",
            getFixture: jest.fn(() => fixture)
        };
    });

    describe("toEqual", () => {
        it("should set the description", () => {
            const inputMatcher = new InputMatcher(matcherState);
            inputMatcher.toEqual("value");

            expect(matcherState.description).toBe("'selector' input 'input' should equal 'value'");
        });

        it("should set the matcher", () => {
            const inputMatcher = new InputMatcher(matcherState);
            inputMatcher.toEqual("value");

            expect(matcherState.matcher).toBeDefined();
        });

        it("should get the input from the element", () => {
            jest.spyOn(NgHelper, "hasProperty").mockReturnValue(true);
            jest.spyOn(NgHelper, "getProperty").mockReturnValue("input");
            (fixture.debugElement.query as jest.Mock).mockReturnValue("element");

            const inputMatcher = new InputMatcher(matcherState);
            inputMatcher.toEqual("value");
            matcherState.matcher!();

            expect(NgHelper.getProperty).toHaveBeenCalledWith("element", "input");
        });

        it.each`
            input           | value           | expected
            ${"value"}      | ${"value"}      | ${true}
            ${"value"}      | ${"value1"}     | ${false}
            ${{ value: 1 }} | ${{ value: 1 }} | ${true}
            ${{ value: 1 }} | ${{ value: 2 }} | ${false}
        `("should return $expected for '$input' and '$value'", ({ input, value, expected }) => {
            jest.spyOn(NgHelper, "hasProperty").mockReturnValue(true);
            jest.spyOn(NgHelper, "getProperty").mockReturnValue(input);
            
            const inputMatcher = new InputMatcher(matcherState);
            inputMatcher.toEqual(value);

            expect(matcherState.matcher!()).toEqual([expected, input, value]);
        });

        it("should throw if the element doesn't have the input property", () => {
            jest.spyOn(NgHelper, "hasProperty").mockReturnValue(false);
            
            const inputMatcher = new InputMatcher(matcherState);
            inputMatcher.toEqual("value");

            expect(() => matcherState.matcher!()).toThrow();
        });

        it("should return an instance of InputMatcher", () => {
            const inputMatcher = new InputMatcher(matcherState);
    
            expect(inputMatcher.toEqual("value")).toBeInstanceOf(InputMatcher);
        });
    });
});
