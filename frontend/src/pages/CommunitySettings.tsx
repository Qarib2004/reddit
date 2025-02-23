import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetCommunityByIdQuery,
  useUpdateCommunityMutation,
  useDeleteCommunityMutation,
} from "../redux/communitiesSlice";
import { toast } from "react-toastify";
import Loader from "../assets/loader-ui/Loader";
import { Trash2, Upload } from "lucide-react";
import { useUploadImageMutation } from "../redux/communitiesSlice"; 
import Swal from "sweetalert2"; 
import "sweetalert2/dist/sweetalert2.min.css"; 
import { Helmet } from "react-helmet-async";


const CommunitySettings = () => {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();

  const { data: community, isLoading, refetch } = useGetCommunityByIdQuery(id || "", {
    skip: !id,
  });

  const [updateCommunity] = useUpdateCommunityMutation(); 
  const [deleteCommunity] = useDeleteCommunityMutation();
  const [uploadImage] = useUploadImageMutation(); 

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"Public" | "Restricted" | "Private" | "Mature (18+)">("Public");
  const [avatar, setAvatar] = useState<string>("");
  const [banner, setBanner] = useState<string>("");

  useEffect(() => {
    if (community) {
      setName(community.name);
      setDescription(community.description);
      setType(community.type);
      setAvatar(community.avatar);
      setBanner(community.banner);
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
      await updateCommunity({ id: community._id, name, description, type, avatar, banner }).unwrap();
      toast.success("Community updated successfully!");
      refetch();
      navigate(`/community/${community._id}`);
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to update community");
    }
  };

 

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "avatar" | "banner") => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append(type, file);
  
    try {
      const response = await uploadImage({ id, formData }).unwrap();
      if (type === "avatar") setAvatar(response.avatar);
      if (type === "banner") setBanner(response.banner);
      toast.success(`${type} updated successfully!`);
    } catch (error) {
      toast.error("Failed to upload image");
    }
  };
  
  
  const handleDeleteCommunity = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteCommunity(id!).unwrap();
          toast.success("Community deleted successfully!");
          navigate("/");
        } catch (error: any) {
          toast.error(error.data?.message || "Failed to delete community");
        }
      }
    });
  };


  return (
    <>
    <Helmet>
        <title>Community Settings</title>
      </Helmet>
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4">Edit Community</h2>

      <label className="block text-gray-700">Community Avatar</label>
      <div className="flex items-center gap-4 mb-4">
        <img src={avatar} alt="Community Avatar" className="w-16 h-16 rounded-full border" />
        <input type="file" onChange={(e) => handleImageUpload(e, "avatar")} className="hidden" id="avatarUpload" />
        <label htmlFor="avatarUpload" className="cursor-pointer bg-gray-200 px-3 py-1 rounded-md flex items-center gap-2">
          <Upload size={16} /> Upload Avatar
        </label>
      </div>

      <label className="block text-gray-700">Community Banner</label>
      <div className="flex flex-col mb-4">
        {banner && <img src={banner} alt="Community Banner" className="w-full h-32 object-cover rounded-md border mb-2" />}
        <input type="file" onChange={(e) => handleImageUpload(e, "banner")} className="hidden" id="bannerUpload" />
        <label htmlFor="bannerUpload" className="cursor-pointer bg-gray-200 px-3 py-1 rounded-md flex items-center gap-2">
          <Upload size={16} /> Upload Banner
        </label>
      </div>

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

      <div className="flex gap-4">
        <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded-md w-full">
          Save Changes
        </button>
        <button onClick={handleDeleteCommunity} className="bg-red-500 text-white px-4 py-2 rounded-md w-full flex items-center justify-center gap-2">
          <Trash2 size={16} /> Delete Community
        </button>
      </div>
    </div>
    </>
  );
};

export default CommunitySettings;
