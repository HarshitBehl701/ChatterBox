import { ToastPosition, ToastTransitionProps } from "react-toastify";

export interface IToastPopupOptions{
    position: ToastPosition | undefined;
    autoClose: number;
    hideProgressBar: boolean;
    closeOnClick: boolean;
    pauseOnHover: boolean;
    draggable: boolean;
    progress: undefined | number;
    theme: string;
    transition:  ({ children, position, preventExitTransition, done, nodeRef, isIn, playToast }: ToastTransitionProps) => React.JSX.Element;
}

export interface  IHandleToastPopupParams{
    type: string;
    message:string;
    position?: IToastPopupOptions['position'];
    autoClose?: IToastPopupOptions['autoClose'];
    hideProgressBar?: IToastPopupOptions['hideProgressBar'];
    closeOnClick?: IToastPopupOptions['closeOnClick'];
    pauseOnHover?: IToastPopupOptions['pauseOnHover'];
    draggable?: IToastPopupOptions['draggable'];
    progress?: IToastPopupOptions['progress'];
    theme?: IToastPopupOptions['theme'];
    transition?: IToastPopupOptions['transition'];
}