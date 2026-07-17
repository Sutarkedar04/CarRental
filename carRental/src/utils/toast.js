// src/utils/toast.js
import { toast as hotToast } from 'react-hot-toast';

class ToastService {
  constructor() {
    this.defaultOptions = {
      position: 'top-right',
      duration: 4000,
      style: {
        background: '#363636',
        color: '#fff',
      },
    };
  }

  success(message, options = {}) {
    return hotToast.success(message, {
      ...this.defaultOptions,
      ...options,
      style: {
        ...this.defaultOptions.style,
        background: '#10B981', // Green for success
        ...options.style,
      },
    });
  }

  error(message, options = {}) {
    return hotToast.error(message, {
      ...this.defaultOptions,
      duration: 5000, // Longer for errors
      ...options,
      style: {
        ...this.defaultOptions.style,
        background: '#EF4444', // Red for errors
        ...options.style,
      },
    });
  }

  info(message, options = {}) {
    return hotToast(message, {
      ...this.defaultOptions,
      ...options,
      style: {
        ...this.defaultOptions.style,
        background: '#3B82F6', // Blue for info
        ...options.style,
      },
    });
  }

  loading(message, options = {}) {
    return hotToast.loading(message, {
      ...this.defaultOptions,
      ...options,
    });
  }

  promise(promise, messages, options = {}) {
    return hotToast.promise(promise, messages, {
      ...this.defaultOptions,
      ...options,
    });
  }

  dismiss(toastId) {
    hotToast.dismiss(toastId);
  }

  remove() {
    hotToast.remove();
  }
}

// Create singleton instance
const toast = new ToastService();

export default toast;