import { toast } from 'react-toastify';
import type { ToastOptions, ToastPosition, TypeOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Default toast configuration
const defaultConfig: ToastOptions = {
  position: 'top-left' as ToastPosition,
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: false,
  progress: undefined,
  theme: 'colored',
};

// Different toast types with their configurations
export const showToast = {
  success: (message: string, options?: ToastOptions) => {
    return toast.success(message, { ...defaultConfig, ...options });
  },
  error: (message: string, options?: ToastOptions) => {
    return toast.error(message, { ...defaultConfig, ...options });
  },
  info: (message: string, options?: ToastOptions) => {
    return toast.info(message, { ...defaultConfig, ...options });
  },
  warning: (message: string, options?: ToastOptions) => {
    return toast.warning(message, { ...defaultConfig, ...options });
  },
  default: (message: string, options?: ToastOptions) => {
    return toast(message, { ...defaultConfig, ...options });
  },
  custom: (message: string, type: TypeOptions, options?: ToastOptions) => {
    return toast(message, { ...defaultConfig, type, ...options });
  },
};

// Toast container configuration (to be used in App.tsx)
export const toastContainerConfig = {
  position: 'top-right' as ToastPosition,
  autoClose: 3000,
  hideProgressBar: false,
  newestOnTop: false,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
  theme: 'light',
};