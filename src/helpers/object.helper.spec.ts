import { ObjectHelper } from "./object.helper";

describe("Objecthelper", () => {
    describe("getProperty", () => {
        it.each`
            path                 | expected
            ${"value"}           | ${"test1"}
            ${"array[0]"}        | ${"test2"}
            ${"array[1].value"}  | ${"test3"}
            ${"object.value"}    | ${"test4"}
            ${"object.array[0]"} | ${"test5"}
            ${""}                | ${undefined}
            ${"value1"}          | ${undefined}
            ${"array[2]"}        | ${undefined}
            ${"array[1].value1"} | ${undefined}
            ${"object.value1"}   | ${undefined}
            ${"object.array[1]"} | ${undefined}
        `("should return $expected for $path", ({ path, expected }) => {
            const obj = {
                value: "test1",
                array: ["test2", { value: "test3" }],
                object: { value: "test4", array: ["test5"] }
            }

            expect(ObjectHelper.getProperty(obj, path)).toBe(expected);
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
            ${"value1"}          | ${"test1"}
            ${"array[2]"}        | ${"test2"}
            ${"array[1].value1"} | ${"test3"}
            ${"object.value1"}   | ${"test4"}
            ${"object.array[1]"} | ${"test5"}
        `("should set $value for $path", ({ path, value }) => {
            const obj = {
                value: "",
                array: ["", { value: "" }],
                object: { value: "", array: [""] }
            }

            ObjectHelper.setProperty(obj, path, value);
            expect(ObjectHelper.getProperty(obj, path)).toBe(value);
        });

        it("does nothing if the path is empty", () => {
            const obj = {
                object: { value: "" }
            }

            ObjectHelper.setProperty(obj, "", "test");
            expect(obj).toEqual({
                object: { value: "" }
            });
        });
    });

    describe("hasProperty", () => {
        it.each`
            path                 | expected
            ${"value"}           | ${true}
            ${"array[0]"}        | ${true}
            ${"array[1].value"}  | ${true}
            ${"object.value"}    | ${true}
            ${"object.array[0]"} | ${true}
            ${""}                | ${false}
            ${"value1"}          | ${false}
            ${"array[2]"}        | ${false}
            ${"array[1].value1"} | ${false}
            ${"object.value1"}   | ${false}
            ${"object.array[1]"} | ${false}
        `("should return $expected for $path", ({ path, expected }) => {
            const obj = {
                value: "test1",
                array: ["test2", { value: "test3" }],
                object: { value: "test4", array: ["test5"] }
            }

            expect(ObjectHelper.hasProperty(obj, path)).toBe(expected);
        });
    });

    describe("replaceFunction", () => {
        it("replaces the function", () => {
            const existingFunc = jest.fn();
            const replacerFunc = jest.fn();
            const obj = {
                func: existingFunc
            };

            ObjectHelper.replaceFunction(obj, "func", replacerFunc);
            obj.func();

            expect(existingFunc).not.toHaveBeenCalled();
            expect(replacerFunc).toHaveBeenCalled();
        });
    });

    describe("restoreFunction", () => {
        it("restores the function", () => {
            const existingFunc = jest.fn();
            const replacerFunc = jest.fn();
            const obj = {
                func: existingFunc
            };

            ObjectHelper.replaceFunction(obj, "func", replacerFunc);
            ObjectHelper.restoreFunction(obj, "func");
            obj.func();

            expect(existingFunc).toHaveBeenCalled();
            expect(replacerFunc).not.toHaveBeenCalled();
        });

        it("does not restore the function if it was never replaced", () => {
            const existingFunc = jest.fn();
            const obj = {
                func: existingFunc
            };

            ObjectHelper.restoreFunction(obj, "func");
            obj.func();

            expect(existingFunc).toHaveBeenCalled();
        });
    });

    describe("isObject", () => {
        it.each`
            value       | expected
            ${{}}       | ${true}
            ${[]}       | ${true}
            ${() => {}} | ${true}
            ${"test"}   | ${false}
            ${true}     | ${false}
            ${false}    | ${false}
            ${0}        | ${false}
        `("should return $expected for '$value'", ({ value, expected }) => {
            expect(ObjectHelper.isObject(value)).toBe(expected);
        });
    });
});
