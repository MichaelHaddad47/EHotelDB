import { ReactNode } from 'react';

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

export function Modal({ children, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1f2937] p-6 rounded-lg w-full max-w-md text-white relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-400 hover:text-white text-xl"
          aria-label="Close"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
