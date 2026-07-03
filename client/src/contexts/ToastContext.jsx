import { Toaster } from 'sonner';

export function ToastProvider({ children }) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        theme="dark"
        style={{
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      />
    </>
  );
}
