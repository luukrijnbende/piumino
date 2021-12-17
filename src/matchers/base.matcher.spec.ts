import { ComponentFixtureLike } from "../types";
import { BaseMatcher } from "./base.matcher";
import { InputMatcher } from "./input.matcher";
import { MatcherState } from "./matcher";
import { OutputMatcher } from "./output.matcher";

describe("BaseMatcher", () => {
    let fixture: ComponentFixtureLike;
    let matcherState: MatcherState;

    beforeEach(() => {
        fixture = {
            componentInstance: {},
            nativeElement: {
                querySelector: jest.fn(() => ({}))
            } as unknown as HTMLElement,
            detectChanges: jest.fn()
        }
        matcherState = {
            selector: "selector",
            getFixture: jest.fn(() => fixture)
        }
    })

    describe("input", () => {
        it("should return an instance of InputMatcher", () => {
            const baseMatcher = new BaseMatcher(matcherState);
            const inputMatcher = baseMatcher.input("input");
    
            expect(inputMatcher).toBeInstanceOf(InputMatcher);
        });
    });

    describe("output", () => {
        it("should return an instance of OutputMatcher", () => {
            const baseMatcher = new BaseMatcher(matcherState);
            const outputMatcher = baseMatcher.output("output");
    
            expect(outputMatcher).toBeInstanceOf(OutputMatcher);
        }); 
    });

    describe("toHaveText", () => {
        it("should set the description", () => {
            const baseMatcher = new BaseMatcher(matcherState);
            baseMatcher.toHaveText("text");

            expect(matcherState.description).toBe("'selector' should have text 'text'");
        });

        it("should set the matcher", () => {
            const baseMatcher = new BaseMatcher(matcherState);
            baseMatcher.toHaveText("text");

            expect(matcherState.matcher).toBeDefined();
        });

        it.each`
            text        | expected
            ${"text"}   | ${true}
            ${" text"}  | ${true}
            ${"text "}  | ${true}
            ${" text "} | ${true}
            ${"other"}  | ${false}
        `("should return $expected for text '$text'", ({ text, expected }) => {
            fixture.nativeElement.querySelector = jest.fn(() => ({
                textContent: text
            }));

            const baseMatcher = new BaseMatcher(matcherState);
            baseMatcher.toHaveText("text");

            expect(matcherState.matcher!()).toEqual([expected, text.trim(), "text"]);
        });

        it("should return false if the element doesn't have textContent", () => {
            const baseMatcher = new BaseMatcher(matcherState);
            baseMatcher.toHaveText("text");

            expect(matcherState.matcher!()).toEqual([false, "", "text"]);
        });
    });

    describe("toHaveTextCaseInsensitive", () => {
        it("should set the description", () => {
            const baseMatcher = new BaseMatcher(matcherState);
            baseMatcher.toHaveTextCaseInsensitive("TeXt");

            expect(matcherState.description).toBe("'selector' should have case insensitive text 'text'");
        });

        it("should set the matcher", () => {
            const baseMatcher = new BaseMatcher(matcherState);
            baseMatcher.toHaveTextCaseInsensitive("TeXt");

            expect(matcherState.matcher).toBeDefined();
        });

        it.each`
            text        | expected
            ${"tExT"}   | ${true}
            ${" tExT"}  | ${true}
            ${"tExT "}  | ${true}
            ${" tExT "} | ${true}
            ${"OtHeR"}  | ${false}
        `("should return $expected for text '$text'", ({ text, expected }) => {
            fixture.nativeElement.querySelector = jest.fn(() => ({
                textContent: text
            }));

            const baseMatcher = new BaseMatcher(matcherState);
            baseMatcher.toHaveTextCaseInsensitive("TeXt");

            expect(matcherState.matcher!()).toEqual([expected, text.trim().toLowerCase(), "text"]);
        });

        it("should return false if the element doesn't have textContent", () => {
            const baseMatcher = new BaseMatcher(matcherState);
            baseMatcher.toHaveTextCaseInsensitive("TeXt");

            expect(matcherState.matcher!()).toEqual([false, "", "text"]);
        });
    });

    describe("toBePresent", () => {
        it("should set the description", () => {
            const baseMatcher = new BaseMatcher(matcherState);
            baseMatcher.toBePresent();

            expect(matcherState.description).toBe("'selector' should be present");
        });

        it("should set the matcher", () => {
            const baseMatcher = new BaseMatcher(matcherState);
            baseMatcher.toBePresent();

            expect(matcherState.matcher).toBeDefined();
        });

        it("should return true when the selected element is present", () => {
            const document = new Document();
            const element = {
                ownerDocument: document,
                getRootNode: jest.fn(() => document)
            };

            fixture.nativeElement.querySelector = jest.fn(() => element);

            const baseMatcher = new BaseMatcher(matcherState);
            baseMatcher.toBePresent();

            expect(matcherState.matcher!()).toEqual([true]);
            expect(element.getRootNode).toHaveBeenCalledWith({ composed: true });
        });

        it("should return false when the selected element is not present", () => {
            const element = {
                ownerDocument: new Document(),
                getRootNode: jest.fn(() => new Document())
            };

            fixture.nativeElement.querySelector = jest.fn(() => element);

            const baseMatcher = new BaseMatcher(matcherState);
            baseMatcher.toBePresent();

            expect(matcherState.matcher!()).toEqual([false]);
            expect(element.getRootNode).toHaveBeenCalledWith({ composed: true });
        });

        it("should return false when the selected element is not found", () => {
            fixture.nativeElement.querySelector = jest.fn(() => undefined);

            const baseMatcher = new BaseMatcher(matcherState);
            baseMatcher.toBePresent();

            expect(matcherState.matcher!()).toEqual([false]);
        });
    });

    describe("toBeVisible", () => {
        it("should set the description", () => {
            const baseMatcher = new BaseMatcher(matcherState);
            baseMatcher.toBeVisible();

            expect(matcherState.description).toBe("'selector' should be visible");
        });

        it("should set the matcher", () => {
            const baseMatcher = new BaseMatcher(matcherState);
            baseMatcher.toBeVisible();

            expect(matcherState.matcher).toBeDefined();
        });

        it.each`
            style                          | expected
            ${{}}                          | ${true}
            ${{ display: "none" }}         | ${false}
            ${{ visibility: "hidden" }}    | ${false}
            ${{ visibility: "collapsed" }} | ${false}
            ${{ opacity: "0" }}            | ${false}
        `("should return $expected when the selected element style is $style", ({ style, expected }) => {
            const document = new Document();
            const element = {
                ownerDocument: document,
                getRootNode: jest.fn(() => document),
                hasAttribute: jest.fn(() => false)
            };

            fixture.nativeElement.querySelector = jest.fn(() => element);
            jest.spyOn(global, "getComputedStyle").mockReturnValue(style);

            const baseMatcher = new BaseMatcher(matcherState);
            baseMatcher.toBeVisible();

            expect(matcherState.matcher!()).toEqual([expected]);
        });

        it.each`
            hidden   | expected
            ${false} | ${true}
            ${true}  | ${false}
        `("should return $expected when the selected element hidden is $hidden", ({ hidden, expected }) => {
            const document = new Document();
            const element = {
                ownerDocument: document,
                getRootNode: jest.fn(() => document),
                hasAttribute: jest.fn(() => hidden)
            };

            fixture.nativeElement.querySelector = jest.fn(() => element);
            jest.spyOn(global, "getComputedStyle").mockReturnValue({} as any);

            const baseMatcher = new BaseMatcher(matcherState);
            baseMatcher.toBeVisible();

            expect(matcherState.matcher!()).toEqual([expected]);
        });

        it("should return true when the selected element is present", () => {
            const document = new Document();
            const element = {
                ownerDocument: document,
                getRootNode: jest.fn(() => document),
                hasAttribute: jest.fn(() => false)
            };

            fixture.nativeElement.querySelector = jest.fn(() => element);
            jest.spyOn(global, "getComputedStyle").mockReturnValue({} as any);

            const baseMatcher = new BaseMatcher(matcherState);
            baseMatcher.toBeVisible();

            expect(matcherState.matcher!()).toEqual([true]);
            expect(element.getRootNode).toHaveBeenCalledWith({ composed: true });
        });

        it("should return false when the selected element is not present", () => {
            const element = {
                ownerDocument: new Document(),
                getRootNode: jest.fn(() => new Document()),
                hasAttribute: jest.fn(() => false)
            };

            fixture.nativeElement.querySelector = jest.fn(() => element);
            jest.spyOn(global, "getComputedStyle").mockReturnValue({} as any);

            const baseMatcher = new BaseMatcher(matcherState);
            baseMatcher.toBeVisible();

            expect(matcherState.matcher!()).toEqual([false]);
            expect(element.getRootNode).toHaveBeenCalledWith({ composed: true });
        });

        it("should return false when the selected element is not found", () => {
            fixture.nativeElement.querySelector = jest.fn(() => undefined);
            jest.spyOn(global, "getComputedStyle").mockReturnValue({} as any);

            const baseMatcher = new BaseMatcher(matcherState);
            baseMatcher.toBeVisible();

            expect(matcherState.matcher!()).toEqual([false]);
        });
    });
});