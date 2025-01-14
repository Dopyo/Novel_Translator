const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-700 rounded-lg p-6 w-full max-w-md relative">
        {" "}
        {/* Added relative for positioning */}
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-300 hover:text-gray-100 transition-colors"
        >
          &times; {/* "X" icon */}
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
