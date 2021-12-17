import { NOTHING } from "../types";
import { NgHelper } from "./ng.helper";

describe("NgHelper", () => {
    beforeEach(() => {
        (window as any).ng = {
            getComponent: jest.fn(() => {}),
            getDirectives: jest.fn(() => [{}]),
            getDirectiveMetadata: jest.fn(() => {})
        }
    });

    describe("getProperty", () => {
        it("returns the value of an attribute property", () => {
            const element = document.createElement("div");
            element.setAttribute("attributeTest", "expected");

            expect(NgHelper.getProperty(element, "attributeTest")).toBe("expected");
        });

        it("returns the value of a component property", () => {
            (window as any).ng.getComponent.mockReturnValue({
                componentTest: "expected"
            });

            const element = document.createElement("div");
            expect(NgHelper.getProperty(element, "componentTest")).toBe("expected");
        });

        it("returns the value of a named component property", () => {
            (window as any).ng.getComponent.mockReturnValue({
                componentTest: "expected"
            });
            (window as any).ng.getDirectiveMetadata.mockReturnValue({
                inputs: { componentTestNamedInput: "componentTest" },
                outputs: { componentTestNamedOutput: "componentTest" }
            });

            const element = document.createElement("div");

            expect(NgHelper.getProperty(element, "componentTestNamedInput")).toBe("expected");
            expect(NgHelper.getProperty(element, "componentTestNamedOutput")).toBe("expected");
        });

        it("returns the value of a directive property", () => {
            (window as any).ng.getDirectives.mockReturnValue([{
                directiveTest: "expected"
            }]);

            const element = document.createElement("div");
            expect(NgHelper.getProperty(element, "directiveTest")).toBe("expected");
        });

        it("returns the value of a named directive property", () => {
            (window as any).ng.getDirectives.mockReturnValue([{
                directiveTest: "expected"
            }]);
            (window as any).ng.getDirectiveMetadata.mockReturnValue({
                inputs: { directiveTestNamedInput: "directiveTest" },
                outputs: { directiveTestNamedOutput: "directiveTest" }
            });

            const element = document.createElement("div");
            
            expect(NgHelper.getProperty(element, "directiveTestNamedInput")).toBe("expected");
            expect(NgHelper.getProperty(element, "directiveTestNamedOutput")).toBe("expected");
        });

        it("returns NOTHING if nothing is found", () => {
            const element = document.createElement("div");

            expect(NgHelper.getProperty(element, "test")).toBe(NOTHING);
        });
    });

    describe("hasProperty", () => {
        it("returns true if the property is present as an attribute", () => {
            const element = document.createElement("div");
            element.setAttribute("attributeTest", "expected");

            expect(NgHelper.hasProperty(element, "attributeTest")).toBe(true);
        });

        it("returns true if the property is present on the component", () => {
            (window as any).ng.getComponent.mockReturnValue({
                componentTest: "expected"
            });

            const element = document.createElement("div");
            expect(NgHelper.hasProperty(element, "componentTest")).toBe(true);
        });

        it("returns true if the property is present on the component as a named input or output", () => {
            (window as any).ng.getComponent.mockReturnValue({
                componentTest: "expected"
            });
            (window as any).ng.getDirectiveMetadata.mockReturnValue({
                inputs: { componentTestNamedInput: "componentTest" },
                outputs: { componentTestNamedOutput: "componentTest" }
            });

            const element = document.createElement("div");

            expect(NgHelper.hasProperty(element, "componentTestNamedInput")).toBe(true);
            expect(NgHelper.hasProperty(element, "componentTestNamedOutput")).toBe(true);
        });

        it("returns true if the property is present on a directive", () => {
            (window as any).ng.getDirectives.mockReturnValue([{
                directiveTest: "expected"
            }]);

            const element = document.createElement("div");
            expect(NgHelper.hasProperty(element, "directiveTest")).toBe(true);
        });

        it("returns true if the property is present on a directive as a named input or output", () => {
            (window as any).ng.getDirectives.mockReturnValue([{
                directiveTest: "expected"
            }]);
            (window as any).ng.getDirectiveMetadata.mockReturnValue({
                inputs: { directiveTestNamedInput: "directiveTest" },
                outputs: { directiveTestNamedOutput: "directiveTest" }
            });

            const element = document.createElement("div");
            
            expect(NgHelper.hasProperty(element, "directiveTestNamedInput")).toBe(true);
            expect(NgHelper.hasProperty(element, "directiveTestNamedOutput")).toBe(true);
        });

        it("returns false if the property is not present is found", () => {
            const element = document.createElement("div");

            expect(NgHelper.hasProperty(element, "test")).toBe(false);
        });
    });
})