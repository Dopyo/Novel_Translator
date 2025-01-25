import ModelSelection from "../ModelSelection/ModelSelection";

const ActionButtons = ({
  selectedChapter,
  selectedCompletionPair,
  selectedModel,
  selectedNovel,
  setChapters,
  setSelectedChapter,
  models,
  setSelectedModel,
  isModelMenuOpen,
  setIsModelMenuOpen,
  generateCompletionPair,
  createNewChapter,
  fetchChapters,
}) => {
  const handleCreateCurrentChapter = () => {
    if (selectedChapter && selectedCompletionPair && selectedModel) {
      generateCompletionPair(
        selectedCompletionPair.request_json.messages[1].content,
        selectedChapter.id,
        selectedModel
      );
    }
  };

  const handleCreateNextChapter = async () => {
    if (selectedChapter && selectedCompletionPair && selectedModel) {
      try {
        const systemPrompt = selectedChapter.system_prompt;
        const newChapter = await createNewChapter(
          selectedNovel.id,
          systemPrompt
        );

        await generateCompletionPair(
          selectedCompletionPair.request_json.messages[0].content,
          newChapter.id,
          selectedModel
        );

        await fetchChapters(selectedNovel.id, setChapters);

        setSelectedChapter(newChapter);
      } catch (error) {
        console.error("Error creating next chapter:", error);
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4 flex space-x-4">
      <ModelSelection
        models={models}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        isModelMenuOpen={isModelMenuOpen}
        setIsModelMenuOpen={setIsModelMenuOpen}
      />
      <button
        onClick={handleCreateCurrentChapter}
        className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
      >
        ➕ Current Chapter
      </button>
      <button
        onClick={handleCreateNextChapter}
        className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
      >
        ➕ Next Chapter
      </button>
    </div>
  );
};

export default ActionButtons;
