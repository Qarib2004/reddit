

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetUserQuery } from '../redux/apiSlice';

const CreatePost = () => {
  const { data: user } = useGetUserQuery();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const handleImageUpload = async () => {
    if (!image) return null;
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    const response = await fetch(import.meta.env.VITE_CLOUDINARY_URL, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    return data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const imageUrl = await handleImageUpload();
    const postData = { title, content, image: imageUrl };
    const response = await fetch(`${import.meta.env.VITE_API_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    });
    if (response.ok) {
      navigate('/');
    }
  };

  return (
    <div>
      <h1>Create Post</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} required />
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreatePost;
