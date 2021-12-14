import { InputMatcher } from "./input.matcher";
import { Matcher, MatcherChain, MatcherFinisher } from "./matcher";
import { OutputMatcher } from "./output.matcher";

export class BaseMatcher extends Matcher {
    public input(inputSelector: string): MatcherChain<InputMatcher> {
        return new InputMatcher({ ...this.state, inputSelector });
    }

    public output(outputSelector: string): MatcherChain<OutputMatcher> {
        return new OutputMatcher({ ...this.state, outputSelector });
    }

    public toHaveText(text: string): MatcherFinisher {
        this.setDescription(`have text '${text}'`);
        this.setMatcher(() => {
            const elementText = this.getElement().textContent?.trim() ?? "";

            return [elementText === text, elementText, text];
        });

        return this;
    }

    public toHaveTextCaseInsensitive(text: string): MatcherFinisher {
        this.setDescription(`have case insensitive text '${text.toLowerCase()}'`);
        this.setMatcher(() => {
            const elementText = this.getElement().textContent?.trim().toLowerCase() ?? "";

            return [elementText === text.toLowerCase(), elementText, text.toLowerCase()];
        });

        return this;
    }

    public toBePresent(): MatcherFinisher {
        this.setDescription("be present");
        this.setMatcher(() => {
            const element = this.getElement(false);

            return element && element.ownerDocument === element.getRootNode({ composed: true });
        });

        return this;
    }

    public toBeVisible(): MatcherFinisher {
        this.setDescription("be visible");
        this.setMatcher(() => {
            const element = this.getElement(false);
            const computedStyle = element && getComputedStyle(element);

            const isStyleVisible = element
                && computedStyle.display !== "none"
                && computedStyle.visibility !== "hidden"
                && computedStyle.visibility !== "collapsed"
                && computedStyle.opacity !== "0";
            const isAttributeVisible = element && !element.hasAttribute("hidden");
            const isInDocument = element && element.ownerDocument === element.getRootNode({ composed: true });

            return isStyleVisible && isAttributeVisible && isInDocument;
        });

        return this;
    }
}
