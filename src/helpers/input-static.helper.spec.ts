import "./input-static.helper";

import { Piumino } from "../piumino";
import { Util } from "../util";

describe("InputStaticHelper", () => {
    let piumino: Piumino<any>;

    beforeEach(() => {
        jest.resetAllMocks();

        piumino = new Piumino();
        piumino.init({} as any, {});
    });

    describe("testInputStatic", () => {
        it("formats test case text", () => {
            const result = piumino.testInputStatic("div", "input", "test");

            expect(result[0]).toBe("should wire static input 'input' to div");
        });

        it("compares the static input for an Angular type", () => {
            jest.spyOn(Util, "getElementBySelector").mockReturnValue({ componentInstance: { input: "test" } } as any);
            jest.spyOn(Util, "isAngularType").mockReturnValue(true);

            const result = piumino.testInputStatic("div", "input", "test");
            result[1]();
        });

        it("compares the static input for a native type", () => {
            jest.spyOn(Util, "getElementBySelector").mockReturnValue({ properties: { input: "test" } } as any);
            jest.spyOn(Util, "isAngularType").mockReturnValue(false);

            const result = piumino.testInputStatic("div", "input", "test");
            result[1]();
        });
    });
});
