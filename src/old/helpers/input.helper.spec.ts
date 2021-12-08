import "./input.helper";

import { Piumino } from "../piumino";
import { Util } from "../util";

describe("InputHelper", () => {
    let fixture: any;
    let component: any;
    let piumino: Piumino<any>;

    beforeEach(() => {
        jest.resetAllMocks();

        fixture = {
            detectChanges: jest.fn()
        }
        component = {
            source: "test"
        };

        piumino = new Piumino();
        piumino.init(fixture, component);
    });

    describe("testInput", () => {
        it("formats test case text", () => {
            const result = piumino.testInput("div", "input", "source", "modifyValue");

            expect(result[0]).toBe("should wire input 'input' to div");
        });

        it("compares the input for an Angular type", () => {
            const element = { componentInstance: { input: "test" } } as any;
            fixture.detectChanges = jest.fn(() => element.componentInstance.input = "modifyValue");
            jest.spyOn(Util, "getElementBySelector").mockReturnValue(element);
            jest.spyOn(Util, "isAngularType").mockReturnValue(true);

            const result = piumino.testInput("div", "input", "source", "modifyValue");
            result[1]();
        });

        it("compares the input for a native type", () => {
            const element = { properties: { input: "test" } } as any;
            fixture.detectChanges = jest.fn(() => element.properties.input = "modifyValue");
            jest.spyOn(Util, "getElementBySelector").mockReturnValue(element);
            jest.spyOn(Util, "isAngularType").mockReturnValue(false);

            const result = piumino.testInput("div", "input", "source", "modifyValue");
            result[1]();
        });

        it("executes the source value to get the value if it's a function", () => {
            const element = { componentInstance: { input: "function test" } } as any;
            fixture.detectChanges = jest.fn(() => element.componentInstance.input = "modifyValue");
            component.source = jest.fn(() => "function test");
            jest.spyOn(Util, "getElementBySelector").mockReturnValue(element);
            jest.spyOn(Util, "isAngularType").mockReturnValue(true);

            const result = piumino.testInput("div", "input", "source", jest.fn(() => "modifyValue"));
            result[1]();

            expect(component.source).toHaveBeenCalled();
        });
    });
});
