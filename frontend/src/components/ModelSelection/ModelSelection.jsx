const ModelSelection = ({
  models,
  selectedModel,
  setSelectedModel,
  isModelMenuOpen,
  setIsModelMenuOpen,
}) => {
  return (
    <>
      {/* Model Selection Icon */}
      <button
        onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
        className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
      >
        🧠
      </button>

      {/* Model Selection Popup Menu */}
      {isModelMenuOpen && (
        <div className="absolute bottom-12 right-0 bg-gray-700 p-4 rounded shadow-lg">
          <h3 className="text-lg font-bold mb-2">Select Model</h3>
          <ul>
            {models.map((model, index) => (
              <li
                key={index}
                className={`p-2 rounded cursor-pointer mb-2 transition-colors ${
                  selectedModel === model ? "bg-teal-500" : "hover:bg-gray-600"
                }`}
                onClick={() => {
                  setSelectedModel(model);
                  setIsModelMenuOpen(false);
                }}
              >
                {model}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default ModelSelection;
