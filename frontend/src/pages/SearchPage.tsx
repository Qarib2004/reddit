import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSearchPostsQuery, useSearchCommunitiesQuery, useSearchCommentsQuery, useSearchUsersQuery} from "../redux/searchSlice";
import { ArrowBigUp, ArrowBigDown, MessageSquare, Users, FileText, User as UserIcon, Loader2 } from "lucide-react";
import { Post, Community, Comment, User } from "../interface/types";

const SearchPage: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";

  const { data: posts = [], isLoading: loadingPosts } = useSearchPostsQuery(query);
  const { data: communities = [], isLoading: loadingCommunities } = useSearchCommunitiesQuery(query);
  const { data: comments = [], isLoading: loadingComments } = useSearchCommentsQuery(query);
  const { data: users = [], isLoading: loadingUsers } = useSearchUsersQuery(query);


  const [activeTab, setActiveTab] = useState<"posts" | "communities" | "comments" | "users">("posts");

  useEffect(() => {
    setActiveTab("posts");
  }, [query]);

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
    </div>
  );

  const NoResults = ({ type }: { type: string }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
      <p className="text-gray-600 dark:text-gray-300">No {type} found matching "{query}"</p>
    </div>
  );

  const TabButton = ({ tab, icon: Icon }: { tab: string; icon: React.ElementType }) => (
    <button
      className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors
        ${activeTab === tab 
          ? "bg-orange-500 text-white" 
          : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"}`}
      onClick={() => setActiveTab(tab as any)}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden sm:inline">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Search results for "{query}"
        </h2>

        <div className="flex space-x-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <TabButton tab="posts" icon={FileText} />
          <TabButton tab="communities" icon={Users} />
          <TabButton tab="comments" icon={MessageSquare} />
          <TabButton tab="users" icon={UserIcon} />
        </div>

        {activeTab === "posts" && (
          <div className="space-y-4">
            {loadingPosts ? (
              <LoadingSpinner />
            ) : posts.length ? (
              posts.map((post: Post) => (
                <div key={post._id} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow">
                  <div className="flex">
                    <div className="flex flex-col items-center px-2 py-4 bg-gray-50 dark:bg-gray-700 rounded-l-lg">
                      <button className="text-gray-400 hover:text-orange-500">
                        <ArrowBigUp className="w-6 h-6" />
                      </button>
                      <span className="text-sm font-medium my-1">{post.upvotes.length - post.downvotes.length}
</span>
                      <button className="text-gray-400 hover:text-blue-500">
                        <ArrowBigDown className="w-6 h-6" />
                      </button>
                    </div>
                    <div className="p-4 flex-1">
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                        <span>Posted by u/{post.author?.username}</span>
                        <span className="mx-1">•</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{post.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{post.content}</p>
                      <div className="flex items-center mt-4 space-x-4 text-gray-500 dark:text-gray-400">
                        <button className="flex items-center space-x-1 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded">
                          <MessageSquare className="w-4 h-4" />
                          <span className="text-sm">{post.comments?.length || 0} Comments</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <NoResults type="posts" />
            )}
          </div>
        )}

        {activeTab === "communities" && (
          <div className="grid gap-4 sm:grid-cols-2">
            {loadingCommunities ? (
              <LoadingSpinner />
            ) : communities.length ? (
              communities.map((community: Community) => (
                <div key={community._id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">r/{community.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{community.membersCount || 0} members</p>
                    </div>
                  </div>
                  <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm">{community.description}</p>
                  <button className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white rounded-full py-2 text-sm font-medium transition-colors">
                    Join Community
                  </button>
                </div>
              ))
            ) : (
              <NoResults type="communities" />
            )}
          </div>
        )}

        {activeTab === "comments" && (
          <div className="space-y-4">
            {loadingComments ? (
              <LoadingSpinner />
            ) : comments.length ? (
              comments.map((comment: Comment) => (
                <div key={comment._id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      u/{comment.author.username}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      • {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{comment.content}</p>
                  <div className="flex items-center mt-3 space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <button className="flex items-center space-x-1">
                      <ArrowBigUp className="w-4 h-4" />
                      <span>{comment.upvotes.length - comment.downvotes.length}
</span>
                      <ArrowBigDown className="w-4 h-4" />
                    </button>
                    <button className="flex items-center space-x-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>Reply</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <NoResults type="comments" />
            )}
          </div>
        )}

        {activeTab === "users" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {loadingUsers ? (
              <LoadingSpinner />
            ) : users.length ? (
              users.map((user: User) => (
                <div key={user._id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} 
                      alt={user.username} 
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">u/{user.username}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user.karma || 0} karma 

                      </p>
                    </div>
                  </div>
                  <button className="mt-4 w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-full py-2 text-sm font-medium transition-colors">
                    View Profile
                  </button>
                </div>
              ))
            ) : (
              <NoResults type="users" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;