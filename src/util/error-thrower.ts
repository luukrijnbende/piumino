import objectInspect from "object-inspect";
import { ObjectHelper } from "../helpers/object.helper";
import { NOTHING, PiuminoError } from "../types";

export class PiuminoErrorThrower {
    private stack: string | undefined;

    public constructor() {
        this.stack = new Error().stack?.split("\n").filter(item => !item.toLowerCase().includes("piumino")).join("\n");
    }

    public throw(message: string, received: unknown = NOTHING, expected: unknown = NOTHING): never {
        let errorMessage = message;

        if (received !== NOTHING || expected !== NOTHING) {
            errorMessage += `\n\n\x1b[31mReceived: ${this.stringifyValue(received)}\x1b[0m`;
            errorMessage += `\n\n\x1b[32mExpected: ${this.stringifyValue(expected)}\x1b[0m`;
        }

        throw new PiuminoError(errorMessage, this.stack);
    }

    private stringifyValue(value: unknown) {
        if (value === NOTHING) {
            return "";
        }

        if (typeof value === "string") {
            return `'${value}'`;
        }

        if (ObjectHelper.isObject(value)) {
            return `\n${objectInspect(value, { indent: 2 })}`;
        }

        return `${value}`;
    }
}
