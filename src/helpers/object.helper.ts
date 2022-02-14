import { GenericFunction, GenericObject } from "../types";

export class ObjectHelper {
    private static originalFunctions: Map<string, GenericFunction> = new Map();

    public static getProperty(obj: GenericObject, path: string | string[]): unknown {
        const keys = ObjectHelper.pathToKeys(path);
        const value = obj[keys[0]];

        if (value && keys.length > 1) {
            return this.getProperty(value, keys.slice(1));
        }

        return value;
    }

    public static setProperty(obj: GenericObject, path: string | string[], value: unknown): void {
        const keys = ObjectHelper.pathToKeys(path);
        const lastKey = keys.pop();
        const parent = keys.length ? this.getProperty(obj, keys) : obj;

        if (lastKey) {
            (parent as GenericObject)[lastKey] = value;
        }
    }

    public static hasProperty(obj: GenericObject, path: string | string[]): boolean {
        const keys = ObjectHelper.pathToKeys(path);
        const lastKey = keys.pop();
        const parent = keys.length ? this.getProperty(obj, keys) : obj;

        if (lastKey) {
            return lastKey in (parent as GenericObject);
        }
        
        return false;
    }

    public static replaceFunction(obj: GenericObject, func: string, implementation: GenericFunction): void {
        ObjectHelper.originalFunctions.set(this.getOriginalFunctionKey(obj, func), ObjectHelper.getProperty(obj, func) as GenericFunction);
        obj[func] = implementation;
    }

    public static restoreFunction(obj: GenericObject, func: string): void {
        const originalFunctionKey = this.getOriginalFunctionKey(obj, func);
        const originalImplementation = ObjectHelper.originalFunctions.get(originalFunctionKey);

        if (originalImplementation) {
            ObjectHelper.setProperty(obj, func, originalImplementation);
            ObjectHelper.originalFunctions.delete(originalFunctionKey);
        }
    }

    public static isObject(obj: unknown): obj is GenericObject {
        return typeof obj === "function" || typeof obj === "object" && !!obj;
    }

    private static pathToKeys(path: string | string[]): string[] {
        return Array.isArray(path) ? path : path.replace(/\[(\d)\]/g, ".$1").split(".");
    }

    private static getOriginalFunctionKey(obj: GenericObject, func: string): string {
        return `${obj.constructor.name}:func`;
    }
}
