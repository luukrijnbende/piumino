import { GenericObject, PiuminoError } from "../types";

interface DirectiveMetadata {
    inputs?: Record<string, string>;
    outputs?: Record<string, string>;
}

export class NgHelper {
    public static getProperty(element: HTMLElement, property: string, throwError?: (message: string) => void): any {
        if (element.hasAttribute(property)) {
            return element.getAttribute(property);
        }

        const component = NgHelper.getComponent(element);
        
        if (component) {
            const propertyMap = NgHelper.getDirectivePropertyMap(component);

            if (property in component) {
                return component[property];
            }

            if (propertyMap[property] in component) {
                return component[propertyMap[property]];
            }
        }

        const directives = NgHelper.getDirectives(element);

        if (directives.length) {
            for (const directive of directives) {
                const propertyMap = NgHelper.getDirectivePropertyMap(directive);
    
                if (property in directive) {
                    return directive[property];
                }

                if (propertyMap[property] in directive) {
                    return directive[propertyMap[property]];
                }
            }
        }

        if (throwError) {
            throwError(`Property '${property}' not found on '${element.localName}''`);
        }
    }

    private static getComponent(element: HTMLElement): GenericObject {
        // @ts-ignore
        return window.ng.getComponent(element);
    }

    private static getDirectives(element: HTMLElement): GenericObject[] {
        // @ts-ignore
        return window.ng.getDirectives(element);
    }

    private static getDirectiveMetadata(directive: GenericObject): DirectiveMetadata {
        // Function does not exist before Angular 12.
        // @ts-ignore
        return window.ng.getDirectiveMetadata ? window.ng.getDirectiveMetadata(directive) : {};
    }

    private static getDirectivePropertyMap(directive: GenericObject): Record<string, string> {
        const metadata = NgHelper.getDirectiveMetadata(directive);

        return metadata ? { ...metadata.inputs, ...metadata.outputs } : {};
    }
}
