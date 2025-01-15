import axios from "axios";

const API_URL = "http://localhost:5000/api/models";

// Fetch all models
export const fetchModels = async (setModels) => {
  try {
    const response = await axios.get(API_URL);
    setModels(response.data);
  } catch (error) {
    console.error("Error fetching models:", error);
    throw error;
  }
};
