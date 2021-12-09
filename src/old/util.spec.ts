import { By } from "@angular/platform-browser";
import { ComponentFixtureLike } from "../types";
import { Util } from "./util";

describe("Util", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe("isString", () => {
        it.each`
            value       | expected
            ${"test"}   | ${true}
            ${true}     | ${false}
            ${false}    | ${false}
            ${0}        | ${false}
            ${{}}       | ${false}
            ${[]}       | ${false}
            ${() => {}} | ${false}
        `("should return $expected for '$value'", ({ value, expected }) => {
            expect(Util.isString(value)).toBe(expected);
        });
    });

    describe("isFunction", () => {
        it.each`
            value       | expected
            ${"test"}   | ${false}
            ${true}     | ${false}
            ${false}    | ${false}
            ${0}        | ${false}
            ${{}}       | ${false}
            ${[]}       | ${false}
            ${() => {}} | ${true}
        `("should return $expected for '$value'", ({ value, expected }) => {
            expect(Util.isFunction(value)).toBe(expected);
        });
    });

    describe("isAngularType", () => {
        it.each`
            value                                                | expected
            ${{ nativeNode: document.createElement("unknown") }} | ${true}
            ${{ nativeNode: document.createElement("div") }}     | ${false}
        `("should return $expected for '$value'", ({ value, expected }) => {
            expect(Util.isAngularType(value)).toBe(expected);
        });
    });

    describe("getSelectorName", () => {
        it.each`
            selector             | expected
            ${"div"}          | ${"div"}
            ${class DummyComponent {}} | ${"DummyComponent"}
        `("should return $expected for '$selector'", ({ selector, expected }) => {
            expect(Util.getSelectorName(selector)).toBe(expected);
        });
    });

    describe("getElementBySelector", () => {
        const element = document.createElement("div");
        const fixture = {
            debugElement: {
                query: () => element
            } as any
        } as ComponentFixtureLike;

        jest.spyOn(By, "css");
        jest.spyOn(By, "directive");

        it("should return an element for a string selector", () => {
            expect(Util.getElementBySelector(fixture, "div")).toBe(element);
            expect(By.css).toHaveBeenCalledWith("div");
            expect(By.directive).not.toHaveBeenCalled();
        });

        it("should return an element for an Angular type selector", () => {
            class DummyComponent {}

            expect(Util.getElementBySelector(fixture, DummyComponent as any)).toBe(element);
            expect(By.css).not.toHaveBeenCalled();
            expect(By.directive).toHaveBeenCalledWith(DummyComponent);
        })
    });

    describe("getProperty", () => {
        it.each`
            path                 | expected
            ${"value"}           | ${"test1"}
            ${"array[0]"}        | ${"test2"}
            ${"array[1].value"}  | ${"test3"}
            ${"object.value"}    | ${"test4"}
            ${"object.array[0]"} | ${"test5"}
        `("should return $expected for $path", ({ path, expected }) => {
            const obj = {
                value: "test1",
                array: ["test2", { value: "test3" }],
                object: { value: "test4", array: ["test5"] }
            }

            expect(Util.getProperty(obj, path)).toBe(expected);
        });
    });

    describe("setProperty", () => {
        it.each`
            path                 | value
            ${"value"}           | ${"test1"}
            ${"array[0]"}        | ${"test2"}
            ${"array[1].value"}  | ${"test3"}
            ${"object.value"}    | ${"test4"}
            ${"object.array[0]"} | ${"test5"}
        `("should set $value for $path", ({ path, value }) => {
            const obj = {
                value: "",
                array: ["", { value: "" }],
                object: { value: "", array: [""] }
            }

            Util.setProperty(obj, path, value);
            expect(Util.getProperty(obj, path)).toBe(value);
        });

        it('does nothing if the path is empty', () => {
            const obj = {
                object: { value: "" }
            }

            Util.setProperty(obj, "", "test");
            expect(obj).toEqual({
                object: { value: "" }
            });
        });
    });
});
