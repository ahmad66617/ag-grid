/**
 * @ag-grid-community/core - Advanced Data Grid / Data Table supporting Javascript / Typescript / React / Angular / Vue
 * @version v27.0.0
 * @link http://www.ag-grid.com/
 * @license MIT
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Bean } from "../context/context";
import { BeanStub } from "../context/beanStub";
let AgStackComponentsRegistry = class AgStackComponentsRegistry extends BeanStub {
    constructor() {
        super(...arguments);
        this.componentsMappedByName = {};
    }
    setupComponents(components) {
        if (components) {
            components.forEach(componentMeta => this.addComponent(componentMeta));
        }
    }
    addComponent(componentMeta) {
        // get name of the class as a string
        // let className = getNameOfClass(ComponentClass);
        // insert a dash after every capital letter
        // let classEscaped = className.replace(/([A-Z])/g, "-$1").toLowerCase();
        const classEscaped = componentMeta.componentName.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
        // put all to upper case
        const classUpperCase = classEscaped.toUpperCase();
        // finally store
        this.componentsMappedByName[classUpperCase] = componentMeta.componentClass;
    }
    getComponentClass(htmlTag) {
        return this.componentsMappedByName[htmlTag];
    }
};
AgStackComponentsRegistry = __decorate([
    Bean('agStackComponentsRegistry')
], AgStackComponentsRegistry);
export { AgStackComponentsRegistry };
