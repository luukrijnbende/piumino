import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
import { ComponentFixtureLike, LooseObject, Selector } from "../types";

export class Util {
    public static isString(value: any): value is string {
        return typeof value === "string" || value instanceof String;
    }

    public static isFunction(value: any): value is Function {
        return typeof value === "function";
    }

    public static isAngularType(element: DebugElement): boolean {
        return element.nativeNode instanceof HTMLUnknownElement;
    }

    public static getSelectorName(selector: Selector): string {
        return Util.isString(selector) ? selector : (selector as any).prototype.constructor.name;
    }

    public static getElementBySelector(fixture: ComponentFixtureLike, selector: Selector): DebugElement {
        return fixture.debugElement.query(Util.isString(selector) ? By.css(selector) : By.directive(selector as any));
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

    private static pathToKeys(path: string | string[]): string[] {
        return Array.isArray(path) ? path : path.replace(/\[(\d)\]/g, ".$1").split(".");
    }
}
