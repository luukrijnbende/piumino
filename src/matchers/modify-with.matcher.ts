import { MatcherChainFinisher } from "../types";
import { Matcher } from "./matcher";

export class ModifyWithMatcher extends Matcher {
    /**
     * Expect the bounded property to be modified with the provided value.
     * 
     * [input]="property"\
     * (output)="property = $event"\
     * (output)="property = value"
     * 
     * @param value - The value to modify the bounded property with.
     */
    public modifyWith(value: unknown): MatcherChainFinisher<this> {
        const toBeBoundToMatcher = this.state.matcher;

        this.appendDescription(`modified with '${value}'`);
        this.setMatcher(() => toBeBoundToMatcher!(value));

        return this;
    }
}
