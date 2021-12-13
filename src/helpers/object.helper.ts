type Obj = Record<string, any>;
type Function = (...args: any[]) => void;

export class ObjectHelper {
    private static originalFunctions: Map<string, Function> = new Map();

    public static getProperty(obj: Obj, path: string | string[]): any {
        const keys = ObjectHelper.pathToKeys(path);
        const value = obj[keys[0]];

        if (value && keys.length > 1) {
            return this.getProperty(value, keys.slice(1));
        }

        return value;
    }

    public static setProperty(obj: Obj, path: string | string[], value: any): void {
        const keys = ObjectHelper.pathToKeys(path);
        const lastKey = keys.pop();
        const parent = keys.length ? this.getProperty(obj, keys) : obj;

        if (lastKey) {
            parent[lastKey] = value;
        }
    }

    public static replaceFunction(obj: Obj, func: string, implementation: Function): void {
        ObjectHelper.originalFunctions.set(this.getOriginalFunctionKey(obj, func), ObjectHelper.getProperty(obj, func));
        obj[func] = implementation;
    }

    public static restoreFunction(obj: Obj, func: string): void {
        const originalFunctionKey = this.getOriginalFunctionKey(obj, func);

        ObjectHelper.setProperty(obj, func, ObjectHelper.originalFunctions.get(originalFunctionKey));
        ObjectHelper.originalFunctions.delete(originalFunctionKey);
    }

    private static pathToKeys(path: string | string[]): string[] {
        return Array.isArray(path) ? path : path.replace(/\[(\d)\]/g, ".$1").split(".");
    }

    private static getOriginalFunctionKey(obj: Obj, func: string): string {
        return `${obj.constructor.name}:func`;
    }
}
