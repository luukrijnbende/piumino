import { DebugElement, Type, ɵReflectionCapabilities } from "@angular/core";
import { GenericObject, NOTHING } from "../types";
import { ObjectHelper } from "./object.helper";

export class NgHelper {
    private static reflectionCapabilities = new ɵReflectionCapabilities();

    public static getProperty(element: DebugElement, property: string): unknown {
        if (element.nativeElement.hasAttribute(property)) {
            return element.nativeElement.getAttribute(property);
        }

        for (const token of element.providerTokens) {
            const provider = ObjectHelper.isObject(token) && token.provide ? token.provide : token;
            const instance = element.injector.get(provider as Type<any>);
            const propertyMap = NgHelper.getDirectivePropertyMap(instance);

            if (propertyMap[property] in instance) {
                return instance[propertyMap[property]];
            }
        }

        return NOTHING;
    }

    public static hasProperty(element: DebugElement, property: string): boolean {
        return NgHelper.getProperty(element, property) !== NOTHING;
    }

    private static getDirectivePropertyMap(directive: GenericObject): Record<string, string> {
        const propertyMap: Record<string, string> = {};
        const metadata = this.reflectionCapabilities.propMetadata(directive.constructor);

        if (metadata) {
            for (const [property, decorators] of Object.entries(metadata)) {
                propertyMap[property] = property;

                for (const decorator of decorators) {
                    if (decorator.bindingPropertyName) {
                        propertyMap[decorator.bindingPropertyName] = property;
                    }
                }
            }
        }

        return propertyMap;
    }
}
