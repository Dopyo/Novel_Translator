import axios from "axios";

const API_URL = "http://localhost:5000/api/completion-pairs";

// Fetch all completion pairs for a specific chapter
export const fetchCompletionPairsByChapter = async (
  chapterId,
  setCompletionPairs
) => {
  try {
    const response = await axios.get(`${API_URL}/chapter/${chapterId}`);
    setCompletionPairs(response.data);
  } catch (error) {
    console.error("Error fetching completion pairs:", error);
    throw error;
  }
};

// Delete a completion pair by ID
export const deleteCompletionPair = async (pairId) => {
  try {
    await axios.delete(`${API_URL}/${pairId}`);
  } catch (error) {
    console.error("Error deleting completion pair:", error);
    throw error;
  }
};
