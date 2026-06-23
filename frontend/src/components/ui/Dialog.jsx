import React, { useEffect, useRef } from 'react';
import { cn } from '../../lib/utils.js';

const DialogContext = React.createContext(null);

export function Dialog({ open, onOpenChange, children }) {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
      {open && (
        <DialogPortal>
          <DialogOverlay onClick={() => onOpenChange?.(false)} />
          <DialogContentWrapper>{children}</DialogContentWrapper>
        </DialogPortal>
      )}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({ children, asChild, ...props }) {
  const ctx = React.useContext(DialogContext);
  return (
    <span onClick={() => ctx?.onOpenChange?.(true)} {...props}>
      {children}
    </span>
  );
}

function DialogPortal({ children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {children}
    </div>
  );
}

function DialogOverlay({ onClick }) {
  return (
    <div
      className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={onClick}
    />
  );
}

function DialogContentWrapper({ children }) {
  const contentRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        const ctx = document.querySelector('[data-dialog-close]');
        ctx?.click();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      ref={contentRef}
      className="relative z-50 w-full max-w-lg rounded-xl border border-gray-200 bg-white shadow-xl animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      {children}
    </div>
  );
}

export function DialogContent({ className, children, ...props }) {
  const ctx = React.useContext(DialogContext);
  const content = React.Children.toArray(children).filter(
    (child) => child.type !== DialogHeader && child.type !== DialogFooter
  );
  const header = React.Children.toArray(children).find((child) => child.type === DialogHeader);
  const footer = React.Children.toArray(children).find((child) => child.type === DialogFooter);

  return (
    <>
      {header}
      <div className={cn('p-6', className)} {...props}>
        {content}
      </div>
      {footer}
      <button
        data-dialog-close
        className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
        onClick={() => ctx?.onOpenChange?.(false)}
        aria-label="Cerrar"
      >
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80709 2.99385 3.44302 2.99385 3.21847 3.2184C2.99392 3.44295 2.99392 3.80702 3.21847 4.03157L6.68688 7.49999L3.21847 10.9684C2.99392 11.1929 2.99392 11.557 3.21847 11.7816C3.44302 12.0061 3.80709 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.1929 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
        </svg>
      </button>
    </>
  );
}

export function DialogHeader({ className, ...props }) {
  return <div className={cn('flex flex-col space-y-1.5 p-6 pb-0', className)} {...props} />;
}

export function DialogTitle({ className, ...props }) {
  return <h2 className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />;
}

export function DialogDescription({ className, ...props }) {
  return <p className={cn('text-sm text-gray-500', className)} {...props} />;
}

export function DialogFooter({ className, ...props }) {
  return <div className={cn('flex items-center justify-end gap-2 p-6 pt-0', className)} {...props} />;
}
