import "./text.helper";

import { Piumino } from "../piumino";
import { Util } from "../util";

describe("TextHelper", () => {
    let piumino: Piumino<any>;

    beforeEach(() => {
        jest.resetAllMocks();

        piumino = new Piumino();
        piumino.init({} as any, {});
    });

    describe("testText", () => {
        it("formats test case text", () => {
            const result = piumino.testText("div", "text");

            expect(result[0]).toBe("div should have text 'text'");
        });

        it("compares the trimmed text content", () => {
            jest.spyOn(Util, "getElementBySelector").mockReturnValue({ nativeElement: { textContent: "text "} } as any);

            const result = piumino.testText("div", "text");
            result[1]();
        });
    });
});
