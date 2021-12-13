import { PiuminoError, TestDefinition } from "../types";
import { InputMatcher } from "./input.matcher";
import { Matcher } from "./matcher";
import { OutputMatcher } from "./output.matcher";

export class BaseMatcher extends Matcher {
    public input(inputSelector: string): InputMatcher {
        return new InputMatcher({ ...this.state, inputSelector });
    }

    public output(outputSelector: string): OutputMatcher {
        return new OutputMatcher({ ...this.state, outputSelector });
    }

    public toHaveText(text: string): TestDefinition {
        return [
            this.getTestDescription(`have text '${text}'`),
            () => {
                const elementText = this.getElement().textContent?.trim();

                if (this.negate) {
                    expect(elementText).not.toEqual(text);
                } else {
                    expect(elementText).toEqual(text);
                }
            }
        ];
    }

    public toHaveTextCaseInsensitive(text: string): TestDefinition {
        return [
            this.getTestDescription(`have case insensitive text '${text.toLowerCase()}'`),
            () => {
                const elementText = this.getElement().textContent?.trim().toLowerCase();

                if (this.negate) {
                    expect(elementText).not.toEqual(text.toLowerCase());
                } else {
                    expect(elementText).toEqual(text.toLowerCase());
                }
            }
        ];
    }

    public toBePresent(): TestDefinition {
        return [
            this.getTestDescription("be present"),
            () => {
                const element = this.getElement(false);
                const isInDocument = element && element.ownerDocument === element.getRootNode({ composed: true });

                if (!this.negate && !isInDocument) {
                    throw new PiuminoError(`Expected '${this.state.selector}' to be present`);
                }

                if (this.negate && isInDocument) {
                    throw new PiuminoError(`Expected '${this.state.selector}' not to be present`);
                }

                this.dummyExpect();
            }
        ]
    }

    public toBeVisible(): TestDefinition {
        return [
            this.getTestDescription("be visible"),
            () => {
                const element = this.getElement(false);
                const computedStyle = element && getComputedStyle(element);

                const isStyleVisible = element
                    && computedStyle.display !== "none"
                    && computedStyle.visibility !== "hidden"
                    && computedStyle.visibility !== "collapsed"
                    && computedStyle.opacity !== "0";
                const isAttributeVisible = element && !element.hasAttribute("hidden");
                const isInDocument = element && element.ownerDocument === element.getRootNode({ composed: true });
                const isVisible = isStyleVisible && isAttributeVisible && isInDocument;

                if (!this.negate && !isVisible) {
                    throw new PiuminoError(`Expected '${this.state.selector}' to be visible`);
                }

                if (this.negate && isVisible) {
                    throw new PiuminoError(`Expected '${this.state.selector}' not to be visible`);
                }

                this.dummyExpect();
            }
        ];
    }

    private getTestDescription(description: string): string {
        return `'${this.state.selector}' ${this.negate ? "should not" : "should"} ${description}`;
    }
}
