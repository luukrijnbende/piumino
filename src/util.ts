import { DebugElement } from "@angular/core";
import { ComponentFixture } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { LooseObject, Selector } from "./types";

export class Util {
    public static getSelectorName(selector: Selector): string {
        return Util.isString(selector) ? selector : selector.prototype.constructor.name;
    }

    public static getElementBySelector<T>(fixture: ComponentFixture<T>, selector: Selector): DebugElement {
        return fixture.debugElement.query(Util.isString(selector) ? By.css(selector) : By.directive(selector));
    }

    public static getProperty(obj: LooseObject, path: string | string[]): any {
        const keys = Util.pathToKeys(path);
        const value = obj[keys[0]];

        if (value && keys.length > 1) {
            return this.getProperty(value, keys.slice(1));
        }

        return value;
    }

    public static setProperty(obj: LooseObject, path: string | string[], value: any): void {
        const keys = Util.pathToKeys(path);
        const lastKey = keys.pop();
        const parent = keys.length ? this.getProperty(obj, keys) : obj;

        if (lastKey) {
            parent[lastKey] = value;
        }
    }

    private static isString(value: any): value is string {
        return typeof value === "string";
    }

    private static pathToKeys(path: string | string[]): string[] {
        return Array.isArray(path) ? path : path.replace(/\[(\d)\]/g, ".$1").split(".");
    }
}
