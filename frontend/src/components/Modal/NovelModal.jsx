import CreateNovelForm from "./CreateNovelForm";

const NovelModal = ({ isOpen, onClose, setNovels }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-700 rounded-lg p-6 w-full max-w-md relative">
        <CreateNovelForm onClose={onClose} setNovels={setNovels} />
      </div>
    </div>
  );
};

export default NovelModal;
