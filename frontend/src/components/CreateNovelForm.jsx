import axios from "axios";
import Modal from "./Modal";

const CreateNovelForm = ({ onClose, setNovels }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.novelName.value;
    if (!name) return alert("Name is required");

    try {
      const response = await axios.post("http://localhost:5000/api/novels/", {
        name,
      });
      setNovels((prevNovels) => [...prevNovels, response.data]);
      onClose();
    } catch (error) {
      console.error("Error creating novel:", error);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4">Create Novel</h2>
        <input
          type="text"
          name="novelName"
          placeholder="Novel Name"
          className="w-full p-2 border rounded mb-4"
          required
        />
        <button
          type="submit"
          className="w-full bg-teal-500 text-white p-2 rounded hover:bg-teal-600"
        >
          Create
        </button>
      </form>
    </Modal>
  );
};

export default CreateNovelForm;
