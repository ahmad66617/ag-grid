/**
 * Performs a JSON-diff between a source and target JSON structure.
 *
 * On a per property basis, takes the target property value where:
 * - types are different.
 * - type is primitive.
 * - type is array and length or content have changed.
 *
 * Recurses for object types.
 *
 * @param source starting point for diff
 * @param target target for diff vs. source
 *
 * @returns `null` if no differences, or an object with the subset of properties that have changed.
 */
export function jsonDiff(source, target) {
    const lhs = source || {};
    const rhs = target || {};
    const allProps = new Set([
        ...Object.keys(lhs),
        ...Object.keys(rhs),
    ]);
    let propsChangedCount = 0;
    const result = {};
    for (const prop of allProps) {
        // Cheap-and-easy equality check.
        if (lhs[prop] === rhs[prop]) {
            continue;
        }
        const take = (v) => {
            result[prop] = v;
            propsChangedCount++;
        };
        const lhsType = classify(lhs[prop]);
        const rhsType = classify(rhs[prop]);
        if (lhsType !== rhsType) {
            // Types changed, just take RHS.
            take(rhs[prop]);
            continue;
        }
        if (rhsType === 'primitive' || rhsType === null) {
            take(rhs[prop]);
            continue;
        }
        if (rhsType === 'array' && lhs[prop].length !== rhs[prop].length) {
            // Arrays are different sizes, so just take target array.
            take(rhs[prop]);
            continue;
        }
        if (JSON.stringify(lhs[prop]) === JSON.stringify(rhs[prop])) {
            // Deep-and-expensive object check.
            continue;
        }
        if (rhsType === 'array') {
            // Don't try to do anything tricky with array diffs!
            take(rhs[prop]);
            continue;
        }
        const diff = jsonDiff(lhs[prop], rhs[prop]);
        if (diff !== null) {
            take(diff);
        }
    }
    return propsChangedCount === 0 ? null : result;
}
/**
 * Special value used by `jsonMerge` to signal that a property should be removed from the merged
 * output.
 */
export const DELETE = Symbol('<delete-property>');
/**
 * Merge together the provide JSON object structures, with the precedence of application running
 * from higher indexes to lower indexes.
 *
 * Deep-clones all objects to avoid mutation of the inputs changing the output object. For arrays,
 * just performs a deep-clone of the entire array, no merging of elements attempted.
 *
 * @param json all json objects to merge
 *
 * @returns the combination of all of the json inputs
 */
export function jsonMerge(...json) {
    if (json.some(v => v instanceof Array)) {
        throw new Error(`AG Charts - merge of arrays not supported: ${JSON.stringify(json)}`);
    }
    const result = deepClone(json[0]);
    for (const nextJson of json.slice(1)) {
        for (const nextProp in nextJson) {
            if (nextJson[nextProp] === DELETE) {
                delete result[nextProp];
            }
            else if (result[nextProp] instanceof Array) {
                // Overwrite array properties that already exist.
                result[nextProp] = deepClone(nextJson[nextProp]);
            }
            else if (typeof result[nextProp] === 'object') {
                // Recursively merge complex objects.
                result[nextProp] = jsonMerge(result[nextProp], nextJson[nextProp]);
            }
            else if (typeof nextJson[nextProp] === 'object') {
                // Deep clone of nested objects.
                result[nextProp] = deepClone(nextJson[nextProp]);
            }
            else {
                // Just directly assign/overwrite.
                result[nextProp] = nextJson[nextProp];
            }
        }
    }
    return result;
}
/**
 * Recursively apply a JSON object into a class-hierarchy, optionally instantiating certain classes
 * by property name.
 *
 * @param target to apply source JSON properties into
 * @param source to be applied
 * @param params.path path for logging/error purposes, to aid with pinpointing problems
 * @param params.skip property names to skip from the source
 * @param params.constructors dictionary of property name to class constructors for properties that
 *                            require object construction
 */
export function jsonApply(target, source, params = {}) {
    var _a;
    const { path = undefined, skip = [], constructors = {}, } = params;
    if (target == null) {
        throw new Error(`AG Charts - target is uninitialised: ${path || '<root>'}`);
    }
    if (source == null) {
        return target;
    }
    for (const property in source) {
        if (skip.indexOf(property) >= 0) {
            continue;
        }
        const newValue = source[property];
        const propertyPath = `${path ? path + '.' : ''}${property}`;
        const targetAny = target;
        const currentValue = targetAny[property];
        const ctr = constructors[property];
        try {
            const targetClass = (_a = targetAny.constructor) === null || _a === void 0 ? void 0 : _a.name;
            const currentValueType = classify(currentValue);
            const newValueType = classify(newValue);
            if (targetClass != null && targetClass !== 'Object' && !(property in target || targetAny.hasOwnProperty(property))) {
                throw new Error(`Property doesn't exist in target type: ${targetClass}`);
            }
            if (currentValueType != null && newValueType != null && currentValueType !== newValueType) {
                throw new Error(`Property types don't match, can't apply: currentValueType=${currentValueType}, newValueType=${newValueType}`);
            }
            if (newValueType === 'array' || currentValue instanceof HTMLElement) {
                targetAny[property] = newValue;
            }
            else if (newValueType === 'object') {
                if (currentValue != null) {
                    jsonApply(currentValue, newValue, { path: propertyPath, skip, constructors });
                }
                else if (ctr != null) {
                    targetAny[property] = jsonApply(new ctr(), newValue, { path: propertyPath, skip, constructors });
                }
                else {
                    targetAny[property] = newValue;
                }
            }
            else {
                targetAny[property] = newValue;
            }
        }
        catch (error) {
            throw new Error(`AG Charts - unable to set: ${propertyPath}; nested error is: ${error.message}`);
        }
    }
    return target;
}
function deepClone(input) {
    return JSON.parse(JSON.stringify(input));
}
/**
 * Classify the type of a value to assist with handling for merge purposes.
 */
function classify(value) {
    if (value instanceof Array) {
        return 'array';
    }
    else if (typeof value === 'object') {
        return 'object';
    }
    else if (value != null) {
        return 'primitive';
    }
    return null;
}
//# sourceMappingURL=json.js.map