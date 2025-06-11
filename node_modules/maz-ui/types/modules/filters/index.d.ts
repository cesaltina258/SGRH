import type { App } from 'vue';
declare const filters: {
    capitalize: (value: string) => string;
    currency: (number: string | number, locale: string, options: import("./currency").FilterCurrencyOptions) => string;
    date: (date: string | number | Date, locale: string, options?: Intl.DateTimeFormatOptions | undefined) => string;
    number: (number: string | number, locale: string, options?: Intl.NumberFormatOptions | undefined) => string;
};
export type Filters = typeof filters;
declare const installFilters: {
    install(app: App): void;
};
export { installFilters };
export * from './capitalize';
export * from './currency';
export * from './date';
export * from './number';
