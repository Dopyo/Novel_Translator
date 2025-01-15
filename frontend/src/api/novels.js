import axios from "axios";

const API_URL = "http://localhost:5000/api/novels";

// Fetch all novels
export const fetchNovels = async (setNovels) => {
  try {
    const response = await axios.get(API_URL);
    setNovels(response.data); // Set the novels state
  } catch (error) {
    console.error("Error fetching novels:", error);
    throw error;
  }
};

// Create a new novel
export const createNovel = async (novelData) => {
  try {
    const response = await axios.post(API_URL, novelData);
    return response.data;
  } catch (error) {
    console.error("Error creating novel:", error);
    throw error;
  }
};

// Delete a novel by ID
export const deleteNovel = async (novelId) => {
  try {
    await axios.delete(`${API_URL}/${novelId}`);
  } catch (error) {
    console.error("Error deleting novel:", error);
    throw error;
  }
};
