import { NgHelper } from "../helpers/ng.helper";
import { ObjectHelper } from "../helpers/object.helper";
import { ComponentFixtureLike, NOTHING } from "../types";
import { ModifyWithMatcher } from "./modify-with.matcher";
import { OutputMatcher, OutputMatcherState } from "./output.matcher";
import { ToCallWithMatcher } from "./to-call-with.matcher";

describe("OutputMatcher", () => {
    let fixture: ComponentFixtureLike;
    let matcherState: OutputMatcherState;

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
            outputSelector: "output",
            getFixture: jest.fn(() => fixture)
        };
    });

    describe("toBeBoundTo", () => {
        beforeEach(() => {
            jest.spyOn(NgHelper, "getProperty").mockReturnValue(true);
            fixture.componentInstance = { value: 'value' };
        });

        it("should set the description", () => {
            const outputMatcher = new OutputMatcher(matcherState);
            outputMatcher.toBeBoundTo("value");

            expect(matcherState.description).toBe("'selector' output 'output' should be bound to 'value'");
        });

        it("should set the matcher", () => {
            const outputMatcher = new OutputMatcher(matcherState);
            outputMatcher.toBeBoundTo("value");

            expect(matcherState.matcher).toBeDefined();
        });

        it("should change the bounding property on the component", () => {
            jest.spyOn(ObjectHelper, 'setProperty');

            const outputMatcher = new OutputMatcher(matcherState);
            outputMatcher.toBeBoundTo("value");
            matcherState.matcher?.();

            expect(ObjectHelper.setProperty).toHaveBeenCalledWith(fixture.componentInstance, "value", "binding");
            expect(fixture.componentInstance.value).toBe("binding");
        });

        it("should change the bounding property on the component with a provided payload", () => {
            jest.spyOn(ObjectHelper, 'setProperty');

            const outputMatcher = new OutputMatcher(matcherState);
            outputMatcher.toBeBoundTo("value");
            matcherState.matcher?.("provided");

            expect(ObjectHelper.setProperty).toHaveBeenCalledWith(fixture.componentInstance, "value", "provided");
            expect(fixture.componentInstance.value).toBe("provided");
        });

        it("should call detectChanges on the fixture", () => {
            const outputMatcher = new OutputMatcher(matcherState);
            outputMatcher.toBeBoundTo("value");
            matcherState.matcher?.();

            expect(fixture.detectChanges).toHaveBeenCalled();
        });

        it("should get the value of the property from the element", () => {
            jest.spyOn(NgHelper, "getProperty");

            const element = fixture.debugElement.query(undefined as any);
            const outputMatcher = new OutputMatcher(matcherState);
            outputMatcher.toBeBoundTo("value");
            matcherState.matcher?.();

            expect(NgHelper.getProperty).toHaveBeenCalledWith(element, "input");
        });

        it("should get the value of the property from the component", () => {
            jest.spyOn(ObjectHelper, "getProperty");

            const outputMatcher = new OutputMatcher(matcherState);
            outputMatcher.toBeBoundTo("value");
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

            const outputMatcher = new OutputMatcher(matcherState);
            outputMatcher.toBeBoundTo("value");

            expect(matcherState.matcher?.()).toEqual([expected, received, values]);
        });

        it("should throw if the component doesn't have the bounding property", () => {   
            fixture.componentInstance = {};
        
            const outputMatcher = new OutputMatcher(matcherState);
            outputMatcher.toBeBoundTo("value");

            expect(() => matcherState.matcher!()).toThrow();
        });

        it("should return an instance of ModifyWithMatcher", () => {
            const outputMatcher = new OutputMatcher(matcherState);
    
            expect(outputMatcher.toBeBoundTo("value")).toBeInstanceOf(ModifyWithMatcher);
        });
    });

    // describe("toCall", () => {
    //     beforeEach(() => {
    //         jest.spyOn(NgHelper, "hasProperty").mockReturnValue(true);
    //         fixture.componentInstance = { value: 'value' };
    //     });

    //     it("should set the description", () => {
    //         const outputMatcher = new OutputMatcher(matcherState);
    //         outputMatcher.toCall("value");

    //         expect(matcherState.description).toBe("'selector' input 'input' should call 'value'");
    //     });

    //     it("should set the matcher", () => {
    //         const outputMatcher = new OutputMatcher(matcherState);
    //         outputMatcher.toCall("value");

    //         expect(matcherState.matcher).toBeDefined();
    //     });

    //     it("should replace the function on the component with a dummy one", () => {
    //         jest.spyOn(ObjectHelper, "replaceFunction");

    //         const outputMatcher = new OutputMatcher(matcherState);
    //         outputMatcher.toCall("value");
    //         matcherState.matcher?.();

    //         expect(ObjectHelper.replaceFunction).toHaveBeenCalledWith(fixture.componentInstance, "value", expect.any(Function));
    //     });

    //     it("should call detectChanges on the fixture", () => {
    //         const outputMatcher = new OutputMatcher(matcherState);
    //         outputMatcher.toCall("value");
    //         matcherState.matcher?.();

    //         expect(fixture.detectChanges).toHaveBeenCalled();
    //     });

    //     it("should restore the original function on the component", () => {
    //         jest.spyOn(ObjectHelper, "restoreFunction");

    //         const outputMatcher = new OutputMatcher(matcherState);
    //         outputMatcher.toCall("value");
    //         matcherState.matcher?.();

    //         expect(ObjectHelper.restoreFunction).toHaveBeenCalledWith(fixture.componentInstance, "value");
    //     });

    //     it("should get the value of the property from the element", () => {
    //         jest.spyOn(NgHelper, "getProperty");

    //         const element = fixture.debugElement.query(undefined as any);
    //         const outputMatcher = new OutputMatcher(matcherState);
    //         outputMatcher.toCall("value");
    //         matcherState.matcher?.();

    //         expect(NgHelper.getProperty).toHaveBeenCalledWith(element, "input");
    //     });

    //     it.each`
    //         callValues    | binding      | expected | expectedCallValues
    //         ${[]}         | ${"binding"} | ${true}  | ${NOTHING}
    //         ${[]}         | ${"failed"}  | ${false} | ${NOTHING}
    //         ${["value1"]} | ${"binding"} | ${true}  | ${["value1"]}
    //         ${["value1"]} | ${"failed"}  | ${false} | ${["value1"]}
    //     `("should return $expected if the replaced function has been called with $callValues and input is $binding", ({ callValues, binding, expected, expectedCallValues }) => {
    //         let replacedFunction: (...args: unknown[]) => void;

    //         jest.spyOn(ObjectHelper, "replaceFunction").mockImplementation((c,f,func) => replacedFunction = func);
    //         jest.spyOn(NgHelper, "getProperty").mockReturnValue(binding);
    //         (fixture.detectChanges as jest.Mock).mockImplementation(() => replacedFunction?.(...callValues));

    //         const outputMatcher = new OutputMatcher(matcherState);
    //         outputMatcher.toCall("value");
            
    //         expect(matcherState.matcher?.()).toEqual([expected, expectedCallValues, NOTHING]);
    //     });

    //     it("should return false if the replaced function has not been", () => {
    //         jest.spyOn(NgHelper, "getProperty").mockReturnValue("binding");

    //         const outputMatcher = new OutputMatcher(matcherState);
    //         outputMatcher.toCall("value");
            
    //         expect(matcherState.matcher?.()).toEqual([false, undefined, NOTHING]);
    //     });

    //     it("should throw if the component doesn't have the bounding property", () => {           
    //         fixture.componentInstance = {};
            
    //         const outputMatcher = new OutputMatcher(matcherState);
    //         outputMatcher.toBeBoundTo("value");

    //         expect(() => matcherState.matcher!()).toThrow();
    //     });

    //     it("should throw if the element doesn't have the input property", () => {
    //         jest.spyOn(NgHelper, "hasProperty").mockReturnValue(false);
            
    //         const outputMatcher = new OutputMatcher(matcherState);
    //         outputMatcher.toCall("value");

    //         expect(() => matcherState.matcher!()).toThrow();
    //     });

    //     it("should return an instance of ToCallWithMatcher", () => {
    //         const outputMatcher = new OutputMatcher(matcherState);
    
    //         expect(outputMatcher.toCall("value")).toBeInstanceOf(ToCallWithMatcher);
    //     });
    // });
});
