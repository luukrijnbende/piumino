import "./output.helper";

import { Piumino } from "../piumino";
import { Util } from "../util";
import { EventEmitter } from "@angular/core";

describe("OutputHelper", () => {
    let fixture: any;
    let component: any;
    let piumino: Piumino<any>;

    beforeEach(() => {
        jest.resetAllMocks();

        fixture = {
            detectChanges: jest.fn()
        }
        component = {
            destination: jest.fn()
        };

        piumino = new Piumino();
        piumino.init(fixture, component);
    });

    describe("testInput", () => {
        it("formats test case text", () => {
            const result = piumino.testOutput("div", "output", "destination");

            expect(result[0]).toBe("should wire output 'output' to div");
        });

        it("checks if the destination is called for an Angular type", () => {
            const element = { componentInstance: { output: new EventEmitter() } } as any;
            element.componentInstance.output.subscribe(() => component.destination());
            jest.spyOn(Util, "getElementBySelector").mockReturnValue(element);
            jest.spyOn(Util, "isAngularType").mockReturnValue(true);

            const result = piumino.testOutput("div", "output", "destination");
            result[1]();
        });

        it("checks if the destination is called for a native type", () => {
            const element = { nativeElement: { dispatchEvent: () => component.destination() } } as any;
            jest.spyOn(Util, "getElementBySelector").mockReturnValue(element);
            jest.spyOn(Util, "isAngularType").mockReturnValue(false);

            const result = piumino.testOutput("div", "output", "destination");
            result[1]();
        });

        it("checks if the destination is called with a value for an Angular type", () => {
            const element = { componentInstance: { output: new EventEmitter() } } as any;
            element.componentInstance.output.subscribe((value: any) => component.destination(value));
            jest.spyOn(Util, "getElementBySelector").mockReturnValue(element);
            jest.spyOn(Util, "isAngularType").mockReturnValue(true);

            const result = piumino.testOutput("div", "output", "destination", "modifyValue");
            result[1]();
        });

        it("checks if the destination is called with a value for a native type", () => {
            const element = { nativeElement: { dispatchEvent: (event: any) => component.destination(event.detail) } } as any;
            jest.spyOn(Util, "getElementBySelector").mockReturnValue(element);
            jest.spyOn(Util, "isAngularType").mockReturnValue(false);

            const result = piumino.testOutput("div", "output", "destination", "modifyValue");
            result[1]();
        });

        it("uses the last rest parameter as emit value", () => {
            const element = { componentInstance: { output: new EventEmitter() } } as any;
            element.componentInstance.output.subscribe((value: any) => component.destination("test", value));
            jest.spyOn(Util, "getElementBySelector").mockReturnValue(element);
            jest.spyOn(Util, "isAngularType").mockReturnValue(true);

            const result = piumino.testOutput("div", "output", "destination", "test", "modifyValue");
            result[1]();
        });
    });
});
