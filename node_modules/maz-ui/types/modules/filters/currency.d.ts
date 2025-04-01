export interface FilterCurrencyOptions extends Intl.NumberFormatOptions {
    round?: boolean;
}
export declare const currency: (number: number | string, locale: string, options: FilterCurrencyOptions) => string;
