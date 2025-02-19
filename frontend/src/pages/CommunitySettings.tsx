import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetCommunityByIdQuery,
  useUpdateCommunityMutation,
} from "../redux/communitiesSlice";
import { toast } from "react-toastify";
import Loader from "../assets/loader-ui/Loader";

const CommunitySettings = () => {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();

  const { data: community, isLoading, refetch } = useGetCommunityByIdQuery(id || "", {
    skip: !id,
  });

  const [updateCommunity] = useUpdateCommunityMutation(); 
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"Public" | "Restricted" | "Private" | "Mature (18+)">("Public");

  useEffect(() => {
    if (community) {
      setName(community.name);
      setDescription(community.description);
      setType(community.type);
    }
  }, [community]);

  if (isLoading) return <Loader />;
  if (!community) return <p className="text-center p-4">Community not found</p>;

  const handleUpdate = async () => {
    if (!name.trim() || !description.trim()) {
      toast.error("Name and description are required!");
      return;
    }

    try {
      await updateCommunity({ id: community._id, name, description, type }).unwrap();
      toast.success("Community updated successfully!");
      refetch();
      navigate(`/community/${community._id}`);
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to update community");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4">Edit Community</h2>

      <label className="block text-gray-700">Community Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border border-gray-300 p-2 w-full rounded-md mb-4"
        placeholder="Enter community name"
      />

      <label className="block text-gray-700">Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border border-gray-300 p-2 w-full rounded-md mb-4"
        placeholder="Enter community description"
      />

      <label className="block text-gray-700">Community Type</label>
      <select
        value={type}
        onChange={(e) => setType(e.target.value as any)}
        className="border border-gray-300 p-2 w-full rounded-md mb-4"
      >
        <option value="Public">Public</option>
        <option value="Restricted">Restricted</option>
        <option value="Private">Private</option>
        <option value="Mature (18+)">Mature (18+)</option>
      </select>

      <button
        onClick={handleUpdate}
        className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
      >
        Save Changes
      </button>
    </div>
  );
};

export default CommunitySettings;
