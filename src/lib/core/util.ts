export function clone<T> (source: T): T {
    return Array.isArray(source)
        ? source.map(item => clone(item))
        : source instanceof Date
            ? new Date(source.getTime())
            : source && typeof source === 'object'
                ? Object.getOwnPropertyNames(source).reduce((o, prop) => {
                    Object.defineProperty(o, prop, Object.getOwnPropertyDescriptor(source, prop));
                    o[prop] = clone(source[prop]);
                    return o;
                }, Object.create(Object.getPrototypeOf(source)))
                : source as T;
}

export function unique<T> (items: T[]): T[] {
    return [...(new Set(items))];
}

export function sleep (delay) {
    return new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Coverts a color from a string to a number.
 * @param color color in the form '#22FF22'
 * @returns color in the form 0x22ff22
 */
export function colorStringToNumber (color: string) {
    return Number(color.replace('#', '0x'));
}
