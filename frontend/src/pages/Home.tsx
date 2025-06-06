import { useEffect, useState } from "react";
import { useGetPostsQuery } from "../redux/postsSlice";
import { useGetUserQuery } from "../redux/apiSlice";
import { Link } from "react-router-dom";
import SelectTopicModal from "../components/SelectTopicModal";
import PostItem from "../components/PostItem";
import {
  Rocket,
  Flame,
  Clock,
  TrendingUp,
  Award,
  History,
  Search,
} from "lucide-react";
import Loader from "../assets/loader-ui/Loader";
import { Helmet } from "react-helmet-async";
import { Post } from "../interface/types";

const Home = () => {
  const [sort, setSort] = useState("hot");
  const [search, setSearch] = useState("");
  const {
    data: posts,
    error,
    isLoading,
  } = useGetPostsQuery({
    sort: "",
    search: "",
    community: "",
  });
  const { data: user } = useGetUserQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [sortedPosts, setSortedPosts] = useState<Post[]>([]);

  useEffect(() => {
    const hasSeenModal = localStorage.getItem("hasSeenTopicModal");
    if (!hasSeenModal && user && (!user.topics || user.topics.length === 0)) {
      setIsModalOpen(true);
      localStorage.setItem("hasSeenTopicModal", "true");
    }
  }, [user]);

  useEffect(() => {
    if (isLoading) {
      setShowLoader(true);
    } else {
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const getTimestamp = (dateString: string): number => {
    const timestamp = new Date(dateString).getTime();
    return isNaN(timestamp) ? Date.now() : timestamp;
  };

  useEffect(() => {
    if (!posts || !Array.isArray(posts)) {
      setSortedPosts([]);
      return;
    }

    const postsToSort = [...posts] as Post[];
    const currentTime = Date.now();

    const safeNumber = (value: any): number =>
      typeof value === "number" ? value : Number(value) || 0;

    switch (sort) {
      case "hot":
        postsToSort.sort((a, b) => {
          const scoreA = safeNumber(a.upvotes.length) - safeNumber(a.downvotes.length);
          const scoreB = safeNumber(b.upvotes.length) - safeNumber(b.downvotes.length);

          const timeA = getTimestamp(a.createdAt);
          const timeB = getTimestamp(b.createdAt);

          const timeDiffA = Math.max(currentTime - timeA, 1) / 45000;
          const timeDiffB = Math.max(currentTime - timeB, 1) / 45000;

          const timeFactorA =
            (Math.log(Math.max(Math.abs(scoreA), 1)) * Math.sign(scoreA)) /
            timeDiffA;
          const timeFactorB =
            (Math.log(Math.max(Math.abs(scoreB), 1)) * Math.sign(scoreB)) /
            timeDiffB;

          return timeFactorB - timeFactorA;
        });
        break;
      case "new":
        postsToSort.sort(
          (a, b) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt)
        );
        break;
      case "old":
        postsToSort.sort(
          (a, b) => getTimestamp(a.createdAt) - getTimestamp(b.createdAt)
        );
        break;
      case "top":
        postsToSort.sort(
          (a, b) =>
            safeNumber(b.upvotes.length) -
            safeNumber(a.downvotes.length) -
            (safeNumber(a.upvotes.length) - safeNumber(b.downvotes.length))
        );
        break;
      case "rising":
        postsToSort.sort((a, b) => {
          const timeA = getTimestamp(a.createdAt);
          const timeB = getTimestamp(b.createdAt);

          const ageA = Math.max((currentTime - timeA) / 3600000, 0.01);
          const ageB = Math.max((currentTime - timeB) / 3600000, 0.01);

          const scoreA = safeNumber(a.upvotes.length) - safeNumber(a.downvotes.length);
          const scoreB = safeNumber(b.upvotes.length) - safeNumber(b.downvotes.length);

          const rateA = scoreA / ageA || 0;
          const rateB = scoreB / ageB || 0;

          return rateB - rateA;
        });
        break;
      case "best":
        postsToSort.sort((a, b) => {
          const downvotesA = Math.max(safeNumber(a.downvotes.length), 1);
          const downvotesB = Math.max(safeNumber(b.downvotes.length), 1);

          const ratioA = safeNumber(a.upvotes.length) / downvotesA || 0;
          const ratioB = safeNumber(b.upvotes.length) / downvotesB || 0;

          return ratioB - ratioA;
        });
        break;

      default:
        postsToSort.sort(
          (a, b) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt)
        );
    }

    setSortedPosts(postsToSort);
  }, [posts, sort]);

  const sortOptions = [
    { value: "best", label: "Best", icon: Award },
    { value: "hot", label: "Hot", icon: Flame },
    { value: "new", label: "New", icon: Clock },
    { value: "top", label: "Top", icon: Rocket },
    { value: "rising", label: "Rising", icon: TrendingUp },
    { value: "old", label: "Old", icon: History },
  ];

  if (isLoading) return <Loader />;

  if (error)
    return (
      <div className="text-center text-red-500 p-8">Failed to load posts</div>
    );

  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>

      {user && (
        <SelectTopicModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <div className="max-w-[1000px] mx-auto px-4 flex gap-6 mt-[50px] sm:mt-0">
        <div className="flex-1">
          {/* <div className="flex justify-between items-center mb-4">
            <div className="relative w-2/3">
              <input
                type="text"
                placeholder="Search posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
              />
              <Search
                size={16}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
          </div> */}

          <div className="bg-white rounded-md mb-4 flex items-center">
            {sortOptions.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => {
                  setSort(value);
                }}
                className={`flex items-center space-x-1 px-4 py-3 text-sm font-medium ${
                  sort === value
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {sortedPosts.length > 0 ? (
            sortedPosts.map((post) => <PostItem key={post._id} post={post} />)
          ) : (
            <div className="text-center text-gray-500 p-8">No posts found</div>
          )}
        </div>

        <div className="hidden lg:block w-80">
          <div className="bg-white rounded-md overflow-hidden">
            <div className="bg-blue-500 p-4">
              <h3 className="text-white font-medium">Top Communities</h3>
            </div>
            <div className="p-4">
              {[
                "programming",
                "reactjs",
                "webdev",
                "javascript",
                "typescript",
              ].map((community, index) => (
                <Link
                  key={community}
                  to={`/r/${community}`}
                  className="flex items-center py-2 hover:bg-gray-50 -mx-4 px-4"
                >
                  <span className="text-sm font-medium text-gray-500 w-5">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-blue-500 hover:underline">
                    r/{community}
                  </span>
                </Link>
              ))}
              <button className="w-full mt-2 bg-blue-500 text-white rounded-full py-1.5 text-sm font-medium hover:bg-blue-600">
                View All
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
