/**
 * A JavaScript object that is not `null`, a function, or an array.
 */
export type RuntimeObject = Record<PropertyKey, unknown>;

/**
 * A type guard for {@link RuntimeObject}.
 *
 * @param value - The value to check.
 * @returns Whether the specified value has a runtime type of `object` and is
 * neither `null` nor an `Array`.
 */
export function isObject(value: unknown): value is RuntimeObject {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}
