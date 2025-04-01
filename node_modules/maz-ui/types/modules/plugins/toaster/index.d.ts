import type { ToasterOptions } from './types';
import { ToasterHandler } from './toaster-handler';
import type { App } from 'vue';
export declare let toastInstance: ToasterHandler;
export declare function createToaster(app: App, options?: ToasterOptions): ToasterHandler;
export declare const installToaster: {
    install(app: App, options?: ToasterOptions): void;
};
export type { ToasterOptions, ToasterPosition, ToasterPositions } from './types';
export { ToasterHandler } from './toaster-handler';
