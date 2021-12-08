import { TestDefinition } from "../types";
import { InputMatcher } from "./input.matcher";
import { Matcher } from "./matcher";
import { OutputMatcher } from "./output.matcher";

export class BaseMatcher extends Matcher {
    public toHaveText(text: string): TestDefinition {
        return [
            `${this.state.selector} should have text '${text}'`,
            () => {
                expect(this.getElement().textContent?.trim()).toEqual(text);
            }
        ];
    }

    public input(inputSelector: string): InputMatcher {
        return new InputMatcher({ ...this.state, inputSelector });
    }

    public output(outputSelector: string): OutputMatcher {
        return new OutputMatcher({ ...this.state, outputSelector });
    }
}