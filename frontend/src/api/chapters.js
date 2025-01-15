import axios from "axios";

const API_URL = "http://localhost:5000/api/chapters";

// Fetch all chapters for a specific novel
export const fetchChaptersByNovel = async (novelId, setChapters) => {
  try {
    const response = await axios.get(`${API_URL}/novel/${novelId}`);
    setChapters(response.data); // Set the chapters state
  } catch (error) {
    console.error("Error fetching chapters:", error);
    throw error;
  }
};

// Create a new chapter
export const createChapter = async (chapterData) => {
  try {
    const response = await axios.post(API_URL, chapterData);
    return response.data;
  } catch (error) {
    console.error("Error creating chapter:", error);
    throw error;
  }
};

// Delete a chapter by ID
export const deleteChapter = async (chapterId) => {
  try {
    await axios.delete(`${API_URL}/${chapterId}`);
  } catch (error) {
    console.error("Error deleting chapter:", error);
    throw error;
  }
};
