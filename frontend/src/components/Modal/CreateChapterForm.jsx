import { useState } from "react";
import axios from "axios";

const CreateChapterForm = ({ onClose, selectedNovel, setChapters }) => {
  const [chapterNumber, setChapterNumber] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/chapters/", {
        novel_id: selectedNovel.id,
        chapter_number: chapterNumber,
        system_prompt: systemPrompt,
      });
      setChapters((prevChapters) => [...prevChapters, response.data]);
      onClose();
    } catch (error) {
      console.error("Error creating chapter:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="text-xl font-bold mb-4">Chapter Number</label>
        <input
          type="number"
          value={chapterNumber}
          onChange={(e) => setChapterNumber(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />
      </div>
      <div className="mb-4">
        <label className="text-xl font-bold mb-4">System Prompt</label>
        <textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          rows="4"
        />
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
        >
          Create
        </button>
      </div>
    </form>
  );
};

export default CreateChapterForm;
