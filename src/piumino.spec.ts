import { ObjectHelper } from "./helpers/object.helper";
import { BaseMatcher } from "./matchers/base.matcher";
import { Piumino } from "./piumino";

describe("Piumino", () => {
    let piumino: Piumino;

    beforeEach(() => {
        piumino = new Piumino();
    })

    describe("expect", () => {
        it("should return an instance of BaseMatcher", () => {
            const matcher = piumino.expect("selector");

            expect(matcher).toBeInstanceOf(BaseMatcher);
        });
    });

    describe("replaceFunction", () => {
        it("should call replaceFunction on the ObjectHelper", () => {
            const obj = { someFunction: jest.fn() };
            const implementation = jest.fn();

            jest.spyOn(ObjectHelper, "replaceFunction");
            piumino.replaceFunction(obj, "someFunction", implementation);

            expect(ObjectHelper.replaceFunction).toHaveBeenCalledWith(obj, "someFunction", implementation);
        });
    });

    describe("restoreFunction", () => {
        it("should call restoreFunction on the ObjectHelper", () => {
            const obj = { someFunction: jest.fn() };

            jest.spyOn(ObjectHelper, "restoreFunction");
            piumino.restoreFunction(obj, "someFunction");

            expect(ObjectHelper.restoreFunction).toHaveBeenCalledWith(obj, "someFunction");
        });
    });
});
