import CreateChapterForm from "./CreateChapterForm";

const ChapterModal = ({ isOpen, onClose, selectedNovel, setChapters }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-700 rounded-lg p-6 w-full max-w-md relative">
        <CreateChapterForm
          onClose={onClose}
          selectedNovel={selectedNovel}
          setChapters={setChapters}
        />
      </div>
    </div>
  );
};

export default ChapterModal;
