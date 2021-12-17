import { BaseMatcher } from "./matchers/base.matcher";
import { Piumino } from "./piumino";

describe("Piumino", () => {
    describe("expect", () => {
        it("should return an instance of BaseMatcher", () => {
            const piumino = new Piumino();
            const matcher = piumino.expect("selector");

            expect(matcher).toBeInstanceOf(BaseMatcher);
        });
    });
});
