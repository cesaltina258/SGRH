export type LoaderId = unknown;
export declare const DEFAULT_LOADER: LoaderId;
export declare const uniq: (array: LoaderId[]) => unknown[];
export declare const contains: (array: Array<LoaderId>) => (predicate?: LoaderId | VoidFunction) => boolean;
export declare const hasItems: (array: LoaderId[]) => boolean;
export declare const push: (array: LoaderId[]) => (item?: LoaderId) => unknown[];
export declare const pop: (array: LoaderId[]) => (item?: LoaderId) => unknown[];
