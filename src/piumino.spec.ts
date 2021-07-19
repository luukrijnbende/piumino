import { Piumino } from "./piumino";

describe("Piumino", () => {
    const fixture = {
        detectChanges: jest.fn()
    } as any;
    const component = { component: "test" };
    let piumino: Piumino<any>;

    beforeEach(() => {
        jest.resetAllMocks();

        piumino = new Piumino();
        piumino.init(fixture, component);
    });

    describe("init", () => {
        it("assigns fixture", () => {
            piumino.init(fixture, component);

            expect(piumino.fixture).toBe(fixture);
        });

        it("assigns component", () => {
            piumino.init(fixture, component);

            expect(piumino.component).toBe(component);
        });
    });

    describe("before", () => {
        it("returns the test case", () => {
            const result = piumino.before(["test", jest.fn()], jest.fn());

            expect(result[0]).toBe("test");
        });

        it("calls before, detectChanges and test in order", () => {
            const before = jest.fn();
            const test = jest.fn();
            const result = piumino.before(["test", test], before);
            result[1]();

            const beforeOrder = before.mock.invocationCallOrder[0];
            const detectChangesOrder = fixture.detectChanges.mock.invocationCallOrder[0];
            const testOrder = test.mock.invocationCallOrder[0];

            expect(beforeOrder).toBeLessThan(detectChangesOrder);
            expect(detectChangesOrder).toBeLessThan(testOrder);
        });
    });

    describe("after", () => {
        it("returns the test case", () => {
            const result = piumino.after(["test", jest.fn()], jest.fn());

            expect(result[0]).toBe("test");
        });

        it("calls test, detectChanges and after in order", () => {
            const after = jest.fn();
            const test = jest.fn();
            const result = piumino.after(["test", test], after);
            result[1]();

            const afterOrder = after.mock.invocationCallOrder[0];
            const detectChangesOrder = fixture.detectChanges.mock.invocationCallOrder[0];
            const testOrder = test.mock.invocationCallOrder[0];

            expect(testOrder).toBeLessThan(detectChangesOrder);
            expect(detectChangesOrder).toBeLessThan(afterOrder);
        });
    });
});
