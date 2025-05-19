import { FC, ReactNode, useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOutsideClick?: boolean;
}

const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOutsideClick = true,
}) => {
  // For client-side rendering only
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen, onClose]);
  
  // Don't render anything if the modal is closed
  if (!isOpen || !mounted) return null;
  
  // Size classes for the modal
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[calc(100%-2rem)] sm:max-w-[calc(100%-4rem)]'
  };
  
  // Function to handle background click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOutsideClick && e.target === e.currentTarget) {
      onClose();
    }
  };
  
  const modalContent = (
    <div 
      className="fixed inset-0 z-[100] overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center"
      aria-labelledby={title ? 'modal-title' : undefined}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div 
        className={`relative bg-dark rounded-xl shadow-2xl ${sizeClasses[size]} w-full m-4 overflow-hidden max-h-[calc(100vh-2rem)]`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        {(title || showCloseButton) && (
          <div className="flex justify-between items-center p-4 sm:p-6 border-b border-light/10">
            {title && (
              <h3 id="modal-title" className="text-lg font-semibold text-light truncate pr-8">
                {title}
              </h3>
            )}
            
            {showCloseButton && (
              <button
                type="button"
                className="absolute right-4 top-4 rounded-md text-light/70 hover:text-light hover:bg-light/10 p-1 transition-colors duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                aria-label="Close"
              >
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            )}
          </div>
        )}
        
        {/* Modal content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-10rem)]">
          {children}
        </div>
      </div>
    </div>
  );
  
  // Use createPortal to render the modal at the end of the document body
  // This avoids z-index and stacking context issues
  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }
  
  return null;
};

export default Modal; 