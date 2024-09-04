import React from 'react';
type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'; // sizeの型を定義
};
export default function Modal({ isOpen, onClose, children, size = 'md' }: ModalProps) {
  if (!isOpen) return null;

  const sizeClasses: Record<string, string> = { // 変更: Record型を使用
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'w-1/2 max-h-10xl',
    full: 'w-full h-full',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white p-6 rounded-lg shadow-lg relative ${sizeClasses[size]} m-4 max-h-[90vh] overflow-auto`}>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}