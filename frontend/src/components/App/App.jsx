import { useState, useEffect } from "react";
import NovelSidebar from "../Sidebar/NovelSidebar";
import ChapterSidebar from "../Sidebar/ChapterSidebar";
import CompletionPairSidebar from "../Sidebar/CompletionPairSidebar";
import RequestMessageSection from "../MainContent/RequestMessageSection";
import ResponseMessageSection from "../MainContent/ResponseMessageSection";
import ActionButtons from "../Buttons/ActionButtons";
import NovelModal from "../Modal/NovelModal";
import ChapterModal from "../Modal/ChapterModal";
import {
  fetchNovels,
  fetchChapters,
  fetchCompletionPairs,
  fetchModels,
} from "../../utils/fetchData";

function App() {
  const [novels, setNovels] = useState([]);
  const [selectedNovel, setSelectedNovel] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [completionPairs, setCompletionPairs] = useState([]);
  const [selectedCompletionPair, setSelectedCompletionPair] = useState(null);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  const [isNovelModalOpen, setIsNovelModalOpen] = useState(false);
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);

  const generateCompletionPair = async (prompt, chapterId, modelName) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/generate-completion",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: prompt,
            chapter_id: chapterId,
            model_id: modelName,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonString = line.slice(6).trim();
            if (jsonString) {
              try {
                const parsedChunk = JSON.parse(jsonString);
                if (parsedChunk.content) {
                  fullResponse += parsedChunk.content;
                  setSelectedCompletionPair((prevPair) => ({
                    ...prevPair,
                    response_json: {
                      choices: [
                        {
                          message: {
                            content: fullResponse,
                          },
                        },
                      ],
                    },
                  }));
                }
              } catch (error) {
                console.error("Error parsing JSON:", error);
              }
            }
          } else if (line.startsWith("event: end")) {
            console.log("Stream ended");
            await fetchCompletionPairs(chapterId);
            break;
          }
        }
      }
    } catch (error) {
      console.error("Error generating completion pair:", error);
    }
  };

  useEffect(() => {
    fetchNovels(setNovels);
    fetchModels(setModels);
  }, []);

  const handleNovelClick = (novel) => {
    setSelectedNovel(novel);
    setSelectedChapter(null);
    setCompletionPairs([]);
    setSelectedCompletionPair(null);
    fetchChapters(novel.id, setChapters);
  };

  const handleChapterClick = (chapter) => {
    setSelectedChapter(chapter);
    setSelectedCompletionPair(null);
    fetchCompletionPairs(chapter.id, setCompletionPairs);
  };

  const handleCompletionPairClick = (pair) => {
    setSelectedCompletionPair(pair);
  };

  const handleDeleteCompletionPair = async (pairId) => {
    try {
      await deleteCompletionPair(pairId);
      setCompletionPairs((prevPairs) =>
        prevPairs.filter((pair) => pair.id !== pairId)
      );
    } catch (error) {
      console.error("Error deleting completion pair:", error);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gray-100 overflow-hidden">
      <NovelSidebar
        novels={novels}
        selectedNovel={selectedNovel}
        handleNovelClick={handleNovelClick}
        setIsNovelModalOpen={setIsNovelModalOpen}
      />
      {selectedNovel && (
        <ChapterSidebar
          chapters={chapters}
          selectedChapter={selectedChapter}
          handleChapterClick={handleChapterClick}
          setIsChapterModalOpen={setIsChapterModalOpen}
        />
      )}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex overflow-hidden">
          <RequestMessageSection
            selectedCompletionPair={selectedCompletionPair}
            setSelectedCompletionPair={setSelectedCompletionPair}
            selectedChapter={selectedChapter}
          />
          <ResponseMessageSection
            selectedCompletionPair={selectedCompletionPair}
            setSelectedCompletionPair={setSelectedCompletionPair}
          />
        </div>
        {selectedChapter && (
          <CompletionPairSidebar
            completionPairs={completionPairs}
            selectedCompletionPair={selectedCompletionPair}
            handleCompletionPairClick={handleCompletionPairClick}
            handleDeleteCompletionPair={handleDeleteCompletionPair}
          />
        )}
      </div>
      <ActionButtons
        selectedChapter={selectedChapter}
        selectedCompletionPair={selectedCompletionPair}
        selectedModel={selectedModel}
        selectedNovel={selectedNovel}
        setChapters={setChapters}
        setSelectedChapter={setSelectedChapter}
        models={models}
        setSelectedModel={setSelectedModel}
        isModelMenuOpen={isModelMenuOpen}
        setIsModelMenuOpen={setIsModelMenuOpen}
        generateCompletionPair={generateCompletionPair}
      />
      <NovelModal
        isOpen={isNovelModalOpen}
        onClose={() => setIsNovelModalOpen(false)}
        setNovels={setNovels}
      />
      <ChapterModal
        isOpen={isChapterModalOpen}
        onClose={() => setIsChapterModalOpen(false)}
        selectedNovel={selectedNovel}
        setChapters={setChapters}
      />
    </div>
  );
}

export default App;
