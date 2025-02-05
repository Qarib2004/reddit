import { useState } from "react";
import { useGetPostsQuery } from "../redux/postsSlice"; 
import { Link } from "react-router-dom";


const Home = () => {
  const [sort, setSort] = useState("hot"); 
  const { data: posts, isLoading, error } = useGetPostsQuery(sort);

  if (isLoading) return <p className="text-center">Loading posts...</p>;
  if (error) return <p className="text-center text-red-500">Error loading posts</p>;

  return (
    <div className="flex">
      
      <div className="flex-1 max-w-2xl mx-auto p-4">
       
        <div className="flex justify-between items-center bg-white shadow-md p-3 rounded-md mb-4">
          <span className="text-sm font-bold">Sort by:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1"
          >
            <option value="best">Best</option>
            <option value="hot">Hot</option>
            <option value="new">New</option>
            <option value="top">Top</option>
            <option value="rising">Rising</option>
          </select>
        </div>

        
        {(posts || [])?.length > 0 ? (
          posts?.map((post:any) => (
            <div key={post._id} className="bg-white shadow-md p-4 mb-4 rounded-md">
              <Link to={`/community/${post.community}`} className="text-blue-500 text-sm font-bold">
                r/{post.community}
              </Link>
              <h3 className="text-lg font-semibold mt-1">{post.title}</h3>
              <p className="text-gray-600 text-sm">{post.content.slice(0, 150)}...</p>
              <div className="flex justify-between items-center mt-2 text-gray-500 text-sm">
                <span>👍 {post.upvotes} Upvotes</span>
                <span>💬 {post.comments.length} Comments</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No posts found.</p>
        )}
      </div>

     
      <div className="w-80 hidden lg:block">
        <div className="bg-white p-4 shadow-md rounded-md">
          <h3 className="text-lg font-semibold">Top Communities</h3>
          <ul className="mt-2">
            <li><Link to="/r/programming" className="text-blue-500">r/programming</Link></li>
            <li><Link to="/r/reactjs" className="text-blue-500">r/reactjs</Link></li>
            <li><Link to="/r/webdev" className="text-blue-500">r/webdev</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
