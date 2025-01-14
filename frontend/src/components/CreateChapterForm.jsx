import axios from "axios";
const CreateChapterForm = ({ onClose, selectedNovel, setChapters }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const chapterNumber = e.target.chapterNumber.value;
    const systemPrompt = e.target.systemPrompt.value; // Get system prompt from form
    if (!chapterNumber || !selectedNovel) return;

    try {
      const response = await axios.post("http://localhost:5000/api/chapters/", {
        chapter_number: chapterNumber,
        novel_id: selectedNovel.id,
        system_prompt: systemPrompt, // Include system_prompt in the request
      });
      setChapters((prevChapters) => [...prevChapters, response.data]);
      onClose();
    } catch (error) {
      console.error("Error creating chapter:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-4">Create Chapter</h2>
      <input
        type="number"
        name="chapterNumber"
        placeholder="Chapter Number"
        className="w-full p-2 border rounded mb-4"
        required
      />
      <textarea
        name="systemPrompt"
        placeholder="System Prompt (optional)"
        className="w-full p-2 border rounded mb-4"
      />
      <button
        type="submit"
        className="w-full bg-teal-500 text-white p-2 rounded hover:bg-teal-600"
      >
        Create
      </button>
    </form>
  );
};

export default CreateChapterForm;
