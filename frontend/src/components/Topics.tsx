
import { useGetCategoriesQuery } from "../redux/categoriesSlice";
import { CategorySection, Category, Topic } from "./CategoryTopics";

function Topics({
  selectedTopics,
  onTopicSelect,
}: {
  selectedTopics: Topic[];
  onTopicSelect: (topic: Topic) => void;
}) {
  const { data: categories = [], isLoading, error } = useGetCategoriesQuery();
 

  if (isLoading) {
    return <p className="text-gray-500 text-center">Loading topics...</p>;
  }

  if (error) {
    return (
      <p className="text-red-500 text-center">
        Failed to load categories. Please try again.
      </p>
    );
  }

  if (!categories.length) {
    return (
      <p className="text-gray-500 text-center">
        No categories available at the moment.
      </p>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {categories.map((category: Category) => (
        <CategorySection
          key={category._id}
          categories={category}
          selectedTopics={selectedTopics}
          onTopicSelect={onTopicSelect}
        />
      ))}
    </div>
  );
}

export default Topics;
