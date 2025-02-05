import { useParams } from "react-router-dom";
import { useGetCommunityByIdQuery } from "../redux/communitiesSlice";
import { useGetPostsQuery } from "../redux/postsSlice";

const Community = () => {
  const { id } = useParams();
  const communityId = id || "";
  const { data: community, isLoading: communityLoading } = useGetCommunityByIdQuery(communityId);
  const { data: posts = [], isLoading: postsLoading } = useGetPostsQuery(communityId);


  if (communityLoading) return <p>Loading community...</p>;
  if (!community) return <p>Community not found</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold">r/{community.name}</h2>
      <p className="text-gray-600">{community.description}</p>

      <h3 className="mt-4 text-lg font-semibold">Posts</h3>
      {postsLoading ? (
        <p>Loading posts...</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id} className="border-b py-2">
              <h4 className="font-bold">{post.title}</h4>
              <p className="text-gray-600">{post.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Community;
