import { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import Modal from "./components/Modal";
import CreateNovelForm from "./components/CreateNovelForm";
import CreateChapterForm from "./components/CreateChapterForm";

function App() {
  const [novels, setNovels] = useState([]);
  const [selectedNovel, setSelectedNovel] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [completionPairs, setCompletionPairs] = useState([]);
  const [selectedCompletionPair, setSelectedCompletionPair] = useState(null);
  const [isNovelSidebarCollapsed, setIsNovelSidebarCollapsed] = useState(false);
  const [isChapterSidebarCollapsed, setIsChapterSidebarCollapsed] =
    useState(false);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  const [isNovelModalOpen, setIsNovelModalOpen] = useState(false);
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);

  const fetchNovels = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/novels");
      setNovels(response.data);
    } catch (error) {
      console.error("Error fetching novels:", error);
    }
  };

  const fetchChapters = async (novelId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/chapters/novel/${novelId}`
      );
      setChapters(response.data);
    } catch (error) {
      console.error("Error fetching chapters:", error);
    }
  };

  const fetchCompletionPairs = async (chapterId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/completion-pairs/chapter/${chapterId}`
      );
      setCompletionPairs(response.data);
    } catch (error) {
      console.error("Error fetching completion pairs:", error);
    }
  };

  const fetchModels = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/models");
      setModels(response.data);
    } catch (error) {
      console.error("Error fetching models:", error);
    }
  };

  const handleNovelClick = (novel) => {
    setSelectedNovel(novel);
    setSelectedChapter(null); // Reset selected chapter when a new novel is selected
    setCompletionPairs([]); // Clear completion pairs
    setSelectedCompletionPair(null); // Clear selected completion pair
    fetchChapters(novel.id);
  };

  const handleChapterClick = (chapter) => {
    setSelectedChapter(chapter);
    setSelectedCompletionPair(null); // Clear selected completion pair
    fetchCompletionPairs(chapter.id);
  };

  const handleCompletionPairClick = (pair) => {
    setSelectedCompletionPair(pair);
  };

  const handleDeleteNovel = async (novelId) => {
    try {
      // Call the backend API to delete the novel
      await axios.delete(`http://localhost:5000/api/novels/${novelId}`);

      // Remove the deleted novel from the state
      setNovels((prevNovels) =>
        prevNovels.filter((novel) => novel.id !== novelId)
      );

      // If the deleted novel is currently selected, clear the selection
      if (selectedNovel?.id === novelId) {
        setSelectedNovel(null);
        setChapters([]); // Clear chapters related to the deleted novel
        setCompletionPairs([]); // Clear completion pairs
        setSelectedChapter(null); // Clear selected chapter
        setSelectedCompletionPair(null); // Clear selected completion pair
      }

      console.log("Novel deleted successfully");
    } catch (error) {
      console.error("Error deleting novel:", error);
    }
  };

  const handleDeleteChapter = async (chapterId) => {
    try {
      // Call the backend API to delete the chapter
      await axios.delete(`http://localhost:5000/api/chapters/${chapterId}`);

      // Remove the deleted chapter from the state
      setChapters((prevChapters) =>
        prevChapters.filter((chapter) => chapter.id !== chapterId)
      );

      // If the deleted chapter is currently selected, clear the selection
      if (selectedChapter?.id === chapterId) {
        setSelectedChapter(null);
        setCompletionPairs([]); // Clear completion pairs
        setSelectedCompletionPair(null); // Clear selected completion pair
      }

      console.log("Chapter deleted successfully");
    } catch (error) {
      console.error("Error deleting chapter:", error);
    }
  };

  const handleDeleteCompletionPair = async (pairId) => {
    try {
      // Call the backend API to delete the completion pair
      await axios.delete(
        `http://localhost:5000/api/completion-pairs/${pairId}`
      );

      // Remove the deleted pair from the state
      setCompletionPairs((prevPairs) =>
        prevPairs.filter((pair) => pair.id !== pairId)
      );

      // If the deleted pair is currently selected, clear the selection
      if (selectedCompletionPair?.id === pairId) {
        setSelectedCompletionPair(null);
      }

      console.log("Completion pair deleted successfully");
    } catch (error) {
      console.error("Error deleting completion pair:", error);
    }
  };

  const toggleNovelSidebar = () => {
    setIsNovelSidebarCollapsed(!isNovelSidebarCollapsed);
  };

  const toggleChapterSidebar = () => {
    setIsChapterSidebarCollapsed(!isChapterSidebarCollapsed);
  };

  const createNewChapter = async (novelId, systemPrompt = null) => {
    try {
      const response = await axios.post("http://localhost:5000/api/chapters/", {
        novel_id: novelId,
        chapter_number: chapters.length + 1,
        system_prompt: systemPrompt, // Include the system prompt
      });
      return response.data;
    } catch (error) {
      console.error("Error creating new chapter:", error);
      throw error;
    }
  };

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

      // Handle streaming response
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
    fetchNovels();
    fetchModels();
  }, []);

  return (
    <div className="flex h-screen w-screen bg-gray-100 overflow-hidden">
      {/* Left Sidebar - Novels */}
      <div
        className={`${
          isNovelSidebarCollapsed ? "w-16" : "w-64"
        } bg-gray-800 text-white p-6 shadow-lg transition-all duration-300 overflow-y-auto`}
      >
        {/* Toggle Button */}
        <button
          onClick={toggleNovelSidebar}
          className="mb-4 p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
        >
          {isNovelSidebarCollapsed ? ">>" : "<<"}
        </button>

        {/* Novel List */}
        {!isNovelSidebarCollapsed && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Novels</h2>
              {/* Button to open novel creation modal */}
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
                  {/* Delete icon (visible on hover) */}
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the li onClick from firing
                      handleDeleteNovel(novel.id);
                    }}
                  >
                    <FaTrash />
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* Middle Sidebar - Chapters */}
      {selectedNovel && (
        <div
          className={`${
            isChapterSidebarCollapsed ? "w-16" : "w-64"
          } bg-gray-700 text-white p-6 shadow-lg transition-all duration-300 overflow-y-auto`}
        >
          {/* Toggle Button */}
          <button
            onClick={toggleChapterSidebar}
            className="mb-4 p-2 bg-gray-600 rounded hover:bg-gray-500 transition-colors"
          >
            {isChapterSidebarCollapsed ? ">>" : "<<"}
          </button>

          {/* Chapter List */}
          {!isChapterSidebarCollapsed && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Chapters</h2>
                {/* Button to open chapter creation modal */}
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
                    {/* Delete icon (visible on hover) */}
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent the li onClick from firing
                        handleDeleteChapter(chapter.id);
                      }}
                    >
                      <FaTrash />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {/* Main Content and Right Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content - Messages */}
        <div className="flex-1 flex overflow-hidden">
          {/* Request Message Section */}
          <div className="flex-1 bg-black overflow-hidden p-0">
            <textarea
              className="w-full h-full p-6 border-none outline-none resize-none"
              value={
                selectedCompletionPair
                  ? selectedCompletionPair.request_json.messages
                      .map((msg) => msg.content)
                      .join("\n")
                  : "" // Ensure the value is always a string
              }
              onChange={(e) => {
                if (selectedCompletionPair) {
                  const updatedPair = { ...selectedCompletionPair };
                  updatedPair.request_json.messages = [
                    { role: "user", content: e.target.value },
                  ];
                  setSelectedCompletionPair(updatedPair);
                } else {
                  // Handle the case where selectedCompletionPair is null
                  setSelectedCompletionPair({
                    request_json: {
                      messages: [{ role: "user", content: e.target.value }],
                    },
                    response_json: { choices: [{ message: { content: "" } }] },
                  });
                }
              }}
              placeholder="Enter request message..."
            />
          </div>

          {/* Response Message Section */}
          <div className="flex-1 bg-black overflow-hidden p-0">
            <textarea
              className="w-full h-full p-6 border-none outline-none resize-none"
              value={
                selectedCompletionPair
                  ? selectedCompletionPair.response_json.choices[0].message
                      .content
                  : ""
              }
              onChange={(e) => {
                if (selectedCompletionPair) {
                  const updatedPair = { ...selectedCompletionPair };
                  updatedPair.response_json.choices[0].message.content =
                    e.target.value;
                  setSelectedCompletionPair(updatedPair);
                }
              }}
              placeholder="Enter response message..."
            />
          </div>
        </div>

        {/* Right Sidebar - Completion Pairs */}
        {selectedChapter && (
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
                  {/* Delete icon (visible on hover) */}
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the li onClick from firing
                      handleDeleteCompletionPair(pair.id);
                    }}
                  >
                    <FaTrash />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Model Selection and Action Icons */}
      <div className="fixed bottom-4 right-4 flex space-x-4">
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
              {models.map((model) => (
                <li
                  key={model.name}
                  className={`p-2 rounded cursor-pointer mb-2 transition-colors ${
                    selectedModel?.name === model.name
                      ? "bg-teal-500"
                      : "hover:bg-gray-600"
                  }`}
                  onClick={() => {
                    setSelectedModel(model);
                    setIsModelMenuOpen(false);
                  }}
                >
                  {model.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Create Completion Pair for Current Chapter */}
        <button
          onClick={() => {
            if (selectedChapter && selectedCompletionPair && selectedModel) {
              generateCompletionPair(
                selectedCompletionPair.request_json.messages[1].content, // [0] is the system prompt and [1] is the user prompt
                selectedChapter.id,
                selectedModel.name
              );
            }
          }}
          className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
        >
          ➕ Current Chapter
        </button>

        {/* Create Completion Pair for Next Chapter */}
        <button
          onClick={async () => {
            if (selectedChapter && selectedCompletionPair && selectedModel) {
              try {
                // Get the system prompt from the selected chapter
                const systemPrompt = selectedChapter.system_prompt;

                // Create a new chapter with the same system prompt
                const newChapter = await createNewChapter(
                  selectedNovel.id,
                  systemPrompt
                );

                // Generate a completion pair for the new chapter
                await generateCompletionPair(
                  selectedCompletionPair.request_json.messages[0].content,
                  newChapter.id,
                  selectedModel.name
                );

                // Refresh the chapters list
                await fetchChapters(selectedNovel.id);

                // Set the new chapter as the selected chapter
                setSelectedChapter(newChapter);
              } catch (error) {
                console.error("Error creating next chapter:", error);
              }
            }
          }}
          className="p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
        >
          ➕ Next Chapter
        </button>
      </div>
      {/* Novel creation modal */}
      <Modal
        isOpen={isNovelModalOpen}
        onClose={() => setIsNovelModalOpen(false)}
      >
        <CreateNovelForm
          onClose={() => setIsNovelModalOpen(false)}
          setNovels={setNovels}
        />
      </Modal>

      {/* Chapter creation modal */}
      <Modal
        isOpen={isChapterModalOpen}
        onClose={() => setIsChapterModalOpen(false)}
      >
        <CreateChapterForm
          onClose={() => setIsChapterModalOpen(false)}
          selectedNovel={selectedNovel}
          setChapters={setChapters}
        />
      </Modal>
    </div>
  );
}

export default App;
