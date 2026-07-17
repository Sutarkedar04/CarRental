// src/providers/ToastProvider.jsx
import { Toaster } from 'react-hot-toast';

const ToastProvider = ({ children }) => {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          // Success toast styling
          success: {
            duration: 3000,
            style: {
              background: '#10B981',
              color: 'white',
              fontWeight: '500',
            },
            iconTheme: {
              primary: 'white',
              secondary: '#10B981',
            },
          },
          // Error toast styling
          error: {
            duration: 4000,
            style: {
              background: '#EF4444',
              color: 'white',
              fontWeight: '500',
            },
            iconTheme: {
              primary: 'white',
              secondary: '#EF4444',
            },
          },
          // Loading toast styling
          loading: {
            duration: Infinity,
            style: {
              background: '#3B82F6',
              color: 'white',
              fontWeight: '500',
            },
          },
          // Default toast styling
          style: {
            background: '#363636',
            color: 'white',
            fontWeight: '500',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            maxWidth: '400px',
          },
        }}
        containerStyle={{
          top: 20,
          right: 20,
        }}
      />
      {children}
    </>
  );
};

export default ToastProvider;