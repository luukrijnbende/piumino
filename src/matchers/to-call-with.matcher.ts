import deepEqual from "fast-deep-equal/es6";
import { FluentChainFinisher } from "../types";
import { Matcher } from "./matcher";

export class ToCallWithMatcher extends Matcher {
    /**
     * Expect the called function to be called with the provided values.
     * The last of the provided values is dispatched as $event in case of an output.
     * 
     * [input]="func(value)"\
     * (output)="func($event)"\
     * (output)="func(value, $event)"
     * 
     * @param values - The values to compare with the values that the function was called with.
     */
    public with(value: unknown, ...rest: unknown[]): FluentChainFinisher<this> {
        const values = [value, ...rest];
        const toCallHandler = this.state.handler;

        this.appendDescription(`with '${values.join("','")}'`);
        this.setHandler(() => {
            const [hasBeenCalled, received] = toCallHandler!(values[values.length - 1]);

            return [hasBeenCalled && deepEqual(received, values), received, values];
        });

        return this;
    }
}
