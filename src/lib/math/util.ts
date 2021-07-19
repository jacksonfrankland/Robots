export function clamp (number: number, min: number, max: number) {
    number = Math.min(number, max);
    number = Math.max(number, min);
    return number;
}
