import { BaseMatcher } from "./matchers/base.matcher";
import { ComponentFixtureLike, PiuminoError, Selector } from "./types";

export class Piumino {
    private _fixture: ComponentFixtureLike | null = null;

    public get fixture(): ComponentFixtureLike {
        if (!this._fixture) {
            throw new PiuminoError('Could not get fixture, please initialize Piumino first');
        }

        return this._fixture;
    }

    public init(fixture: ComponentFixtureLike) {
        this._fixture = fixture;
    }

    public expect(selector: Selector) {
        return new BaseMatcher({ selector, getFixture: () => this.fixture });
    }
}
