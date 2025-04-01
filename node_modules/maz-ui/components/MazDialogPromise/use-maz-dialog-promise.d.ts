export interface DialogState {
    id: string;
    isActive: boolean;
    resolve: (value: unknown) => void;
    reject?: (reason?: unknown) => void;
}
export interface DialogData {
    title: string;
    message: string;
    cancelText?: string;
    confirmText?: string;
}
export declare const useMazDialogPromise: () => {
    confirmDialogData: import("vue").Ref<DialogData | undefined>;
    dialogState: import("vue").Ref<{
        id: string;
        isActive: boolean;
        resolve: (value: unknown) => void;
        reject?: ((reason?: unknown) => void) | undefined;
    }[]>;
    showDialogAndWaitChoice: (identifier: string, callback?: () => unknown) => Promise<unknown>;
    removeDialogFromState: (identifier: string) => {
        id: string;
        isActive: boolean;
        resolve: (value: unknown) => void;
        reject?: ((reason?: unknown) => void) | undefined;
    }[];
    rejectDialog: (currentDialog: DialogState, response?: string | boolean) => void;
    resolveDialog: (currentDialog: DialogState, response?: string | boolean) => void;
};
