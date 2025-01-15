import { FaTrash } from "react-icons/fa";

const NovelSidebar = ({
  novels,
  selectedNovel,
  handleNovelClick,
  setIsNovelModalOpen,
}) => {
  return (
    <div className="w-64 bg-gray-800 text-white p-6 shadow-lg overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Novels</h2>
        <button
          onClick={() => setIsNovelModalOpen(true)}
          className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
        >
          ➕
        </button>
      </div>
      <ul>
        {novels.map((novel) => (
          <li
            key={novel.id}
            className={`group relative p-2 rounded cursor-pointer mb-2 transition-colors ${
              selectedNovel?.id === novel.id
                ? "bg-teal-500"
                : "hover:bg-gray-700"
            }`}
            onClick={() => handleNovelClick(novel)}
          >
            {novel.name}
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteNovel(novel.id);
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

export default NovelSidebar;
