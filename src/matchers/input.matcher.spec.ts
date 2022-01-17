import { NgHelper } from "../helpers/ng.helper";
import { ObjectHelper } from "../helpers/object.helper";
import { ComponentFixtureLike } from "../types";
import { InputMatcher, InputMatcherState } from "./input.matcher";
import { ModifyWithMatcher } from "./modify-with.matcher";
import { ToCallWithMatcher } from "./to-call-with.matcher";

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

    describe("toBeBoundTo", () => {
        beforeEach(() => {
            jest.spyOn(NgHelper, "hasProperty").mockReturnValue(true);
            fixture.componentInstance = { value: 'value' };
        });

        it("should set the description", () => {
            const inputMatcher = new InputMatcher(matcherState);
            inputMatcher.toBeBoundTo("value");

            expect(matcherState.description).toBe("'selector' input 'input' should be bound to 'value'");
        });

        it("should set the matcher", () => {
            const inputMatcher = new InputMatcher(matcherState);
            inputMatcher.toBeBoundTo("value");

            expect(matcherState.matcher).toBeDefined();
        });

        it("should change the bounding property on the component", () => {
            jest.spyOn(ObjectHelper, 'setProperty');

            const inputMatcher = new InputMatcher(matcherState);
            inputMatcher.toBeBoundTo("value");
            matcherState.matcher?.();

            expect(ObjectHelper.setProperty).toHaveBeenCalledWith(fixture.componentInstance, "value", "binding");
            expect(fixture.componentInstance.value).toBe("binding");
        });

        it("should change the bounding property on the component with a provided payload", () => {
            jest.spyOn(ObjectHelper, 'setProperty');

            const inputMatcher = new InputMatcher(matcherState);
            inputMatcher.toBeBoundTo("value");
            matcherState.matcher?.("provided");

            expect(ObjectHelper.setProperty).toHaveBeenCalledWith(fixture.componentInstance, "value", "provided");
            expect(fixture.componentInstance.value).toBe("provided");
        });

        it("should call detectChanges on the fixture", () => {
            const inputMatcher = new InputMatcher(matcherState);
            inputMatcher.toBeBoundTo("value");
            matcherState.matcher?.();

            expect(fixture.detectChanges).toHaveBeenCalled();
        });

        it("should get the value of the property from the element", () => {
            jest.spyOn(NgHelper, "getProperty");

            const element = fixture.debugElement.query(undefined as any);
            const inputMatcher = new InputMatcher(matcherState);
            inputMatcher.toBeBoundTo("value");
            matcherState.matcher?.();

            expect(NgHelper.getProperty).toHaveBeenCalledWith(element, "input");
        });

        it("should get the value of the property from the component", () => {
            jest.spyOn(ObjectHelper, "getProperty");

            const inputMatcher = new InputMatcher(matcherState);
            inputMatcher.toBeBoundTo("value");
            matcherState.matcher?.();

            expect(ObjectHelper.getProperty).toHaveBeenCalledWith(fixture.componentInstance, "value");
        });

        it.each`
            values                  | received                | expected
            ${["value"]}            | ${["value"]}            | ${true}
            ${["value"]}            | ${["value1"]}           | ${false}
            ${["value1", "value2"]} | ${["value1", "value2"]} | ${true}
            ${[{ value: 1 }]}       | ${[{ value: 1 }]}       | ${true}
            ${[{ value: 1 }]}       | ${[{ value: 2 }]}       | ${false}
        `("should return $expected for '$values' and '$received'", ({ values, received, expected }) => {
            jest.spyOn(NgHelper, "getProperty").mockReturnValue(received);
            jest.spyOn(ObjectHelper, "getProperty").mockReturnValue(values);

            const inputMatcher = new InputMatcher(matcherState);
            inputMatcher.toBeBoundTo("value");

            expect(matcherState.matcher?.()).toEqual([expected, received, values]);
        });

        it("should throw if the component doesn't have the bounding property", () => {   
            fixture.componentInstance = {};
        
            const inputMatcher = new InputMatcher(matcherState);
            inputMatcher.toBeBoundTo("value");

            expect(() => matcherState.matcher!()).toThrow();
        });

        it("should throw if the element doesn't have the input property", () => {
            jest.spyOn(NgHelper, "hasProperty").mockReturnValue(false);
            
            const inputMatcher = new InputMatcher(matcherState);
            inputMatcher.toBeBoundTo("value");

            expect(() => matcherState.matcher!()).toThrow();
        });

        it("should return an instance of ModifyWithMatcher", () => {
            const inputMatcher = new InputMatcher(matcherState);
    
            expect(inputMatcher.toBeBoundTo("value")).toBeInstanceOf(ModifyWithMatcher);
        });
    });

    describe("toCall", () => {
        beforeEach(() => {
            jest.spyOn(NgHelper, "hasProperty").mockReturnValue(true);
            fixture.componentInstance = { value: 'value' };
        });

        it("should set the description", () => {
            const inputMatcher = new InputMatcher(matcherState);
            inputMatcher.toCall("value");

            expect(matcherState.description).toBe("'selector' input 'input' should call 'value'");
        });

        it("should set the matcher", () => {
            const inputMatcher = new InputMatcher(matcherState);
            inputMatcher.toCall("value");

            expect(matcherState.matcher).toBeDefined();
        });

        it("should replace the function on the component with a dummy one", () => {
            jest.spyOn(ObjectHelper, "replaceFunction");

            const inputMatcher = new InputMatcher(matcherState);
            inputMatcher.toCall("value");
            matcherState.matcher?.();

            expect(ObjectHelper.replaceFunction).toHaveBeenCalledWith(fixture.componentInstance, "value", expect.any(Function));
        });

        it("should call detectChanges on the fixture", () => {
            const inputMatcher = new InputMatcher(matcherState);
            inputMatcher.toCall("value");
            matcherState.matcher?.();

            expect(fixture.detectChanges).toHaveBeenCalled();
        });

        it("should restore the original function on the component", () => {
            jest.spyOn(ObjectHelper, "restoreFunction");

            const inputMatcher = new InputMatcher(matcherState);
            inputMatcher.toCall("value");
            matcherState.matcher?.();

            expect(ObjectHelper.restoreFunction).toHaveBeenCalledWith(fixture.componentInstance, "value");
        });

        it("should get the value of the property from the element", () => {
            jest.spyOn(NgHelper, "getProperty");

            const element = fixture.debugElement.query(undefined as any);
            const inputMatcher = new InputMatcher(matcherState);
            inputMatcher.toCall("value");
            matcherState.matcher?.();

            expect(NgHelper.getProperty).toHaveBeenCalledWith(element, "input");
        });

        it("should throw if the component doesn't have the bounding property", () => {           
            fixture.componentInstance = {};
            
            const inputMatcher = new InputMatcher(matcherState);
            inputMatcher.toBeBoundTo("value");

            expect(() => matcherState.matcher!()).toThrow();
        });

        it("should throw if the element doesn't have the input property", () => {
            jest.spyOn(NgHelper, "hasProperty").mockReturnValue(false);
            
            const inputMatcher = new InputMatcher(matcherState);
            inputMatcher.toCall("value");

            expect(() => matcherState.matcher!()).toThrow();
        });

        it("should return an instance of ToCallWithMatcher", () => {
            const inputMatcher = new InputMatcher(matcherState);
    
            expect(inputMatcher.toCall("value")).toBeInstanceOf(ToCallWithMatcher);
        });
    });
});
