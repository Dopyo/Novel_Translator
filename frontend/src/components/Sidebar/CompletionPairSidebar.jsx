import { FaTrash } from "react-icons/fa";

const CompletionPairSidebar = ({
  completionPairs,
  selectedCompletionPair,
  handleCompletionPairClick,
}) => {
  return (
    <div className="w-64 bg-gray-800 text-white shadow-lg overflow-y-auto">
      <h2 className="text-xl font-bold p-6">Completion Pairs</h2>
      <ul className="p-6 pt-0">
        {completionPairs.map((pair) => (
          <li
            key={pair.id}
            className={`group relative p-2 rounded cursor-pointer mb-2 transition-colors ${
              selectedCompletionPair?.id === pair.id
                ? "bg-teal-500"
                : "hover:bg-gray-700"
            }`}
            onClick={() => handleCompletionPairClick(pair)}
          >
            {pair.name}
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteCompletionPair(pair.id);
              }}
            >
              <FaTrash />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompletionPairSidebar;
