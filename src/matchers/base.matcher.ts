import { FluentChainFinisher, FluentChainStarter } from "../types";
import { InputMatcher } from "./input.matcher";
import { Matcher } from "./matcher";
import { OutputMatcher } from "./output.matcher";

export class BaseMatcher extends Matcher {
    /**
     * Select an input of the selected element to expect something on.
     * 
     * @param inputSelector - The selector to find the input.
     */
    public input(inputSelector: string): FluentChainStarter<InputMatcher> {
        return new InputMatcher({ ...this.state, inputSelector });
    }

    /**
     * Select an output of the selected element to expect something on.
     * 
     * @param outputSelector - The selector to find the output.
     */
    public output(outputSelector: string): FluentChainStarter<OutputMatcher> {
        return new OutputMatcher({ ...this.state, outputSelector });
    }

    /**
     * Expect the selected element to have the provided text.
     * 
     * @param text - The text to compare with the text of the selected element.
     */
    public toHaveText(text: string): FluentChainFinisher<this> {
        this.setDescription(`have text '${text}'`);
        this.setHandler(() => {
            const elementText = this.getElement().nativeElement.textContent?.trim() ?? "";

            return [elementText === text, elementText, text];
        });

        return this;
    }

    /**
     * Expect the selected element to have the provided text, ignoring case.
     * 
     * @param text - The text to compare with the text of the selected element.
     */
    public toHaveTextCaseInsensitive(text: string): FluentChainFinisher<this> {
        this.setDescription(`have case insensitive text '${text.toLowerCase()}'`);
        this.setHandler(() => {
            const elementText = this.getElement().nativeElement.textContent?.trim().toLowerCase() ?? "";

            return [elementText === text.toLowerCase(), elementText, text.toLowerCase()];
        });

        return this;
    }

    /**
     * Expect the selected element to be present in the DOM.
     */
    public toBePresent(): FluentChainFinisher<this> {
        this.setDescription("be present");
        this.setHandler(() => {
            const element = this.getElement(false)?.nativeElement;

            return [!!element && element.ownerDocument === element.getRootNode({ composed: true })];
        });

        return this;
    }

    /**
     * Expect the selected element to be visible in the DOM.
     */
    public toBeVisible(): FluentChainFinisher<this> {
        this.setDescription("be visible");
        this.setHandler(() => {
            const element = this.getElement(false)?.nativeElement;

            if (!element) {
                return [false];
            }

            const computedStyle = getComputedStyle(element);
            const isStyleVisible = computedStyle.display !== "none"
                && computedStyle.visibility !== "hidden"
                && computedStyle.visibility !== "collapsed"
                && computedStyle.opacity !== "0";
            const isAttributeVisible = !element.hasAttribute("hidden");
            const isInDocument = element.ownerDocument === element.getRootNode({ composed: true });

            return [isStyleVisible && isAttributeVisible && isInDocument];
        });

        return this;
    }
}
