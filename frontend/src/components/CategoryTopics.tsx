import { v4 as uuidv4 } from "uuid";

export interface Category {
  id: string;
  title: string;
  icon?: string;
  topics: Topic[];
}

export interface Topic {
  id: string;
  name: string;
}

export function CategorySection({
  categories,
  onTopicSelect,
  selectedTopics,
}: {
  categories: Category;
  onTopicSelect: (topic: Topic) => void;
  selectedTopics: Topic[];
}) {
  const isSelected = (topicId: string) =>
    selectedTopics.some((topic) => topic.id === topicId);

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-gray-500 text-lg">{categories.icon || "📁"}</span>
        <h2 className="text-base font-semibold text-gray-900">
          {categories.title}
        </h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.topics.length > 0 ? (
          categories.topics.map((topic) => (
            <button
              key={topic.id ?? uuidv4()} 
              onClick={() => onTopicSelect(topic)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                isSelected(topic.id)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              {topic.name}
            </button>
          ))
        ) : (
          <p className="text-sm text-gray-500">No topics available</p>
        )}
      </div>
    </div>
  );
}
