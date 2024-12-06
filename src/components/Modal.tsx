import React from 'react';

interface ModalProps {
  isOpen: boolean; 
  onClose: () => void; 
  title?: string; 
  children: React.ReactNode; 
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
      />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-black text-white rounded-lg shadow-lg w-300 h-300 p-6">
          {children}
          <div className="mt-4 text-center">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
