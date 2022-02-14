import { NgHelper } from "../helpers/ng.helper";
import { ObjectHelper } from "../helpers/object.helper";
import { ComponentFixtureLike, NOTHING, SelectionStrategy } from "../types";
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
            selectionStrategy: SelectionStrategy.First,
            outputSelector: "output",
            getFixture: jest.fn(() => fixture)
        };
    });

    describe("toBeBoundTo", () => {
        beforeEach(() => {
            jest.spyOn(NgHelper, "getProperty").mockReturnValue(true);
            fixture.componentInstance = { value: "value" };
        });

        it("should set the description", () => {
            const outputMatcher = new OutputMatcher(matcherState);
            outputMatcher.toBeBoundTo("value");

            expect(matcherState.description).toBe("'selector' output 'output' should be bound to 'value'");
        });

        it("should set the handler", () => {
            const outputMatcher = new OutputMatcher(matcherState);
            outputMatcher.toBeBoundTo("value");

            expect(matcherState.handler).toBeDefined();
        });

        it("should dispatch an event to change the bounding property on the component", () => {
            const nativeElement = { dispatchEvent: jest.fn() };
            (fixture.debugElement.query as jest.Mock).mockReturnValue({ nativeElement });

            const outputMatcher = new OutputMatcher(matcherState);
            outputMatcher.toBeBoundTo("value");
            matcherState.handler?.();

            expect(nativeElement.dispatchEvent).toHaveBeenCalledWith(new Event("output"));
        });

        it("should dispatch an event to change the bounding property on the component with a provided payload", () => {
            const nativeElement = { dispatchEvent: jest.fn() };
            (fixture.debugElement.query as jest.Mock).mockReturnValue({ nativeElement });

            const outputMatcher = new OutputMatcher(matcherState);
            outputMatcher.toBeBoundTo("value");
            matcherState.handler?.(new Event("provided"));

            expect(nativeElement.dispatchEvent).toHaveBeenCalledWith(new Event("provided"));
        });

        it("should get the value of the property from the component", () => {
            jest.spyOn(ObjectHelper, "getProperty");

            const outputMatcher = new OutputMatcher(matcherState);
            outputMatcher.toBeBoundTo("value");
            matcherState.handler?.();

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
            jest.spyOn(ObjectHelper, "getProperty").mockReturnValue(received);

            const outputMatcher = new OutputMatcher(matcherState);
            outputMatcher.toBeBoundTo("value");

            expect(matcherState.handler?.(values)).toEqual([expected, received, values]);
        });

        it("should throw if the component doesn't have the bounding property", () => {   
            fixture.componentInstance = {};
        
            const outputMatcher = new OutputMatcher(matcherState);
            outputMatcher.toBeBoundTo("value");

            expect(() => matcherState.handler!()).toThrow();
        });

        it("should return an instance of ModifyWithMatcher", () => {
            const outputMatcher = new OutputMatcher(matcherState);
    
            expect(outputMatcher.toBeBoundTo("value")).toBeInstanceOf(ModifyWithMatcher);
        });
    });

    describe("toCall", () => {
        beforeEach(() => {
            jest.spyOn(NgHelper, "hasProperty").mockReturnValue(true);
            fixture.componentInstance = { value: "value" };
        });

        it("should set the description", () => {
            const outputMatcher = new OutputMatcher(matcherState);
            outputMatcher.toCall("value");

            expect(matcherState.description).toBe("'selector' output 'output' should call 'value'");
        });

        it("should set the handler", () => {
            const outputMatcher = new OutputMatcher(matcherState);
            outputMatcher.toCall("value");

            expect(matcherState.handler).toBeDefined();
        });

        it("should replace the function on the component with a dummy one", () => {
            jest.spyOn(ObjectHelper, "replaceFunction");

            const outputMatcher = new OutputMatcher(matcherState);
            outputMatcher.toCall("value");
            matcherState.handler?.();

            expect(ObjectHelper.replaceFunction).toHaveBeenCalledWith(fixture.componentInstance, "value", expect.any(Function));
        });

        it("should dispatch an event to call the function on the component", () => {
            const nativeElement = { dispatchEvent: jest.fn() };
            (fixture.debugElement.query as jest.Mock).mockReturnValue({ nativeElement });
            jest.spyOn(NgHelper, "getProperty").mockReturnValueOnce(undefined);

            const outputMatcher = new OutputMatcher(matcherState);
            outputMatcher.toCall("value");
            matcherState.handler?.();

            expect(nativeElement.dispatchEvent).toHaveBeenCalledWith(new Event("output"));
        });

        it("should dispatch an event to call the function on the component with a provided payload", () => {
            const nativeElement = { dispatchEvent: jest.fn() };
            (fixture.debugElement.query as jest.Mock).mockReturnValue({ nativeElement });
            jest.spyOn(NgHelper, "getProperty").mockReturnValueOnce(undefined);

            const outputMatcher = new OutputMatcher(matcherState);
            outputMatcher.toCall("value");
            matcherState.handler?.(new Event("provided"));

            expect(nativeElement.dispatchEvent).toHaveBeenCalledWith(new Event("provided"));
        });

        it.each`
            keyEvent
            ${"keydown"}
            ${"keyup"}
        `("should dispatch a $keyEvent event to call the function on the component", ({ keyEvent }) => {
            const localMatcherState = { ...matcherState, outputSelector: `${keyEvent}.enter` };
            const nativeElement = { dispatchEvent: jest.fn() };
            (fixture.debugElement.query as jest.Mock).mockReturnValue({ nativeElement });

            const outputMatcher = new OutputMatcher(localMatcherState);
            outputMatcher.toCall("value");
            localMatcherState.handler?.();

            expect(nativeElement.dispatchEvent).toHaveBeenCalledWith(new KeyboardEvent(keyEvent, { key: "enter" }));
        });

        it("should emit an output event to call the function on the component", () =>  {
            const output = { emit: jest.fn() };
            jest.spyOn(NgHelper, "getProperty").mockReturnValueOnce(output);

            const outputMatcher = new OutputMatcher(matcherState);
            outputMatcher.toCall("value");
            matcherState.handler?.();

            expect(output.emit).toHaveBeenCalled();
        });

        it("should emit an output event to call the function on the component with a provided payload", () =>  {
            const output = { emit: jest.fn() };
            jest.spyOn(NgHelper, "getProperty").mockReturnValueOnce(output);

            const outputMatcher = new OutputMatcher(matcherState);
            outputMatcher.toCall("value");
            matcherState.handler?.("payload");

            expect(output.emit).toHaveBeenCalledWith("payload");
        });

        it("should restore the original function on the component", () => {
            jest.spyOn(ObjectHelper, "restoreFunction");

            const outputMatcher = new OutputMatcher(matcherState);
            outputMatcher.toCall("value");
            matcherState.handler?.();

            expect(ObjectHelper.restoreFunction).toHaveBeenCalledWith(fixture.componentInstance, "value");
        });

        it.each`
            callValues    | binding      | expected | expectedCallValues
            ${[]}         | ${"binding"} | ${true}  | ${NOTHING}
            ${["value"]}  | ${"binding"} | ${true}  | ${["value"]}
        `("should return $expected if the replaced function has been called with $callValues", ({ callValues, binding, expected, expectedCallValues }) => {
            const nativeElement = { dispatchEvent: jest.fn(() => replacedFunction(...callValues)) };
            let replacedFunction: (...args: unknown[]) => void;

            (fixture.debugElement.query as jest.Mock).mockReturnValue({ nativeElement });
            jest.spyOn(ObjectHelper, "replaceFunction").mockImplementation((c,f,func) => replacedFunction = func);

            const outputMatcher = new OutputMatcher(matcherState);
            outputMatcher.toCall("value");
            
            expect(matcherState.handler?.()).toEqual([expected, expectedCallValues, NOTHING]);
        });

        it("should return false if the replaced function has not been called", () => {
            jest.spyOn(ObjectHelper, "replaceFunction").mockImplementation(() => {});

            const outputMatcher = new OutputMatcher(matcherState);
            outputMatcher.toCall("value");
            
            expect(matcherState.handler?.()).toEqual([false, undefined, NOTHING]);
        });

        it("should throw if the component doesn't have the function", () => {           
            fixture.componentInstance = {};
            
            const outputMatcher = new OutputMatcher(matcherState);
            outputMatcher.toBeBoundTo("value");

            expect(() => matcherState.handler!()).toThrow();
        });

        it("should return an instance of ToCallWithMatcher", () => {
            const outputMatcher = new OutputMatcher(matcherState);
    
            expect(outputMatcher.toCall("value")).toBeInstanceOf(ToCallWithMatcher);
        });
    });
});
