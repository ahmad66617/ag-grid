/**
 * @ag-grid-community/core - Advanced Data Grid / Data Table supporting Javascript / Typescript / React / Angular / Vue
 * @version v27.0.0
 * @link http://www.ag-grid.com/
 * @license MIT
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const function_1 = require("../utils/function");
const generic_1 = require("../utils/generic");
class ModuleRegistry {
    static register(module, moduleBased = true) {
        ModuleRegistry.modulesMap[module.moduleName] = module;
        if (ModuleRegistry.moduleBased === undefined) {
            ModuleRegistry.moduleBased = moduleBased;
        }
        else {
            if (ModuleRegistry.moduleBased !== moduleBased) {
                function_1.doOnce(() => {
                    console.warn(`AG Grid: You are mixing modules (i.e. @ag-grid-community/core) and packages (ag-grid-community) - you can only use one or the other of these mechanisms.`);
                    console.warn('Please see https://www.ag-grid.com/javascript-grid/packages-modules/ for more information.');
                }, 'ModulePackageCheck');
            }
        }
    }
    // noinspection JSUnusedGlobalSymbols
    static registerModules(modules, moduleBased = true) {
        if (!modules) {
            return;
        }
        modules.forEach(module => ModuleRegistry.register(module, moduleBased));
    }
    static assertRegistered(moduleName, reason) {
        if (this.isRegistered(moduleName)) {
            return true;
        }
        const warningKey = reason + moduleName;
        const warningMessage = `AG Grid: unable to use ${reason} as module ${moduleName} is not present. Please see: https://www.ag-grid.com/javascript-grid/modules/`;
        function_1.doOnce(() => {
            console.warn(warningMessage);
        }, warningKey);
        return false;
    }
    static isRegistered(moduleName) {
        return !!ModuleRegistry.modulesMap[moduleName];
    }
    static getRegisteredModules() {
        return generic_1.values(ModuleRegistry.modulesMap);
    }
    static isPackageBased() {
        return !ModuleRegistry.moduleBased;
    }
}
exports.ModuleRegistry = ModuleRegistry;
// having in a map a) removes duplicates and b) allows fast lookup
ModuleRegistry.modulesMap = {};

//# sourceMappingURL=moduleRegistry.js.map
