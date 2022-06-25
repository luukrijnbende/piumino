const propMetadata = jest.fn();

jest.mock("@angular/core", () => ({
    ...jest.requireActual("@angular/core"),
    ɵReflectionCapabilities: jest.fn(() => ({
        propMetadata
    }))
}));

import { NOTHING } from "../types";
import { NgHelper } from "./ng.helper";

describe("NgHelper", () => {
    const createMockElement = (providerInstance: any, useProvide = false) => ({
        nativeElement: document.createElement("div"),
        providerTokens: [useProvide ? { provide: providerInstance } : "some token"],
        injector: {
            get: jest.fn(() => providerInstance)
        }
    }) as any;
    const mockPropertyMap = (map: Record<string, string>) => {
        propMetadata.mockReturnValueOnce(Object.entries(map).reduce((metadata, kv: any) => {
            metadata[kv[1]] = [{ bindingPropertyName: kv[0] === kv[1] ? undefined : kv[0] }];
            return metadata;
        }, {} as any));
    };

    describe("getProperty", () => {
        it("returns the value of an attribute property", () => {
            const element = createMockElement({});
            element.nativeElement.setAttribute("attributeTest", "expected");

            expect(NgHelper.getProperty(element, "attributeTest")).toBe("expected");
        });

        it("returns the value of an instance property", () => {
            const element = createMockElement({
                componentTest: "expected"
            });
            mockPropertyMap({ componentTest: "componentTest" });

            expect(NgHelper.getProperty(element, "componentTest")).toBe("expected");
        });

        it("returns the value of a named instance property", () => {
            const element = createMockElement({
                componentTest: "expected"
            });
            mockPropertyMap({ componentTestNamed: "componentTest" });

            expect(NgHelper.getProperty(element, "componentTestNamed")).toBe("expected");
        });

        it("returns NOTHING if nothing is found", () => {
            const element = createMockElement({});

            expect(NgHelper.getProperty(element, "test")).toBe(NOTHING);
        });
    });

    describe("hasProperty", () => {
        it("returns true if the property is present as an attribute", () => {
            const element = createMockElement({}, true);
            element.nativeElement.setAttribute("attributeTest", "expected");

            expect(NgHelper.hasProperty(element, "attributeTest")).toBe(true);
        });

        it("returns true if the property is present on the instance", () => {
            const element = createMockElement({
                componentTest: "expected"
            }, true);
            mockPropertyMap({ componentTest: "componentTest" });

            expect(NgHelper.hasProperty(element, "componentTest")).toBe(true);
        });

        it("returns true if the property is present on the instance as a named property", () => {
            const element = createMockElement({
                componentTest: "expected"
            }, true);
            mockPropertyMap({ componentTestNamed: "componentTest" });

            expect(NgHelper.hasProperty(element, "componentTestNamed")).toBe(true);
        });

        it("returns false if the property is not present", () => {
            const element = createMockElement({}, true);

            expect(NgHelper.hasProperty(element, "test")).toBe(false);
        });
    });
});
