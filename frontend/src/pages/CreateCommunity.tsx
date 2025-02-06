import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useGetCategoriesQuery } from "../redux/categoriesSlice";
import { useCreateCommunityMutation } from "../redux/communitiesSlice";
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

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopics((prevTopics) => {
      
      const isSelected = prevTopics.some((t) => t.id === topic.id);
  
      if (isSelected) {
       
        return prevTopics.filter((t) => t.id !== topic.id);
      } else {
       
        if (prevTopics.length < 3) {
          return [...prevTopics, topic];
        }
        return prevTopics;
      }
    });
  };
  
  

  const onSubmit = async (data: any) => {
    if (step === 4) {
      const finalData = {
        ...data,
        topics: selectedTopics.map((t) => t.id),
      };
      try {
        await createCommunity(finalData).unwrap();
        toast.success("Community created successfully!");
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
          {step === 1 && "Tell us about your community"}
          {step === 2 && "What kind of community is this?"}
          {step === 3 && "Style your community"}
          {step === 4 && "Add topics"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 && (
            <div>
              <label className="block text-sm font-bold mb-2">
                Community Name *
              </label>
              <input
                type="text"
                {...register("name", { required: "Community name is required" })}
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
              <div className="space-y-2">
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
              </div>
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
              <label className="block text-sm font-bold mb-2">Add topics *</label>
              {isLoading ? (
                <p>Loading topics...</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {categories.map((category: Category) => (
                    <div key={category.id} className="mb-4">
                      <h3 className="text-gray-700 font-bold">
                        {category.title}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {category.topics.map((topic: Topic) => (
                          <button
                            key={topic.id}
                            type="button"
                            onClick={() => handleTopicSelect(topic)}
                            className={`px-4 py-2 rounded-full ${
                              selectedTopics.some((t) => t.id === topic.id)
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100 text-gray-600"
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
              className={`${
                isCreating ? "bg-gray-400" : "bg-blue-500"
              } text-white px-4 py-2 rounded-md`}
              disabled={isCreating}
            >
              {step === 4 ? (isCreating ? "Creating..." : "Create Community") : "Next"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCommunity;
