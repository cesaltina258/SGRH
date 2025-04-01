interface IPosObject {
    x: number;
    y: number;
}
export declare const getOffset: (elem: HTMLDivElement) => IPosObject;
/**
 * Get the position of the mouse/finger in the element
 * @param e Trigger event
 * @param elem Container element
 * @param isReverse From the right/bottom
 */
export declare const getPos: (e: MouseEvent | TouchEvent, elem: HTMLDivElement, isReverse?: boolean) => IPosObject;
export declare const isBetween: (value: number, prev: number, next: number, direction: string) => boolean;
export declare const getOpacityCoeff: (index: number, middle: number, length: number) => number;
export {};
