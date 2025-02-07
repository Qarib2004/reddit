import { v4 as uuidv4 } from "uuid";

export interface Category {
  _id: string;
  title: string;
  icon?: string;
  topics: Topic[];
}

export interface Topic {
  _id: string;
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
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-gray-500 text-lg">{categories.icon || "📁"}</span>
        <h2 className="text-base font-semibold text-gray-900">
          {categories.title}
        </h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.topics.map((topic) => (
        
          <button
            key={topic._id ?? uuidv4()}
            onClick={() => onTopicSelect(topic)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              selectedTopics.some((t) => t._id === topic._id)
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            {topic.name}
          </button>
        ))}
      </div>
    </div>
  );
}
