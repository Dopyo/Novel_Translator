import { FaTrash } from "react-icons/fa";

const ChapterSidebar = ({
  chapters,
  selectedChapter,
  handleChapterClick,
  setIsChapterModalOpen,
}) => {
  return (
    <div className="w-64 bg-gray-700 text-white p-6 shadow-lg overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Chapters</h2>
        <button
          onClick={() => setIsChapterModalOpen(true)}
          className="p-2 bg-gray-500 rounded hover:bg-gray-600 transition-colors"
        >
          ➕
        </button>
      </div>
      <ul>
        {chapters.map((chapter) => (
          <li
            key={chapter.id}
            className={`group relative p-2 rounded cursor-pointer mb-2 transition-colors ${
              selectedChapter?.id === chapter.id
                ? "bg-teal-500"
                : "hover:bg-gray-600"
            }`}
            onClick={() => handleChapterClick(chapter)}
          >
            Chapter {chapter.chapter_number}
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteChapter(chapter.id);
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

export default ChapterSidebar;
