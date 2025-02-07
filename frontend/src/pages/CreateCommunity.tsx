import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useGetCategoriesQuery } from "../redux/categoriesSlice";
import {
  useCreateCommunityMutation,
  useGetCommunitiesQuery,
} from "../redux/communitiesSlice";
import { Category, Topic } from "../components/CategoryTopics";

const CreateCommunity = () => {
  const [step, setStep] = useState(1);
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([]);
  const { data: categories = [], isLoading } = useGetCategoriesQuery();
  const [createCommunity, { isLoading: isCreating }] =
    useCreateCommunityMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { refetch } = useGetCommunitiesQuery();

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 4));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopics((prevTopics) => {
      const isSelected = prevTopics.some((t) => t._id === topic._id);
      if (isSelected) {
        return prevTopics.filter((t) => t._id !== topic._id);
      }
      return prevTopics.length < 3 ? [...prevTopics, topic] : prevTopics;
    });
  };

  const onSubmit = async (data: any) => {
    if (step === 4) {
      const finalData = {
        ...data,
        topics: selectedTopics.map((topic) => topic._id),
      };
      try {
        await createCommunity(finalData).unwrap();
        toast.success("Community created successfully!");
        refetch();
      } catch (error: any) {
        toast.error(`Failed to create community: ${error.message}`);
      }
    } else {
      handleNext();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-center mb-4">
          {
            [
              "Tell us about your community",
              "What kind of community is this?",
              "Style your community",
              "Add topics",
            ][step - 1]
          }
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 && (
            <div>
              <label className="block text-sm font-bold mb-2">
                Community Name *
              </label>
              <input
                {...register("name", {
                  required: "Community name is required",
                })}
                className="w-full border rounded-md px-4 py-2"
                placeholder="Enter community name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">
                  {String(errors.name.message)}
                </p>
              )}

              <label className="block text-sm font-bold mt-4 mb-2">
                Description *
              </label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                className="w-full border rounded-md px-4 py-2"
                placeholder="Describe your community"
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {String(errors.description.message)}
                </p>
              )}
            </div>
          )}

          {step === 2 && (
            <div>
              <label className="block text-sm font-bold mb-2">
                Community Type *
              </label>
              {["Public", "Restricted", "Private", "Mature (18+)"].map(
                (type) => (
                  <label key={type} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value={type}
                      {...register("type", {
                        required: "Community type is required",
                      })}
                      className="form-radio"
                    />
                    <span>{type}</span>
                  </label>
                )
              )}
              {errors.type && (
                <p className="text-red-500 text-sm">
                  {String(errors.type.message)}
                </p>
              )}
            </div>
          )}

          {step === 3 && (
            <div>
              <label className="block text-sm font-bold mb-2">
                Style your community
              </label>
              <div className="flex flex-col space-y-4">
                <label className="block text-sm font-bold">Banner</label>
                <input
                  type="file"
                  {...register("banner")}
                  className="w-full border rounded-md px-4 py-2"
                />

                <label className="block text-sm font-bold">Icon</label>
                <input
                  type="file"
                  {...register("icon")}
                  className="w-full border rounded-md px-4 py-2"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <label className="block text-sm font-bold mb-2">
                Add topics *
              </label>
              {isLoading ? (
                <p>Loading topics...</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {categories.map((category: Category) => (
                    <div key={category._id} className="mb-4">
                      <div className="flex items-center gap-2">
                      
                        <span className="text-lg">{category.icon}</span>
                        <h3 className="text-gray-700 font-bold">
                          {category.title}
                        </h3>
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

              
              {selectedTopics.length === 0 && (
                <p className="text-red-500 text-sm mt-2">
                  Select at least one topic
                </p>
              )}

              
              <p className="text-gray-600 text-sm mt-2">
                Selected topics: {selectedTopics.length}/3
              </p>
            </div>
          )}

          <div className="flex justify-between">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              className={`text-white px-4 py-2 rounded-md ${
                isCreating ? "bg-gray-400" : "bg-blue-500"
              }`}
              disabled={
                isCreating || (step === 4 && selectedTopics.length === 0)
              }
            >
              {step === 4
                ? isCreating
                  ? "Creating..."
                  : "Create Community"
                : "Next"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCommunity;
