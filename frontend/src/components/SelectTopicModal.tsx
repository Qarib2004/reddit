import { useState } from "react";
import { useGetCategoriesQuery } from "../redux/categoriesSlice";
import { useUpdateUserMutation } from "../redux/apiSlice";
import { Topic } from "../components/CategoryTopics";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SelectTopicModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { data: categories = [], isLoading } = useGetCategoriesQuery();
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([]);
  const [updateUser] = useUpdateUserMutation();

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopics((prevTopics) => {
      const isSelected = prevTopics.some((t) => t._id === topic._id);
      return isSelected
        ? prevTopics.filter((t) => t._id !== topic._id)
        : prevTopics.length < 7
        ? [...prevTopics, topic]
        : prevTopics;
    });
  };

  const handleSubmit = async () => {
    try {
      console.log("📤 Отправляем топики на сервер:", selectedTopics.map((t) => t._id));
  
      await updateUser({ selectedTopics: selectedTopics.map((t) => t._id) }).unwrap();
      toast.success("Topics updated successfully! 🎉");
      onClose();
    } catch (error) {
      console.error("error:", error);
    }
  };
  

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-50"
      style={{ backdropFilter: "blur(4px)" }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-auto">
        <h2 className="text-lg font-bold mb-4">Choose up to 7 topics</h2>

        {isLoading ? (
          <p>Loading topics...</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <div key={category._id} className="mb-4 w-full">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{category.icon}</span>
                  <h3 className="text-gray-700 font-bold">{category.title}</h3>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {category.topics.map((topic: Topic) => (
                    <button
                      key={topic._id}
                      type="button"
                      onClick={() => handleTopicSelect(topic)}
                      className={`px-4 py-2 rounded-full transition-colors ${
                        selectedTopics.some((t) => t._id === topic._id)
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {topic.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
          >
            Skip
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            disabled={selectedTopics.length === 0}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectTopicModal;
