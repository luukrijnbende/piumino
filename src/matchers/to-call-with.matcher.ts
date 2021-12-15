import deepEqual from "fast-deep-equal/es6";
import { MatcherFinisher } from "../types";
import { Matcher } from "./matcher";

export class ToCallWithMatcher extends Matcher {
    /**
     * Expect the called function to be called with the provided values.
     * The last of the provided values is dispatched as $event.
     * 
     * (output)="func($event)"\
     * (output)="func(value, $event)"
     * 
     * @param values - The values to compare with the values that the function was called with.
     */
    public with(value: unknown, ...rest: unknown[]): MatcherFinisher<this> {
        const values = [value, ...rest];
        const toCallMatcher = this.state.matcher;

        this.appendDescription(`with '${values}'`);
        this.setMatcher(() => {
            const received = toCallMatcher!(values[values.length - 1])[1];

            return [deepEqual(received, values), received, values];
        });

        return this;
    }
}
